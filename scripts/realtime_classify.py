import time
import sys
import threading
import tensorflow as tf
import numpy as np
import openzen
import keras
from sklearn import preprocessing as pp
from joblib import dump, load
from collections import Counter
from Data_Queue import Data_Queue

PREDICTION_INTERVAL = 1 # Interval is in seconds
SAMPLING_RATE = 5
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
SLEEPTIME = 0.05
NUM_SENSORS = 3

SENSORS_ID = {
    "LPMSB2-3036EB": 1,
    "LPMSB2-4B3326": 2,
    "LPMSB2-4B31EE": 3
}

MAP_HANDLE_TO_ID = {}


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
            print(f"Found sensor {zenEvent.data.sensor_found.name} on IoType {zenEvent.data.sensor_found.io_type}")
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


def connect_and_get_imus(client, sensors, chosen_sensors):
    """
    Connects to all sensors using one client

    Input:\n
    client - clientobject from the OpenZen-library\n
    sensors - list of available sensors\n
    chosen_sensors - user input with chosen sensors\n

    Output:\n
    connected_sensors - list of connected sensors\n
    """
    imus = []
    connected_sensors = []

    if len(sensors) < 1:
        sys.exit("No sensors found!\nExiting...")

    for index in chosen_sensors:
        error, sensor = client.obtain_sensor(sensors[index])

        attempts = 0
        while not error == openzen.ZenSensorInitError.NoError:
            attempts += 1
            print("Error connecting to sensor")
            print("Trying again...")
            error, sensor = client.obtain_sensor(sensors[index])
            if attempts >= 100:
                print("Can't connect to sensor")
                sys.exit(1)

        # Obtain IMU from sensor and prevents it from streaming sensor_data yet
        imu = sensor.get_any_component_of_type(openzen.component_type_imu)
        imu.set_bool_property(openzen.ZenImuProperty.StreamData, False)

        # Set sampling rate
        set_sampling_rate(imu, SAMPLING_RATE)

        imus.append(imu)

        MAP_HANDLE_TO_ID[sensor.sensor.handle] = SENSORS_ID[sensors[index].name]

        print(
            f"Connected to sensor {MAP_HANDLE_TO_ID[sensor.sensor.handle]} - {sensors[index].name} ({round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%)!")

        connected_sensors.append(sensor)

    return connected_sensors, imus


def set_sampling_rate(IMU, sampling_rate):
    assert sampling_rate in SUPPORTED_SAMPLING_RATES, f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
    IMU.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]


def get_sampling_rate(IMU):
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]


def sync_sensors(imus):
    # Synchronize
    for imu in imus:
        imu.execute_property(openzen.ZenImuProperty.StartSensorSync)
    time.sleep(5)
    # Back to normal mode
    for imu in imus:
        imu.execute_property(openzen.ZenImuProperty.StopSensorSync)
    # Start streaming data
    for imu in imus:
        imu.set_bool_property(openzen.ZenImuProperty.StreamData, True)

    # Check if sensors stream data and has an IMU
    for imu in imus:
        error, is_streaming = imu.get_bool_property(openzen.ZenImuProperty.StreamData)
        if not error == openzen.ZenError.NoError:
            print("Can't load streaming settings")
            sys.exit(1)

        if imu is None:
            print("No IMU found")
            sys.exit(1)
        print(f"Sensor {MAP_HANDLE_TO_ID[imu.sensor.handle]} is streaming data: {is_streaming}")
    return imus


def _remove_unsync_data(client):
    zenEvent = client.poll_next_event()
    while(zenEvent != None):
        zenEvent = client.poll_next_event()


def _make_row(handle, imu_data):
    row = []
    row.append(handle)
    row.append(imu_data.timestamp)
    row += [imu_data.a[i] for i in range(3)]
    row += [imu_data.g[i] for i in range(3)]
    #row += [imu_data.b[i] for i in range(3)]
    row += [imu_data.r[i] for i in range(3)]
    row += [imu_data.q[i] for i in range(4)]
    return row


def collect_data(client, data_queue):
    occurences = [0, 0, 0]
    tmp_rows = []
    aligned = False
    found_timestamps = []

    while not aligned:
        zenEvent = client.wait_for_next_event()
        imu_data = zenEvent.data.imu_data
        tmp_rows.append(_make_row(MAP_HANDLE_TO_ID[zenEvent.sensor.handle], imu_data))
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

    while True:
        row = None
        zenEvent = client.wait_for_next_event()
        if zenEvent.event_type == openzen.ZenEventType.ImuData:
            occurences[int(zenEvent.sensor.handle) - 1] += 1
            imu_data = zenEvent.data.imu_data
            row = _make_row(MAP_HANDLE_TO_ID[zenEvent.sensor.handle], imu_data)
            data_queue.push(row[0], row[1:])
        else:
            continue


def classify(model, data_queue):
    values = []
    while True:

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
            predictions = model(np.array(values)).numpy()
            argmax = [pred.argmax() for pred in predictions]
            end_time_predict = time.perf_counter() - start_time_predict
            pred = Counter(argmax).most_common(1)[0][0]
            print(f"Predicted {pred} in {round(end_time_predict,2)}s!")
            values = []

if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    model = keras.models.load_model('model/models/ANN_model_3_um.h5')
    # model = load('rfc.joblib')

    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    # Scan, connect and syncronize sensors
    sensors_found = scan_for_sensors(client)
    user_input = [0, 1, 2]
    # user_input=[int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]
    data_queue = Data_Queue(len(user_input))
    NUM_SENSORS = len(user_input)
    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    _remove_unsync_data(client)
    sync_sensors(imus)

    # Classify
    classify_thread = threading.Thread(target=classify, args=[model, data_queue], daemon=True)
    classify_thread.start()

    collect_data(client, data_queue)
