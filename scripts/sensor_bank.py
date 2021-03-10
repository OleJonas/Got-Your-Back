import sys
import openzen

SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]

class Sensor:
    def __init__(self, name, sensor, imu):
        self.name = name
        self.sensor_obj = sensor
        self.imu_obj = imu
        self.handle = sensor.sensor.handle

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

    def __init__(self, sensor_arr=[], sampling_rate=5, sleep_time=0.05, handle_to_id={}):
        self.sensor_arr = sensor_arr
        self.n_sensors = len(sensor_arr)
        self.sampling_rate = sampling_rate
        self.sleep_time = sleep_time
        self.run = False

        self.sensor_id_dict = {
            "LPMSB2-3036EB": 1,
            "LPMSB2-4B3326": 2,
            "LPMSB2-4B31EE": 3
        }

        self.handle_to_id = handle_to_id

    def add_sensor(self, name, sensor, imu):
        sensor_conn = Sensor(name,sensor,imu)
        self.sensor_arr.append(sensor_conn)
        self.handle_to_id[sensor_conn.handle] = self.sensor_id_dict[name]

    def set_all_sampling_rates(self, sampling_rate):
        for sensor in self.sensor_arr:
            sensor.set_sampling_rate(sampling_rate)
        self.sampling_rate = sampling_rate
        print(f"Sampling rates set to: {sampling_rate}")

    def set_sleep_time(self, sleep_time):
        self.sleep_time = sleep_time