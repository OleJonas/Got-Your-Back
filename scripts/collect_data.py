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
import os
from dataclasses import dataclass

# Fix the filenames and folderstructure based on our naming convention
test_person = input("Name: ").capitalize()
test_form = None
while test_form not in {"train", "test"}:
    test_form = input(
        "Purpose of data? [train/test]: ").strip().lower()
number = len([name for name in os.listdir(os.path.join(
    os.getcwd(), f"data/live/{test_form}_data/")) if name.startswith(test_person)])+1
WRITE_PATH = f"data/live/{test_form}_data/{test_person}_{test_form}_{number}.csv"


@dataclass
class SensorInstance:
    name: str
    client: openzen.ZenClient
    sensor: openzen.ZenSensor
    imu: openzen.ZenSensorComponent


sensorInstances = []
HERTZ = 50


def _create_openzen_instance():
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializinng OpenZen library")
        sys.exit(1)
    error = client.list_sensors_async()
    return client


def connect_to_sensor(client):
    print("---------------")
    connected = False
    while not connected:
        try:
            error = client.list_sensors_async()
            # check for events and find clients
            sensor_desc_connect = None

            print("Trying to establish connection...")
            while True:
                zenEvent = client.wait_for_next_event()
                if zenEvent.event_type == openzen.ZenEventType.SensorFound:
                    sensor = zenEvent.data.sensor_found

                    if sensor_desc_connect is None:
                        if sensor.name not in [x.name for x in sensorInstances]:
                            sensor_desc_connect = zenEvent.data.sensor_found
                if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
                    lst_data = zenEvent.data.sensor_listing_progress
                    # print("Sensor listing progress: {} %".format(lst_data.progress * 100))
                    if lst_data.complete > 0:
                        break

            if sensor_desc_connect is None:
                print("No sensors found")
                # sys.exit(1)
                continue

            # connect to the first sensor found
            error, sensor = client.obtain_sensor(sensor_desc_connect)

            # Connect to sensor
            # error, sensor = client.obtain_sensor_by_name(
            #     "Bluetooth", SENSORS[sensor_no].bluetooth_address)

            if not error == openzen.ZenSensorInitError.NoError:
                print("Error connecting to sensor")
                # sys.exit(1)
                continue
            print(f"Connected to sensor {sensor_desc_connect.name}!")

            # Get instance/connection to imu in sensor
            imu = sensor.get_any_component_of_type(openzen.component_type_imu)
            if imu is None:
                print("No IMU found")
                # sys.exit(1)
                continue
            connected = True
            print("---------------")

        except ValueError:
            pass
    return SensorInstance(sensor_desc_connect.name, client, sensor, imu)


def collect_data(sensorInstances: list):
    for element in sensorInstances:
        assert isinstance(
            element, SensorInstance), "You can only collect data from sensorInstances!"

    print("\nReady to start collecting data")
    while True:
        try:
            seconds = int(
                input("For how many seconds do you want to collect? "))
            break
        except ValueError:
            pass
    input("Press enter to start collection...")

    rows = seconds*HERTZ

    # start streaming data
    time1 = time.perf_counter()
    with open(WRITE_PATH, "w", newline="") as f:
        writer = csv.writer(f, delimiter=",")
        writer.writerow(['Timestamp', 'a_x', 'a_y', 'a_z', 'g_x', 'g_y', 'g_z',
                         'w_x', 'w_y', 'w_z', 'r_x', 'r_y', 'r_z', 'q_w', 'q_x', 'q_y', 'q_z'])

        for _ in tqdm(range(rows)):
            for instance in sensorInstances:
                zenEvent = instance.client.wait_for_next_event()

                # check if its an IMU sample event and if it
                # comes from our IMU and sensor component
                if zenEvent.event_type == openzen.ZenEventType.ImuData and \
                        zenEvent.sensor == instance.imu.sensor and \
                        zenEvent.component.handle == instance.imu.component.handle:

                    imu_data = zenEvent.data.imu_data
                    # print ("A: {} m/s^2".format(imu_data.a))
                    # print ("G: {} degree/s".format(imu_data.g))

                    data = []
                    data.append(imu_data.timestamp)
                    for adata in imu_data.a:
                        data.append(adata)
                    for gdata in imu_data.g:
                        data.append(gdata)
                    for wdata in imu_data.w:
                        data.append(wdata)
                    for rdata in imu_data.r:
                        data.append(rdata)
                    for qdata in imu_data.q:
                        data.append(qdata)

                    writer.writerow(data)
        # print(time.perf_counter())
        # print(time.perf_counter() - time1)
        # print(runSome)

    print("Streaming of sensor data complete")
    for instance in sensorInstances:
        instance.sensor.release()
        instance.client.close()
    # print("OpenZen library was closed")
    pass


if __name__ == '__main__':
    amount_of_sensors = int(
        input(f"How many sensors [1-3] do you want to use? "))
    client = _create_openzen_instance()
    for _ in range(amount_of_sensors):
        sensorInstances.append(connect_to_sensor(client=client))
    collect_data(sensorInstances)
