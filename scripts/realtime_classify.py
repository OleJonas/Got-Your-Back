"""Classification in realtime using terminal.

Implemented methods for scanning, listing and connecting to supported sensors using the openZen library.
After the connection is established, a new thread is made. This thread is supposed to take care of the live 
classification, such as loading the right model, and write the classifications in realtime to a file and terminal. 
Further on, the main task of the main thread is to flush excess data, synchronize and collecting data until killed.
"""
import time
import sys
import threading
from datetime import datetime
import numpy as np
import openzen
import csv
import keras
from collections import Counter
from data_queue import Data_Queue
from rnn_utils import create_3d_array
from joblib import load

PREDICTION_INTERVAL = 1  # Interval is in seconds
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


def scan_for_sensors(client: openzen.ZenClient):
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
            print(f"Found sensor {zenEvent.data.sensor_found.name} on IoType {zenEvent.data.sensor_found.io_type}")
            # Check if found device is a bluetooth device
            if zenEvent.data.sensor_found.io_type == "Bluetooth":
                print(zenEvent.data.sensor_found)
                sensors.append(zenEvent.data.sensor_found)

        if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
            lst_data = zenEvent.data.sensor_listing_progress
            print(f"Sensor listing progress: {lst_data.progress * 100}%")
            if lst_data.complete > 0:
                break

    print(f"Sensor Listing complete, found {len(sensors)}")
    print("Listing found sensors in sensors array:\n", [sensor.name for sensor in sensors])
    return sensors


def connect_and_get_imus(client: openzen.ZenClient, sensors: list, chosen_sensors: list):
    """Connects to chosen sensors and get a connection to their inertial measurement unit.

    Args:
        client (openzen.ZenClient): Client object from the OpenZen-library.
        sensors ([openzen.ZenSensorDesc]): List of available sensor objects.
        chosen_sensors ([int]): List of chosen sensor indices.

    Returns:
        [openzen.ZenSensor]: List of connected sensors.
        [openzen.ZenSensorComponent]: List of imus of connected sensors.
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


def set_sampling_rate(IMU: openzen.ZenSensorComponent, sampling_rate: int):
    """Sets the sampling rate of given imu.

    Args:
        IMU (openzen.ZenSensorComponent): Object representing the inertial measurement unit on connected sensor.
        sampling_rate (int): New sampling rate.

    Returns:
        int: Sampling rate of imu.
    """
    assert sampling_rate in SUPPORTED_SAMPLING_RATES, f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
    IMU.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]


def get_sampling_rate(IMU: openzen.ZenSensorComponent):
    """Get sampling rate from imu.

    Args:
        IMU (openzen.ZenSensorComponent): Object representing the inertial measurement unit on connected sensor.

    Returns:
        int: Sampling rate of imu.
    """
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]


def sync_sensors(imus: list):
    """Synchronize sensors.

    Args:
        imus ([openzen.ZenSensorComponent]): List of imus of connected sensors.

    Returns:
        [openzen.ZenSensorComponent]: List of synchronized imus.
    """
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


def _remove_unsync_data(client: openzen.ZenClient):
    """Removes data events from before sensor synchronization.

    Args:
        client (openzen.ZenClient): Client object from the OpenZen-library.
    """
    zenEvent = client.poll_next_event()
    while(zenEvent != None):
        zenEvent = client.poll_next_event()


def _make_row(handle: int, imu_data: openzen.ZenImuData):
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


def collect_data(client: openzen.ZenClient, data_queue: Data_Queue):
    """Collect data from connected sensors.

    Args:
        client (openzen.ZenClient): Client object from the OpenZen-library.
        data_queue (Data_Queue): Data queue with data collected from sensor(s).
    """
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


def _write_to_csv(writer: csv.writer, classification: int):
    """Write classification to csv.

    Args:
        writer (_csv.writer): Csv writer object.
        classification (int): Classification from 0-8 based on trained model.
    """
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    writer.writerow([current_time, classification])


def classify(model: keras.engine.sequential.Sequential, data_queue: Data_Queue, type="ann"):
    """Classify in realtime based on trained model and data in data queue.

    Args:
        model (tensorflow.python.keras.engine.sequential.Sequential): ANN model trained for n_sensors connected.
        data_queue (Data_Queue): Data queue with data collected from sensor(s).
        type (str): Type of model
    """
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
            print(classify)
            classification = None

            if type != "rfc":
                argmax = [classification.argmax() for classification in classify]
                print(argmax)
                end_time_classify = time.perf_counter() - start_time_classify
                classification = Counter(argmax).most_common(1)[0][0]
            else:
                end_time_classify = time.perf_counter() - start_time_classify
                classification = Counter(classify).most_common(1)[0][0]

            print(f"Classified as {classification} in {round(end_time_classify,2)}s!")
            with open('../classifications/classifications.csv', 'a+', newline='') as file:
                _write_to_csv(csv.writer(file), classification)
                values = []


if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)

    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    # Scan, connect and syncronize sensors
    sensors_found = scan_for_sensors(client)
    user_input = [0, 1, 2]
    # user_input = [int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]
    data_queue = Data_Queue(len(user_input))
    NUM_SENSORS = len(user_input)
    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    _remove_unsync_data(client)
    sync_sensors(imus)

    # Classify
    model_ann = keras.models.load_model(f'model/models/ANN_model_{NUM_SENSORS}.h5')
    model_cnn = keras.models.load_model(f'model/models/CNN_model_{NUM_SENSORS}.h5')
    model_rfc = load(f'../model/models/RFC_model_{NUM_SENSORS}.joblib')

    classify_thread = threading.Thread(target=classify, args=[model_rfc, data_queue, "rfc"], daemon=True)
    classify_thread.start()

    collect_data(client, data_queue)
