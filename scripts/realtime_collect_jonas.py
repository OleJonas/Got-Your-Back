import csv
import time
import sys
import threading 
import keras
import time
import os
import openzen
import numpy as np
import threading
import pandas as pd
from Queue import Queue

SAMPLING_RATE = 10
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
NUM_SENSORS = 3
SLEEPTIME = 0.5
sensor_data = []
done_collecting = False
data_queue = Queue(3)

def get_model():
    return keras.models.load_model('../model/saved_model.pb')

def all_found(arr):
    for i in range(len(arr)):
        if(arr[i] == False):
            return False
    return True

def get_values(dest_arr, src_arr):
    for i in range(len(src_arr)):
        dest_arr.append(src_arr[i])

def concat_data_thread(pred_queue):
    SLEEPTIME = 0.5
    for i in range(100):
        if(min(data_queue.entries) == 0):
            print("No work for thread... sleeping for {SLEEPTIME} second(s)")
            time.sleep(SLEEPTIME)
        else:
            top_row = data_queue.shift()
            data = top_row[0][0][1:]
            for i in range(1,data_queue.n_columns):
                data += top_row[i][0][2:]
            pred_queue.append(pd.DataFrame(data))
            #df = pd.DataFrame(sensor_data)
            #print(df)

def set_sampling_rate(IMU, sampling_rate):
    assert sampling_rate in SUPPORTED_SAMPLING_RATES, f"Not supported sampling rate! Supported sampling rates: {SUPPORTED_SAMPLING_RATES}"
    IMU.set_int32_property(openzen.ZenImuProperty.SamplingRate, sampling_rate)
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]

def get_sampling_rate(IMU):
    return IMU.get_int32_property(openzen.ZenImuProperty.SamplingRate)[1]

def scan_for_sensors(client):
    """
    Scan for available sensors

    Input:\n
    client - clientobject from the OpenZen-library

    Output:\n
    sensors - list of available sensors
    """
    error = client.list_sensors_async()

    # check for events
    sensor_desc_connect = None
    sensors = []
    while True:
        zenEvent = client.wait_for_next_event()

        if zenEvent.event_type == openzen.ZenEventType.SensorFound:
            print("Found sensor {} on IoType {}".format(zenEvent.sensor_data.sensor_found.name,
                                                        zenEvent.sensor_data.sensor_found.io_type))

            # Check if found device is a bluetooth device
            if zenEvent.sensor_data.sensor_found.io_type == "Bluetooth":
                sensors.append(zenEvent.sensor_data.sensor_found)
            # if sensor_desc_connect is None:
                # sensor_desc_connect = zenEvent.sensor_data.#sensor_found

        if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
            lst_data = zenEvent.sensor_data.sensor_listing_progress
            print("Sensor listing progress: {} %".format(lst_data.progress * 100))
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

        print("Connected to sensor {}!".format(sensors[index].name))

        connected_sensors.append(sensor)
    #print("Connected to sensors:\n", [x.name for x in connected_sensors])
    return connected_sensors, imus

def remove_trash_data(client):
    zenEvent = client.poll_next_event()
    
    while(zenEvent != None):
        zenEvent = client.poll_next_event()

def sync_sensors(client, imus):
    # Synchronize
    for imu in imus:
        imu.execute_property(openzen.ZenImuProperty.StartSensorSync)
    time.sleep(5)
    # Back to normal mode
    for imu in imus:
        imu.execute_property(openzen.ZenImuProperty.StopSensorSync)
    # Start streaming sensor_data
    for imu in imus:
        imu.set_bool_property(openzen.ZenImuProperty.StreamData, True)

    # Check if sensors stream sensor_data and has an IMU
    for imu in imus:
        error, is_streaming = imu.get_bool_property(openzen.ZenImuProperty.StreamData)
        if not error == openzen.ZenError.NoError:
            print("Can't load streaming settings")
            sys.exit(1)

        if imu is None:
            print("No IMU found")
            sys.exit(1)
        print(f"Sensor {imu.sensor.handle} is streaming sensor_data: {is_streaming}")
    return imus


def collect_data(client, imus):
    """
    Method for collecting sensor_data from the connected IMUs in given client

    Input:\n
    client - clientobject from the OpenZen-library\n
    imus - list of Inertial Measurement Units in sensors given in client\n

    Output:\n
    sensor_data - list of sensor_data from all IMUs\n
    """
    
    runSome = 0
    occurences = [0, 0, 0]
    #columns = ['SensorId', ' TimeStamp (s)', ' FrameNumber', ' AccX (g)', ' AccY (g)', ' AccZ (g)', ' GyroX (deg/s)', ' GyroY (deg/s)', ' GyroZ (deg/s)',
               #' MagX (uT)', ' MagY (uT)', ' MagZ (uT)', ' EulerX (deg)', ' EulerY (deg)', ' EulerZ #(deg)', ' QuatW', ' QuatX', 'QuatY', 'QuatZ']
    #sensor_data.append(columns)

    concat_thread.start()

    while True:
        dataRow = []
        zenEvent = client.wait_for_next_event()
        # Check if it's an IMU sample event
        if zenEvent.event_type == openzen.ZenEventType.ImuData:
            occurences[int(zenEvent.sensor.handle) - 1] += 1

            imu_data = zenEvent.sensor_data.imu_data
            
            dataRow.append(zenEvent.sensor.handle)
            dataRow.append(imu_data.timestamp)
            
            # Write to csv file for each sensor
            for i in range(3):
                dataRow.append(imu_data.a[i])
                dataRow.append(imu_data.g[i])
                dataRow.append(imu_data.w[i])
                dataRow.append(imu_data.r[i])
            for j in range(4):
                dataRow.append(imu_data.q[i])
        #LÅS MUTEX
        data_queue.push(zenEvent.sensor.handle, dataRow)
        #SLIPPE MUTEX HER 
        runSome += 1
        if runSome > 200:
            break
    
    print(occurences)
    print("Streaming of sensor sensor_data complete")
    done_collecting = True
    #return sensor_data


if __name__ == "__main__":
    model = keras.models.load_model('.')
    pipe = make_pipeline(model)
    
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    pred_queue = Queue(1)

    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    sensors_found = scan_for_sensors(client)

    user_input = [0, 1, 2]  
    #user_input = [int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]

    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    remove_trash_data(client)

    concat_thread = threading.Thread(target=concat_data_thread, args=[pred_queue], daemon=True)
    
    collect_data(client, sync_sensors(client, imus))
    print(np.shape(data_queue.data_queue))
    pipe.predict(pred_queue.shift())
    
    print("FERDI DA!!!")
    #with open('realtimetest.csv', 'w+', newline='') as file:
    #    writer = csv.writer(file)
    #    writer.writerows(data_arr)
