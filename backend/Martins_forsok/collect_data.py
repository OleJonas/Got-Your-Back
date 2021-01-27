###########################################################################
#
# OpenZen Python example
#
# Make sure the openzen.pyd (for Windows) or openzen.so (Linux/Mac)
# are in the same folder as this file.
# If you want to connect to USB sensors on Windows, the file SiUSBXp.dll
# should also be in the same folder.
#
###########################################################################


import csv
import time
import openzen
import sys
from tqdm import tqdm

WRITE_PATH = "backend/Martins_forsok/data.csv"
SENSOR_NAMES = {
    1: "LPMSB2-3036EB",
    2: "LPMSB2-4B3326",
    3: "LPMSB2-4B31EE",
}
HERTZ = 100


def connect_to_sensor(sensor_no=1):
    # Create instance
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializinng OpenZen library")
        sys.exit(1)
    error = client.list_sensors_async()

    # check for events and find clients
    sensor_desc_connect = None
    print("Starting up...")
    input(
        f'Connect to sensor "{SENSOR_NAMES[sensor_no]}" on your machine, and press enter')
    print("Trying to establish connection...")
    while True:
        zenEvent = client.wait_for_next_event()
        if zenEvent.event_type == openzen.ZenEventType.SensorFound:
            sensor = zenEvent.data.sensor_found

            if sensor_desc_connect is None:
                if sensor.name == SENSOR_NAMES[sensor_no]:
                    sensor_desc_connect = zenEvent.data.sensor_found
                # sensor_desc_connect = zenEvent.data.sensor_found
        if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
            lst_data = zenEvent.data.sensor_listing_progress
            # print("Sensor listing progress: {} %".format(lst_data.progress * 100))
            if lst_data.complete > 0:
                break
    if sensor_desc_connect is None:
        print("No sensors found")
        sys.exit(1)

    # connect to the first sensor found
    error, sensor = client.obtain_sensor(sensor_desc_connect)
    # or connect to a sensor by name (This method does not work!)
    # error, sensor = client.obtain_sensor_by_name(
    #     "Bluetooth", SENSOR_NAMES[sensor_no])

    if not error == openzen.ZenSensorInitError.NoError:
        print("Error connecting to sensor")
        sys.exit(1)
    print(f"Connected to sensor {sensor_desc_connect.name}!")

    # Get instance/connection to imu in sensor
    imu = sensor.get_any_component_of_type(openzen.component_type_imu)
    if imu is None:
        print("No IMU found")
        sys.exit(1)
    # read bool property
    error, is_streaming = imu.get_bool_property(
        openzen.ZenImuProperty.StreamData)
    if not error == openzen.ZenError.NoError:
        print("Can't load streaming settings")
        sys.exit(1)
    # print("Sensor is streaming data: {}".format(is_streaming))

    return client, sensor, imu


def collect_data(*args):
    zenClient = args[0]
    sensor = args[1]
    imu = args[2]

    print("\nReady to start collecting data")
    seconds = int(input("For how many seconds do you want to collect? "))
    input("Press enter to start collection...")

    rows = seconds*HERTZ

    # start streaming data
    time1 = time.perf_counter()
    with open(WRITE_PATH, "w", newline="") as f:
        writer = csv.writer(f, delimiter=",")

        for _ in tqdm(range(rows)):
            zenEvent = zenClient.wait_for_next_event()

            # check if its an IMU sample event and if it
            # comes from our IMU and sensor component
            if zenEvent.event_type == openzen.ZenEventType.ImuData and \
                    zenEvent.sensor == imu.sensor and \
                    zenEvent.component.handle == imu.component.handle:

                imu_data = zenEvent.data.imu_data
                #print ("A: {} m/s^2".format(imu_data.a))
                #print ("G: {} degree/s".format(imu_data.g))

                data = []
                data.append(imu_data.timestamp)
                for adata in imu_data.a:
                    data.append(adata)
                for gdata in imu_data.g:
                    data.append(gdata)

                writer.writerow(data)
    # print(time.perf_counter())
    # print(time.perf_counter() - time1)
    # print(runSome)

    print("Streaming of sensor data complete")
    sensor.release()
    zenClient.close()
    # print("OpenZen library was closed")
    pass


client, sensor, imu = connect_to_sensor(3)
collect_data(client, sensor, imu)
