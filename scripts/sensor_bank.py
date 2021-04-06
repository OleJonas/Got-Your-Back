import openzen

SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]


class Sensor:
    def __init__(self, name, sensor, imu, handle, id):
        self.name = name
        self.sensor_obj = sensor
        self.imu_obj = imu
        self.handle = handle
        self.id = id

    def get_battery_percentage(self):
        return f"{round(self.sensor_obj.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%"

    def set_sampling_rate(self, sampling_rate):
        assert sampling_rate in SUPPORTED_SAMPLING_RATES, \
            f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
        self.imu_obj.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)

    def start_collect(self):
        self.imu_obj.set_bool_property(openzen.ZenImuProperty.StreamData, True)


class Sensor_Bank:
    """
    Class to make managing sensor properties easier
    """

    def __init__(self, sensor_dict={}, sampling_rate=5, sleep_time=0.05, handle_to_id={}):
        self.sensor_dict = sensor_dict
        self.n_sensors = 0
        self.sampling_rate = sampling_rate
        self.sleep_time = sleep_time
        self.run = False

        self.sensor_id_dict = {
            "LPMSB2-3036EB": 1,
            "LPMSB2-4B3326": 2,
            "LPMSB2-4B31EE": 3  # 3
        }

        self.handle_to_id = handle_to_id

    def add_sensor(self, name, sensor, imu):
        if name in self.sensor_id_dict:
            self.n_sensors += 1
            s = Sensor(name, sensor, imu, self.n_sensors, self.sensor_id_dict[name])
            self.sensor_dict[name] = s
            self.handle_to_id[s.handle] = self.sensor_id_dict[name]
        else:
            print("Sensor not in sensor_id_dict. Please add it manually...")

    def set_all_sampling_rates(self, sampling_rate):
        for sensor in self.sensor_dict.values():
            sensor.set_sampling_rate(sampling_rate)
        self.sampling_rate = sampling_rate
        print(f"Sampling rates set to: {sampling_rate}")

    def get_sensor(self, name):
        if name in self.sensor_dict:
            return self.sensor_dict[name]
        print(f"Sensor with name {name} is not connected...")
        return None

    def disconnect_sensor(self, name):
        if name in self.sensor_dict:
            self.sensor_dict[name].sensor_obj.release()
            self.sensor_dict.pop(name)

        print(f"sensor_dict after disconnect: {self.sensor_dict}")
        return

    def set_sleep_time(self, sleep_time):
        self.sleep_time = sleep_time
