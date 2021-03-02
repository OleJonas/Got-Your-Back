import time
import sys
import keras
import time
import openzen
import numpy as np
import threading
import multiprocessing
from Queue import Pred_Queue, Data_Queue
import csv

PREDICTION_INTERVAL = 1
SAMPLING_RATE = 100
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
SLEEPTIME = 0.1
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
    print("Listing found sensors in sensors array:\n",
          [sensor.name for sensor in sensors])
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
        is_streaming = imu.get_bool_property(openzen.ZenImuProperty.StreamData)

        # Set sampling rate
        set_sampling_rate(imu, SAMPLING_RATE)

        imus.append(imu)

        print(
            f"Connected to sensor {sensor.sensor.handle} - {sensors[index].name} ({round(sensor.get_float_property(openzen.ZenSensorProperty.BatteryLevel)[1], 1)}%)!")

        connected_sensors.append(sensor)
    #print("Connected to sensors:\n", [x.name for x in connected_sensors])
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
    """
    Method for collecting data from the connected IMUs in given client

    Input:\n
    client - clientobject from the OpenZen-library\n
    imus - list of Inertial Measurement Units in sensors given in client\n

    Output:\n
    data - list of data from all IMUs\n
    """

    occurences = [0, 0, 0]
    runSome = 0
    while runSome < 200:
        zenEvent = client.wait_for_next_event()
        dataRow = []

        # Check if it's an IMU sample event
        if zenEvent.event_type == openzen.ZenEventType.ImuData:
            occurences[int(zenEvent.sensor.handle) - 1] += 1

            imu_data = zenEvent.data.imu_data

            dataRow.append(zenEvent.sensor.handle)
            if imu_data.timestamp < 2:
                break
            dataRow.append(imu_data.timestamp)

            # Write to csv file for each sensor
            for i in range(3):
                dataRow.append(imu_data.a[i])
                dataRow.append(imu_data.g[i])
                dataRow.append(imu_data.w[i])
                dataRow.append(imu_data.r[i])
            for j in range(4):
                dataRow.append(imu_data.q[j])

        data_queue.push(zenEvent.sensor.handle, dataRow)
        runSome += 1


def concat_data(data_queue, pred_queue):
    while True:
        # If no work for worker thread, sleep
        if(min(data_queue.entries) == 0):
            time.sleep(SLEEPTIME)
        else:
            top_row = data_queue.shift()
            data = top_row[0][0][1:]
            for i in range(1, data_queue.n_columns):
                data += top_row[i][0][2:]
            pred_queue.push(data[1:])


def classification(model, pred_queue):
    while True:
        values = []
        rows = 0
        while rows < SAMPLING_RATE * PREDICTION_INTERVAL:
            val = pred_queue.shift()
            if val != None:
                values.append(val)
                rows += 1
        rows = 0

        if values != None:
            start_time = time.perf_counter()
            classification_res = np.argmax(model.predict(values, batch_size=SAMPLING_RATE * PREDICTION_INTERVAL)[0])
            elapsed_time = round(time.perf_counter() - start_time, 2)
            print(f"Predicted {classification_res} in {elapsed_time}s!")


if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    model = keras.models.load_model('ANN_model')
    pred_queue = Pred_Queue()

    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    # Scan, connect and syncronize sensors
    sensors_found = scan_for_sensors(client)
    # user_input = [0, 1, 2]
    user_input = [int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]

    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    remove_unsync_data(client)
    sync_sensors(imus)

    # Start collecting and concatting data
    data_queue = Data_Queue(len(user_input))
    #concat_thread = threading.Thread(target=concat_data, args=[data_queue, pred_queue], daemon=True)
    # concat_thread.start()
    collect_data(client, data_queue)
    
    with open('data_queue.csv', 'w', newline='') as csvfile:
        writer = csv.write(csvfile)
        writer.writerows(data_queue.queue)
