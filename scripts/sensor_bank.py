try:
    import openzen
except ImportError:
    pass
import time
import threading

SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]


class Sensor:
    """Class representing a sensor with the properties we want from the OpenZen-library.
    """

    def __init__(self, name: str, sensor, imu, id: int, zen_handle: int):
        self.name = name
        self.sensor_obj = sensor
        self.imu_obj = imu
        self.id = id
        self.zen_handle = zen_handle

    def get_battery_percentage(self):
        """Get the battery percentage.

        Returns:
            str: Battery percentage of sensor, with one decimal precision.
        """
        return f"{round(self.sensor_obj.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%"

    def check_alive(self):
        """Checking if sensor has run out of battery or otherwise unexpectedly disconnected
        """
        try:
            # Making an arbitrary call to the sensor object to see if it gives a response, if it doesn't, the sensor is no longer connected.
            err, test = self.sensor_obj.get_float_property(openzen.ZenSensorProperty.BatteryLevel)
            if not err == openzen.ZenError.NoError or round(test,1) == 0.0:
                return False
        except:
            return False
        return True

    def set_sampling_rate(self, sampling_rate: int):
        """Sets the sampling rate.

        Args:
            sampling_rate (int): New sampling rate.
        """
        assert sampling_rate in SUPPORTED_SAMPLING_RATES, \
            f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
        self.imu_obj.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)

    def start_collect(self):
        """Start streaming data from sensor.
        """
        self.imu_obj.set_bool_property(openzen.ZenImuProperty.StreamData, True)


