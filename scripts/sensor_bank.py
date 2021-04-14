import openzen

SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]


class Sensor:
    """Class representing a sensor with the properties we want from the OpenZen-library.
    """

    def __init__(self, name, sensor, imu, id):
        self.name = name
        self.sensor_obj = sensor
        self.imu_obj = imu
        self.id = id

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
            #Making an arbitrary call to the sensor object to see if it gives a response, if it doesn't, the sensor is no longer connected.
            err, test = self.sensor_obj.get_float_property(openzen.ZenSensorProperty.BatteryLevel)
            if not err == openzen.ZenError.NoError:
                return False
        except:
            print("sensor_obj failed bruh")
            return False
        return True

    def set_sampling_rate(self, sampling_rate):
        """Sets the sampling rate.

        Args:
            sampling_rate (int): New sampling rate.
        """
        assert sampling_rate in SUPPORTED_SAMPLING_RATES, \
            f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
        self.imu_obj.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)

    def start_collect(self):
        """Start to stream data from sensor.
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

    def add_sensor(self, name, sensor, imu):
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

        self.sensor_dict[name] = Sensor(name, sensor, imu, helper_id)
        print("connected")
        self.n_sensors += 1


    def set_all_sampling_rates(self, sampling_rate):
        """Set the sampling rates for all sensors connected.

        Args:
            sampling_rate (int): New sampling rate.
        """        
        for sensor in self.sensor_dict.values():
            sensor.set_sampling_rate(sampling_rate)
        self.sampling_rate = sampling_rate
        print(f"Sampling rates set to: {sampling_rate}")

    def get_sensor(self, name):
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

    def disconnect_sensor(self, name):
        """Disconnect sensor from sensor bank.

        Args:
            name (str): Sensor name
        """        
        if name in self.sensor_dict:
            self.sensor_dict[name].sensor_obj.release()
            self.sensor_dict.pop(name)
            self.n_sensors -= 1

        print(f"sensor_dict after disconnect: {self.sensor_dict}")


    def test_dead(self):
        dead = None
        for sensor in self.sensor_dict.values():
            print(sensor.name)
            if not sensor.check_alive():
                dead = sensor.name
                break
        
        self.sensor_dict.pop(dead)
        self.n_sensors -= 1
        return f"{self.sensor_dict}"


    def verify_sensors_alive(self):
        dead_sensors = []
        for sensor in self.sensor_dict.values():
            print(sensor.name)
            if not sensor.check_alive():
                dead_sensors.append(sensor.name)
        
        for s_name in dead_sensors:
            self.sensor_dict.pop(s_name)
            self.n_sensors -= 1
        
        return f"Sensor dict after error handling...: {self.sensor_dict}"

    def set_sleep_time(self, sleep_time):
        """Set sleep time.

        Args:
            sleep_time (float): Time wanted to sleep for when needed.
        """        
        self.sleep_time = sleep_time
