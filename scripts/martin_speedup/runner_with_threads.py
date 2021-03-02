import time
import sys
import csv
import keras
from sklearn import preprocessing as pp
import time
import openzen
import numpy as np
import threading
from Queue import Pred_Queue, Data_Queue
from joblib import dump, load


PREDICTION_INTERVAL = 1
SAMPLING_RATE = 10
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
SLEEPTIME = 0.1
NUM_SENSORS = 3
sensor_data = []
done_collecting = False


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

        print(
            f"Connected to sensor {sensor.sensor.handle} - {sensors[index].name} ({round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%)!")

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
        print(f"Sensor {imu.sensor.handle} is streaming data: {is_streaming}")
    return imus


def remove_unsync_data(client):
    zenEvent = client.poll_next_event()
    while(zenEvent != None):
        zenEvent = client.poll_next_event()


def collect_data(client, data_queue):
    occurences = [0, 0, 0]
    tmp_rows = []
    aligned = False
    found_timestamps = []
    while not aligned:
        zenEvent = client.wait_for_next_event()
        imu_data = zenEvent.data.imu_data
        tmp_rows.append(_make_row(zenEvent.sensor.handle, imu_data))
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
            row = _make_row(zenEvent.sensor.handle, imu_data)
            data_queue.push(row[0], row[1:])
        else:
            continue


def concat_data(data_queue, pred_queue):
    while True:
        # If no work for worker thread, sleep
        if(min(data_queue.entries) == 0):
            time.sleep(SLEEPTIME)
        else:
            top_row = data_queue.shift()
            data = top_row[0][0]
            for i in range(1, data_queue.n_columns):
                data += top_row[i][0][1:]
            pred_queue.push(data[1:])

def _make_row(handle, imu_data):
    row = []
    row.append(handle)
    row.append(imu_data.timestamp)
    row += [imu_data.a[i] for i in range(3)]
    row += [imu_data.g[i] for i in range(3)]
    row += [imu_data.b[i] for i in range(3)]
    row += [imu_data.r[i] for i in range(3)]
    row += [imu_data.q[i] for i in range(4)]
    print(row)
    return row

def classification(model, pred_queue):
    while True:
        values = []
        rows = 0
        while rows < 20:
            val = pred_queue.shift()
            if val != None:
                #print(val)
                values.append(val)
                rows += 1
        rows = 0

        if values != None:
            values = np.squeeze(values)
            start = time.perf_counter()
            predictions = model.predict(values)
            #print(time.perf_counter() - start)
            """for index in range(len(predictions)):
                #print("Pred: ", predictions[index].argmax())

            values = np.squeeze(values)
            scaler = pp.MinMaxScaler()
            scaler.fit(values)
            values = scaler.transform(values)
            start_time = time.perf_counter()

            #classification_res = np.argmax(model.predict(values, batch_size=SAMPLING_RATE * PREDICTION_INTERVAL)[0])
            classification_res = model.predict(values, batch_size=SAMPLING_RATE * PREDICTION_INTERVAL)
            elapsed_time = round(time.perf_counter() - start_time, 2)
            #print(classification_res)
            print(f"Predicted {classification_res} in {elapsed_time}s!")"""


if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    # model = keras.models.load_model('ANN_model.h5')
    model = load('rfc.joblib')
    pred_queue = Pred_Queue()

    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    # Scan, connect and syncronize sensors
    sensors_found = scan_for_sensors(client)
    user_input = [0, 1, 2]
    # user_input=[int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]

    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    remove_unsync_data(client)
    sync_sensors(imus)

    # Start collecting and concatting data
    data_queue = Data_Queue(len(user_input))
    concat_thread = threading.Thread(target=concat_data, args=[data_queue, pred_queue], daemon=True)
    collect_data_thread = threading.Thread(target=collect_data, args=[client, data_queue], daemon=True)
    collect_data_thread.start()
    concat_thread.start()

    # Run realtime classification
    classification(model, pred_queue)
