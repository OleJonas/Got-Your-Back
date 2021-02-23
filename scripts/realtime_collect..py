import csv
import time
import sys
import openzen

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
            print ("Found sensor {} on IoType {}".format( zenEvent.data.sensor_found.name,
                zenEvent.data.sensor_found.io_type))
            
            # Check if found device is a bluetooth device
            if zenEvent.data.sensor_found.io_type == "Bluetooth":
                sensors.append(zenEvent.data.sensor_found)
            #if sensor_desc_connect is None:
                #sensor_desc_connect = zenEvent.data.#sensor_found

        if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
            lst_data = zenEvent.data.sensor_listing_progress
            print ("Sensor listing progress: {} %".format(lst_data.progress * 100))
            if lst_data.complete > 0:
                break
    print ("Sensor Listing complete, found ", len(sensors))
    print("Listing found sensors in sensors array:\n", [sensor.name for sensor in sensors])
    return sensors

def connect_to_sensors(client, sensors, chosen_sensors):
    """
    Connects to all sensors using one client
    
    Input:\n
    client - clientobject from the OpenZen-library
    sensors - list of available sensors
    chosen_sensors - user input with chosen sensors

    Output:\n
    connected_sensors - list of connected sensors
    """
    if len(sensors) < 1:
        sys.exit("No sensors found!\nExiting...")

    connected_sensors = []

    for index in chosen_sensors:
        error, sensor = client.obtain_sensor(sensors[index])
        
        while not error == openzen.ZenSensorInitError.NoError:
            print ("Error connecting to sensor")
            
            # Trying again
            print("Trying again...")
            error, sensor = client.obtain_sensor(sensors[index])

        """if not error == openzen.ZenSensorInitError.NoError:
            print ("Error connecting to sensor")
            sys.exit(1)"""

        print ("Connected to sensor {}!".format(sensors[index].name))

        connected_sensors.append(sensor)
    #print("Connected to sensors:\n", [x.name for x in connected_sensors])
    return connected_sensors
    
def connect_to_sensor(client, s):
    error, sensor = client.obtain_sensor(s)
    
    while not error == openzen.ZenSensorInitError.NoError:
        print ("Error connecting to sensor")
        
        # Trying again
        print("Trying again...")
        error, sensor = client.obtain_sensor(s)

    """if not error == openzen.ZenSensorInitError.NoError:
        print ("Error connecting to sensor")
        sys.exit(1)"""

    print("Connected to sensor {}!".format(s.name))

    #print("Connected to sensors:\n", [x.name for x in connected_sensors])
    return sensor

def collect_data(client, sensors):
    imus = [sensor.get_any_component_of_type(openzen.component_type_imu) for sensor in sensors]

    #Synchronize
    for imu in imus: imu.execute_property(openzen.ZenImuProperty.StartSensorSync)
    time.sleep(5)
    #Back to normal mode
    for imu in imus: imu.execute_property(openzen.ZenImuProperty.StopSensorSync)
    
    for imu in imus: 
        error, is_streaming = imu.get_bool_property(openzen.ZenImuProperty.StreamData)
        if not error == openzen.ZenError.NoError:
            print ("Can't load streaming settings")
            sys.exit(1)

        if imu is None:
            print ("No IMU found")
            sys.exit(1)
        print(f"Sensor {imu.sensor.handle} is streaming data: {is_streaming}")

    runSome = 0
    occurences = [0,0,0]
    data = []
    columns = ['SensorId',' TimeStamp (s)',' FrameNumber',' AccX (g)',' AccY (g)',' AccZ (g)',' GyroX (deg/s)',' GyroY (deg/s)',' GyroZ (deg/s)',' MagX (uT)', ' MagY (uT)', ' MagZ (uT)', ' EulerX (deg)', ' EulerY (deg)', ' EulerZ (deg)',' QuatW',' QuatX', 'QuatY', 'QuatZ']
    data.append(columns)
    while True:
        dataRow = []
        zenEvent = client.wait_for_next_event()
        # Check if it's an IMU sample event and if it comes from our IMU and sensor component
        if zenEvent.event_type == openzen.ZenEventType.ImuData and \
            zenEvent.component.handle == imu.component.handle:
            occurences[int(zenEvent.sensor.handle)-1] += 1
            
            imu_data = zenEvent.data.imu_data
            #print(f"Timestamp: {imu_data.timestamp} s, \n")
            #print(f"A: {imu_data.a} m/s^2, \n")
            #print(f"G: {imu_data.g} degree/s, \n")
            print("imu sensor handle: ", imu.sensor.handle)
            print("zenEvent sensor handle: ", zenEvent.sensor.handle)
            dataRow.append(zenEvent.sensor.handle)
            dataRow.append(imu_data.timestamp)

            for i in range(3): 
                dataRow.append(imu_data.a[i])
                dataRow.append(imu_data.g[i])
                dataRow.append(imu_data.w[i])
                dataRow.append(imu_data.r[i])
            for j in range(4):
                dataRow.append(imu_data.q[i])
        data.append(dataRow)
        runSome += 1
        if runSome > 5000:
            break
        
    print(occurences)
    return data
    print ("Streaming of sensor data complete")

if __name__ == "__main__":
    openzen.set_log_level(openzen.ZenLogLevel.Warning)

    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print ("Error while initializinng OpenZen library")
        sys.exit(1)

    sensors_found = scan_for_sensors(client)
    
    user_input = [0,1]
    #user_input = [int(i) for i in (input("Which sensors do you want to connect to?\n[id] separated by spaces:\n").split(" "))]

    connected_sensors = connect_to_sensors(client, sensors_found, user_input)

    data_arr = collect_data(client, connected_sensors)
    with open('realtimetest.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data_arr)
