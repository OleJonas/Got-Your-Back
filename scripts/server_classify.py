import csv
import time
import sys
import datetime
import openzen
import numpy as np
from collections import Counter

sys.path.append("scripts/")
from Data_Queue import Data_Queue

PREDICTION_INTERVAL = 1  # Interval is in seconds
SAMPLING_RATE = 5
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
SLEEPTIME = 0.05
NUM_SENSORS = 3
data_queue = None


def scan_for_sensors(client):
    """
    Scan for available sensors

    Input:\n
    client - clientobject from the OpenZen-library

    Output:\n
    sensors - list of available sensors
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
            print(f"Sensor listing progress: {lst_data.progress * 100}%", flush=True, end='')
            if lst_data.complete > 0:
                break

    print("Sensor Listing complete, found ", len(sensors), flush=True, end='')
    print("Listing found sensors in sensors array:\n", [sensor.name for sensor in sensors], flush=True, end='')

    return sensors


def connect_to_sensor(client, input_sensor, sensor_bank):
    err, sensor = client.obtain_sensor(input_sensor)

    attempts = 0
    while not err == openzen.ZenSensorInitError.NoError:
        attempts += 1
        print("Error connecting to sensor")
        print("Trying again...")
        err, sensor = client.obtain_sensor(input_sensor)
        if attempts >= 10:
            print("Can't connect to sensor")
            sys.exit(1)

    # Obtain IMU from sensor and prevent it from streaming sensor_data until asked to
    imu = sensor.get_any_component_of_type(openzen.component_type_imu)
    imu.set_bool_property(openzen.ZenImuProperty.StreamData, False)
    s_name = input_sensor.name
    battery_percent = f"{round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%"

    sensor_bank.handle_to_id_dict[sensor.sensor.handle] = sensor_bank.sensor_id_dict[input_sensor.name]

    print(
        f"Connected to sensor {s_name} ({battery_percent}%)!", flush=True, end='')

    return s_name, sensor, imu


def sync_sensors(client, sensor_bank):
    imu_arr = []
    for sensor in sensor_bank.sensor_dict.values():
        sensor.set_sampling_rate(sensor_bank.sampling_rate)
        imu_arr.append(sensor.imu_obj)

    # Synchronize
    for imu in imu_arr:
        imu.execute_property(openzen.ZenImuProperty.StartSensorSync)
    time.sleep(5)
    # Back to normal mode
    for imu in imu_arr:
        imu.execute_property(openzen.ZenImuProperty.StopSensorSync)

    _remove_unsync_data(client)


def _remove_unsync_data(client):
    zenEvent = client.poll_next_event()
    while(zenEvent != None):
        zenEvent = client.poll_next_event()


def _make_row(id, imu_data):
    row = []
    row.append(id)
    row.append(imu_data.timestamp)
    row += [imu_data.a[i] for i in range(3)]
    row += [imu_data.g[i] for i in range(3)]
    #row += [imu_data.b[i] for i in range(3)]
    row += [imu_data.r[i] for i in range(3)]
    row += [imu_data.q[i] for i in range(4)]
    return row


def collect_data(client, sensor_bank):
    global data_queue
    data_queue = Data_Queue(len(sensor_bank.sensor_dict))
    print(len(sensor_bank.sensor_dict), flush=True, end='')

    _remove_unsync_data(client)
    occurences = [0, 0, 0]
    tmp_rows = []
    aligned = False
    found_timestamps = []

    for sensor in sensor_bank.sensor_dict.values():
        sensor.start_collect()

    while not aligned:
        zenEvent = client.wait_for_next_event()
        imu_data = zenEvent.data.imu_data
        tmp_rows.append(_make_row(sensor_bank.handle_to_id_dict[zenEvent.sensor.handle], imu_data))
        found_timestamps.append(imu_data.timestamp)
        for i, x in enumerate(found_timestamps):
            found = 0
            for _, y in enumerate(found_timestamps[i:-1]):
                if x == y:
                    found += 1
            if found == NUM_SENSORS:
                clean_arr = []
                for i in range(len(tmp_rows)):
                    if found_timestamps[i] >= x:
                        clean_arr.append(tmp_rows[i])
                tmp_rows = clean_arr
                aligned = True
                break
    for row in tmp_rows:
        data_queue.push(row[0], row[1:])

    while sensor_bank.run:
        row = None
        zenEvent = client.wait_for_next_event()
        if zenEvent.event_type == openzen.ZenEventType.ImuData:
            occurences[int(zenEvent.sensor.handle) - 1] += 1
            imu_data = zenEvent.data.imu_data
            row = _make_row(sensor_bank.handle_to_id_dict[zenEvent.sensor.handle], imu_data)
            data_queue.push(row[0], row[1:])
        else:
            continue


def _classification_fname():
    return f'./classifications/classifications_{datetime.date.today().strftime("%Y%m%d")}.csv'


def _write_to_csv(writer, classification):
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    writer.writerow([current_time, classification])


def classify(client, model, sensor_bank):
    values = []
    file = open(_classification_fname(), "a")
    writer = csv.writer(file)
    while sensor_bank.run:
        if(min(data_queue.entries) == 0):
            time.sleep(SLEEPTIME)
        else:
            top_row = data_queue.shift()
            data = top_row[0][0][1:]
            for i in range(1, data_queue.n_sensors):
                data += top_row[i][0][1:]

            values.append(data)

        if(len(values) == SAMPLING_RATE):
            start_time_predict = time.perf_counter()
            classifications = model(np.array(values)).numpy()
            argmax = [classification.argmax() for classification in classifications]
            end_time_predict = time.perf_counter() - start_time_predict
            classification = Counter(argmax).most_common(1)[0][0]
            _write_to_csv(writer, classification)
            print(f"Classified as {classification} in {round(end_time_predict,2)}s!", flush=True, end='\n')
            values = []


if __name__ == "__main__":
    pass
