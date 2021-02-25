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

SAMPLING_RATE = 10
SUPPORTED_SAMPLING_RATES = [5, 10, 25, 50, 100, 200, 400]
global data
data = []
NUM_SENSORS = 3
SLEEPTIME = 0.5
global done_collecting
done_collecting = False

class Queue:
    def __init__(self, n_sensors):
        self.queue = [[] for i in range(n_sensors)]
        self.n_sensors = n_sensors
        self.entries = [0, 0, 0]

    def shift(self):
        out = [[] for i in range(self.n_sensors)]
        for i in range(self.n_sensors):
            if len(self.queue[i]) > 0:
                if self.queue[i][0] == None: # Return None if the queue didn't have data for all sensors requested
                    return None
                out[i].append(self.queue[i][0])

        for i in range(self.n_sensors):
            self.queue[i] = self.queue[i][1:]
            self.entries[i] -= 1
        
        return out
    
    def push(self, sensor_id, data):
        self.queue[sensor_id-1].append(data)
        self.entries[sensor_id-1] += 1


    def sync_queue(self):
        sync = False
        tries = 20
        indexes = [100,0,0]
        
        while not sync:
            found = 1
            timestamp = self.queue[0][indexes[0]][1]
            i = 0
            while i < tries and found < 3:
                for j in range(1,self.n_sensors):
                    if self.queue[j][i][1] == timestamp: 
                        indexes[j] = indexes[0] + i
                        found += 1
                        
            if found == 3: sync = True
            else: indexes = [indexes[0]+1, 0, 0]

        for i in range(self.n_sensors):
            self.queue[i] = self.queue[i][indexes[i]:]

queue = Queue(3)

def get_model():
    return keras.model.load_model('../model/saved_model.pb')

def all_found(arr):
    for i in range(len(arr)):
        if(arr[i] == False):
            return False
    return True

def get_values(dest_arr, src_arr):
    for i in range(len(src_arr)):
        dest_arr.append(src_arr[i])

"""
def concat_data_thread_deprecated():
    NUM_SENSORS = 3
    SLEEPTIME = 0.1
    finds = [False] * (NUM_SENSORS-1)
    data = []
    while(not done_collecting):
        for i in range(len(finds)):
            finds[i] = False
        temp_buff = []
        if(min(queue.entries) == 0):
            print("No work for thread... sleeping for {SLEEPTIME} second(s)")
            time.sleep(SLEEPTIME)
        else:
            first_timestamp = queue.queue[0][0][1]
            while(not all_found(finds)):
                for i in range(1,NUM_SENSORS):
                    if(queue.queue[i][0][1] == first_timestamp):
                        get_values(temp_buff, queue.queue[i][0])
                        finds[i-1] = True
            data.append(temp_buff)
            print("data: ", data)
            queue.shift()
    print(np.shape(data))
    print("Thread done...")
"""

def concat_data_thread():
    SLEEPTIME = 0.5
    all_data = []
    for i in range(100):
        if(min(queue.entries) == 0):
            print("No work for thread... sleeping for {SLEEPTIME} second(s)")
            time.sleep(SLEEPTIME)
        else:
            top_row = queue.shift()
            data = top_row[0][0][1:]
            for i in range(1,queue.n_sensors):
                data += top_row[i][0][2:]
            all_data.append(data)
            #df = pd.DataFrame(data)
            #print(df)
    print("All data:\n", np.shape(all_data))


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
            print("Found sensor {} on IoType {}".format(zenEvent.data.sensor_found.name,
                                                        zenEvent.data.sensor_found.io_type))

            # Check if found device is a bluetooth device
            if zenEvent.data.sensor_found.io_type == "Bluetooth":
                sensors.append(zenEvent.data.sensor_found)
            # if sensor_desc_connect is None:
                # sensor_desc_connect = zenEvent.data.#sensor_found

        if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
            lst_data = zenEvent.data.sensor_listing_progress
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

        # Obtain IMU from sensor and prevents it from streaming data yet
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


def collect_data(client, imus):
    """
    Method for collecting data from the connected IMUs in given client

    Input:\n
    client - clientobject from the OpenZen-library\n
    imus - list of Inertial Measurement Units in sensors given in client\n

    Output:\n
    data - list of data from all IMUs\n
    """
    
    runSome = 0
    # Helper array to check if the sensors are streaming approx same amount of data
    occurences = [0, 0, 0]
    #columns = ['SensorId', ' TimeStamp (s)', ' FrameNumber', ' AccX (g)', ' AccY (g)', ' AccZ (g)', ' GyroX (deg/s)', ' GyroY (deg/s)', ' GyroZ (deg/s)',
               #' MagX (uT)', ' MagY (uT)', ' MagZ (uT)', ' EulerX (deg)', ' EulerY (deg)', ' EulerZ #(deg)', ' QuatW', ' QuatX', 'QuatY', 'QuatZ']
    #data.append(columns)

    #MAKE THREAD WORK HERE?
    concat_thread.start()

    while True:
        dataRow = []
        zenEvent = client.wait_for_next_event()
        # Check if it's an IMU sample event and if it comes from our IMU and sensor component
        if zenEvent.event_type == openzen.ZenEventType.ImuData:
            occurences[int(zenEvent.sensor.handle) - 1] += 1

            imu_data = zenEvent.data.imu_data
            
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
        queue.push(zenEvent.sensor.handle, dataRow)
        #SLIPPE MUTEX HER 
        runSome += 1
        if runSome > 200:
            break
    
    print(occurences)
    print("Streaming of sensor data complete")
    done_collecting = True
    #return data


if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)

    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    sensors_found = scan_for_sensors(client)

    user_input = [0, 1, 2]
    #user_input = [int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]

    connected_sensors, imus = connect_and_get_imus(client, sensors_found, user_input)
    remove_trash_data(client)

    concat_thread = threading.Thread(target=concat_data_thread, args=[] daemon=True)
    
    collect_data(client, sync_sensors(client, imus))
    print(np.shape(queue.queue))
    print("FERDI DA!!!")
    #with open('realtimetest.csv', 'w+', newline='') as file:
    #    writer = csv.writer(file)
    #    writer.writerows(data_arr)
