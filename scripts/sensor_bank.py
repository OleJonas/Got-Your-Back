import openzen
import sys

class Sensor_Bank:
    SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
    discovered_sensors = []

    def __init__(self, sensor_arr=None, imu_arr=None, sampling_rate=5, sleeptime=0.05, handle_to_id={}):
        self.sensor_arr = sensor_arr
        self.imu_arr = imu_arr
        self.n_sensors = len(sensor_arr)
        self.sampling_rate = sampling_rate
        self.sleep_time = sleep_time

        self.sensor_id_dict = {
            "LPMSB2-3036EB": 1,
            "LPMSB2-4B3326": 2,
            "LPMSB2-4B31EE": 3
        }

        self.handle_to_id = handle_to_id

        
    def connect_to_sensor(self, input_sensor):
        err, sensor = self.client.obtain_sensor(input_sensor)

        attempts = 0
        while not err == openzen.ZenSensorInitError.NoError:
            attempts += 1
            print("Error connecting to sensor")
            print("Trying again...")
            err, sensor = self.client.obtain_sensor(sensor)
            if attempts >= 100:
                print("Can't connect to sensor")
                sys.exit(1)
        
        # Obtain IMU from sensor and prevent it from streaming sensor_data until asked to
        imu = sensor.get_any_component_of_type(openzen.component_type_imu)
        imu.set_bool_property(openzen.ZenImuProperty.StreamData, False)
        
        self.set_sampling_rate(imu, self.sampling_rate)

        self.sensor_arr.append(sensor)
        self.imu_arr.append(imu)

        sensor_id = self.sensor_id_dict[sensor.name]
        battery_percent = round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)

        self.handle_to_id[sensor.sensor.handle] = sensor_id

        print(
            f"Connected to sensor {sensor_id} - {sensor.name} ({battery_percent}%)!")
        
        return sensor_id, battery_percent


    def set_sampling_rate(self, imu, sampling_rate):
        assert sampling_rate in SUPPORTED_SAMPLING_RATES, \
            f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
        imu.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)


    def set_all_sampling_rates(self, sampling_rate):
        for imu in self.imu_arr:
            self.set_sampling_rate(imu, sampling_rate)
        self.sampling_rate = imu.get_int32_property(openzen.ZenImuProperty.SamplingRate)
        print(f"Sampling rates set to: {sampling_rate}")
    

    def _sync_sensors(self):
        pass

    def _remove_unsync_data(self):
        pass   