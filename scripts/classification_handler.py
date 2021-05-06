import sys
import time
import csv
import numpy as np
import openzen
from collections import Counter
from datetime import datetime, date
sys.path.append("scripts/")
from data_queue import Data_Queue
from sensor_bank import Sensor_Bank, _remove_unsync_data
from rnn_utils import create_3d_array


class Classification_Handler:

    def __init__(self, sensor_bank):
        self.CLASSIFICATION_INTERVAL = 1 # Interval is in seconds
        self.SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400] 
        self.SLEEPTIME = 0.05
        self.sensor_bank = sensor_bank
        self.data_queue = None


    def _make_row(self, handle: int, imu_data: openzen.ZenImuData):
        """Create row with the following data columns:
            a (m/s^2): Accleration measurement after all corrections have been applied.
            g (deg/s): Gyroscope measurement after all corrections have been applied.
            r (deg/s): Three euler angles representing the current rotation of the sensor.
            q: Quaternion representing the current rotation of the sensor (w, x, y, z). 

        Args:
            handle (int): Sensor handle/id.
            imu_data (openzen.ZenImuData): Data from sensor's inertial measurement unit. 

        Returns:
            [float]: New row consisting of wanted data columns from sensors.
        """
        row = []
        row.append(handle)
        row.append(imu_data.timestamp)
        row += [imu_data.a[i] for i in range(3)]
        row += [imu_data.g[i] for i in range(3)]
        row += [imu_data.r[i] for i in range(3)]
        row += [imu_data.q[i] for i in range(4)]
        return row


    def collect_data(self, client: openzen.ZenClient):
        """Collect data from connected sensors.

        Args:
            client (openzen.ZenClient): Client object from the OpenZen-library.
            sensor_bank (Sensor_Bank): Object containing the connected sensors.
        """
        self.data_queue = Data_Queue(len(self.sensor_bank.sensor_dict))

        _remove_unsync_data(client)
        occurences = [0, 0, 0]
        tmp_rows = []
        aligned = False
        found_timestamps = []

        for sensor in self.sensor_bank.sensor_dict.values():
            sensor.start_collect()

        while not aligned:
            zenEvent = client.wait_for_next_event()
            imu_data = zenEvent.data.imu_data
            tmp_rows.append(self._make_row(self.sensor_bank.handle_to_id[zenEvent.sensor.handle], imu_data))
            found_timestamps.append(imu_data.timestamp)
            for i, x in enumerate(found_timestamps):
                found = 0
                for _, y in enumerate(found_timestamps[i:-1]):
                    if x == y:
                        found += 1
                if found == len(self.sensor_bank.sensor_dict):
                    clean_arr = []
                    for i in range(len(tmp_rows)):
                        if found_timestamps[i] >= x:
                            clean_arr.append(tmp_rows[i])
                    tmp_rows = clean_arr
                    aligned = True
                    break
        for row in tmp_rows:
            self.data_queue.push(row[0], row[1:])

        while self.sensor_bank.run:
            row = None
            zenEvent = client.wait_for_next_event()
            if zenEvent.event_type == openzen.ZenEventType.ImuData:
                occurences[self.sensor_bank.handle_to_id[zenEvent.sensor.handle] - 1] += 1
                imu_data = zenEvent.data.imu_data
                row = self._make_row(self.sensor_bank.handle_to_id[zenEvent.sensor.handle], imu_data)
                self.data_queue.push(row[0], row[1:])
            else:
                continue


    def _write_to_csv(self, writer: csv.writer, classification):
        """Write classification to csv.

        Args:
            writer (_csv.writer): Csv writer object.
            classification (int): Classification from 0-8 based on trained model.
        """
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        writer.writerow([current_time, classification])


    def _classification_fname(self):
        """Get the classification filename. Our naming convention takes use of todays date on the format (%Y-%m-%d.csv).

        Returns:
            str: Path to classification file.
        """
        return f'../classifications/{date.today().strftime("%Y-%m-%d")}.csv'


    def classify(self, model, type="rfc"):
        """Classify in realtime based on trained model and data in data queue.

        Args:
            model (tensorflow.python.keras.engine.sequential.Sequential): ANN model trained for n_sensors connected.
            sensor_bank (Sensor_Bank): Object containing the connected sensors.
            type (str): Type of model
        """
        values = []
        while True:
            if(min(self.data_queue.entries) == 0):
                time.sleep(self.SLEEPTIME)
            else:
                top_row = self.data_queue.shift()
                data = top_row[0][0][1:]
                for i in range(1, self.data_queue.n_sensors):
                    data += top_row[i][0][1:]
                values.append(data)

            if(len(values) == self.sensor_bank.sampling_rate):
                start_time_classify = time.perf_counter()
                values_np = np.array(values)
                arr = None

                if type == "cnn":
                    arr = values_np.reshape(values_np.shape[0], values_np.shape[1], 1)
                elif type == "rnn":
                    arr = np.array(create_3d_array(values, 50))
                elif type == "rfc":
                    arr = values_np.reshape(values_np.shape[0], values_np.shape[1])
                else:
                    arr = np.array(values)
                classify = np.array(model(arr) if type != "rfc" else model.predict(arr))
                classification = None

                if type != "rfc":
                    argmax = [classification.argmax() for classification in classify]
                    end_time_classify = time.perf_counter() - start_time_classify
                    classification = Counter(argmax).most_common(1)[0][0]
                else:
                    end_time_classify = time.perf_counter() - start_time_classify
                    classification = Counter(classify).most_common(1)[0][0]

                print(f"Classified as {classification} in {round(end_time_classify,2)}s!")
                with open(self._classification_fname(), 'a+', newline='') as file:
                    self._write_to_csv(csv.writer(file), classification)
                    values = []


if __name__ == "__main__":
    pass
