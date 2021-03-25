import sys
import openzen
import os
from tempfile import NamedTemporaryFile

SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]


class Sensor:
    def __init__(self, name, sensor, imu, id=-1):
        self.name = name
        self.sensor_obj = sensor
        self.imu_obj = imu
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

    def __init__(self, sensor_dict=dict(), sampling_rate=5, sleep_time=0.05, handle_to_id={}):
        self.sensor_dict = sensor_dict
        self.sampling_rate = sampling_rate
        self.sleep_time = sleep_time
        self.run = False

        self.sensor_id_dict = dict()
        with open("./scripts/sensor_id.txt", "r") as f:
            for line in f:
                sensor_and_id = line.split(" ")
                self.sensor_id_dict[sensor_and_id[0]] = int(sensor_and_id[1])
        print(self.sensor_id_dict) 

    def add_sensor(self, name, sensor, imu):
        sensor_conn = Sensor(name, sensor, imu, self.sensor_id_dict[name])
        self.sensor_dict[name] = sensor_conn

    def set_all_sampling_rates(self, sampling_rate):
        for name_key in self.sensor_dict:
            sensor_dict[name_key].set_sampling_rate(sampling_rate)
        self.sampling_rate = sampling_rate
        print(f"Sampling rates set to: {sampling_rate}")

    def set_id(self, name, id):
        with open("./scripts/sensor_id.txt") as fin, NamedTemporaryFile(dir='.', delete=False) as fout:
            for line in fin:
                if line.startswith(f"{name}"):
                    line = f"{name} {id}\n"
                fout.write(line.encode('utf8'))

        os.replace(fout.name, "./scripts/sensor_id.txt")
                    

    def get_sensor(self, name):
        for name_key in self.sensor_dict:
            if name == name_key:
                return self.sensor_dict[name_key]
        return None

    def disconnect_sensor(self, name):
        if name in self.sensor_dict:
            print("Fant sensor ", name)
            self.sensor_dict[name].sensor_obj.release()
            self.sensor_dict.pop(name)

            print("Sensors left:")
            print(self.sensor_dict.keys())

    def set_sleep_time(self, sleep_time):
        self.sleep_time = sleep_time