class Sensor_Bank:
    """
    Class to make managing sensor properties easier.
    """

    def __init__(self, sensor_dict={}, sampling_rate=5, sleep_time=0.05):
        self.sensor_dict = sensor_dict
        self.n_sensors = 0
        self.sampling_rate = sampling_rate
        self.sleep_time = sleep_time
        self.run = False
        self.lock = threading.Lock()
        self.zen_handles = 1
        self.handle_to_id = {}

    def add_sensor(self, name: str, sensor: openzen.ZenSensor or str, imu: openzen.ZenSensorComponent or str):
        """Add sensor to sensor bank.

        Args:
            name (str): Sensor name.
            sensor (openzen.ZenSensor): Sensor object.
            imu (openzen.ZenSensorComponent): inertial measurement unit.
        """
        helper_id = 1
        for s in self.sensor_dict.values():
            if helper_id == s.id:
                helper_id += 1
        self.sensor_dict[name] = Sensor(name, sensor, imu, helper_id, self.zen_handles)
        self.handle_to_id[self.zen_handles] = helper_id
        self.n_sensors += 1
        self.zen_handles += 1

    def set_all_sampling_rates(self, sampling_rate: int):
        """Set the sampling rates for all sensors connected.

        Args:
            sampling_rate (int): New sampling rate.
        """
        for sensor in self.sensor_dict.values():
            sensor.set_sampling_rate(sampling_rate)
        self.sampling_rate = sampling_rate
        print(f"Sampling rates set to: {sampling_rate}")

    def get_sensor(self, name: str):
        """Get sensor object from sensor bank.

        Args:
            name (str): Sensor name.

        Returns:
            openzen.ZenSensor: Sensor object if found, else None.
        """
        if name in self.sensor_dict:
            return self.sensor_dict[name]
        print(f"Sensor with name {name} is not connected...")
        return None

    def disconnect_sensor(self, name: str):
        """Disconnect sensor from sensor bank.

        Args:
            name (str): Sensor name
        """
        if name in self.sensor_dict:
            try:
                self.sensor_dict[name].sensor_obj.release()
            except:
                print("Already disconnected")

            self.handle_to_id.pop(self.sensor_dict[name].zen_handle)
            self.sensor_dict.pop(name)
            self.n_sensors -= 1

        print(f"sensor_dict after disconnect: {self.sensor_dict}")

    def verify_sensors_alive(self):
        dead_sensors = []
        for sensor in self.sensor_dict.values():
            alive = sensor.check_alive()
            if not alive:
                dead_sensors.append(sensor.name)

        for s_name in dead_sensors:
            self.handle_to_id.pop(self.sensor_dict[s_name].zen_handle)
            self.sensor_dict.pop(s_name)
            self.n_sensors -= 1

        if len(dead_sensors) > 0:
            return False
        return True

    def set_sleep_time(self, sleep_time: float):
        """Set sleep time.

        Args:
            sleep_time (float): Time wanted to sleep for when needed.
        """
        self.sleep_time = sleep_time

    def scan_for_sensors(self, client: openzen.ZenClient):
        """Scan for available sensors.

        Args:
            client (openzen.ZenClient): Client object from the OpenZen-library.

        Returns:
            [openzen.ZenSensorDesc]: List of available sensor objects.
        """
        client.list_sensors_async()

        # Check for events
        sensors = []
        while True:
            zenEvent = client.wait_for_next_event()

            if zenEvent.event_type == openzen.ZenEventType.SensorFound:
                print(f"Found sensor {zenEvent.data.sensor_found.name} on IoType {zenEvent.data.sensor_found.io_type}", flush=True, end='')
                # Check if found device is a bluetooth device
                if zenEvent.data.sensor_found.io_type == "Bluetooth":
                    sensors.append(zenEvent.data.sensor_found)

            if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
                lst_data = zenEvent.data.sensor_listing_progress
                print(f"Sensor listing progress: {lst_data.progress * 100}%")
                if lst_data.complete > 0:
                    break

        print("Sensor Listing complete, found ", len(sensors))
        print("Listing found sensors in sensors array:\n", [sensor.name for sensor in sensors])
        return sensors

    def connect_to_sensor(self, client: openzen.ZenClient, input_sensor: openzen.ZenSensorComponent):
        """Connects to chosen sensor and establishes a connection to it's inertial measurement unit.

        Args:
            client (openzen.ZenClient): Client object from the OpenZen-library.
            input_sensor (openzen.ZenSensorDesc): Found sensor object from the OpenZen-library.

        Returns:
            str: Sensor name.
            openzen.ZenSensor: Sensor object.
            openzen.ZenSensorComponent: imu.
        """
        err, sensor = client.obtain_sensor(input_sensor)
        attempts = 0
        while not err == openzen.ZenSensorInitError.NoError:
            attempts += 1
            print("Error connecting to sensor")
            print("Trying again...")
            err, sensor = client.obtain_sensor(input_sensor)
            if attempts >= 5:
                print("Can't connect to sensor")
                # sys.exit(1)
                return

        # Obtain IMU from sensor and prevent it from streaming sensor_data until asked to
        imu = sensor.get_any_component_of_type(openzen.component_type_imu)
        imu.set_bool_property(openzen.ZenImuProperty.StreamData, False)
        s_name = input_sensor.name
        battery_percent = f"{round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%"

        print(
            f"Connected to sensor {s_name} ({battery_percent})!", flush=True)

        return s_name, sensor, imu

    def sync_sensors(self, client: openzen.ZenClient):
        """Synchronize sensors.

        Args:
            client (openzen.ZenClient): Client object from the OpenZen-library.
        """
        imu_arr = []
        for sensor_conn in self.sensor_dict.values():
            sensor_conn.set_sampling_rate(self.sampling_rate)
            imu_arr.append(sensor_conn.imu_obj)

        # Synchronize
        for imu in imu_arr:
            imu.execute_property(openzen.ZenImuProperty.StartSensorSync)
        time.sleep(5)
        # Back to normal mode
        for imu in imu_arr:
            imu.execute_property(openzen.ZenImuProperty.StopSensorSync)

        _remove_unsync_data(client)

    def acquire_lock(self):
        return self.lock


def _get_client():
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        return
    return client


def _remove_unsync_data(client: openzen.ZenClient):
    """Removes data events from before sensor synchronization.

    Args:
        client (openzen.ZenClient): Client object from the OpenZen-library.
    """
    zenEvent = client.poll_next_event()
    while(zenEvent != None):
        zenEvent = client.poll_next_event()
