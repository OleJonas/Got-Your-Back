###########################################################################
#
# OpenZen Python example
#
# Make sure the openzen.pyd (for Windows) or openzen.so (Linux/Mac)
# are in the same folder as this file.
# # If you want to connect to USB sensors on Windows, the file SiUSBXp.dll
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
from datetime import datetime

# Fix the filenames and folderstructure based on our naming convention
test_person = input("Name: ").lower()
n_sensors = 3

#number = len([name for name in os.listdir(os.path.join(os.getcwd(), f"data/live/")) if name.startswith(test_person)])+1
now = datetime.now()
date_time = now.strftime("%d%m%y_%H%M")
WRITE_PATH = f"data/live/{test_person}_{n_sensors}_{date_time}.csv"


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


def scan_for_sensors(client):
    sensors_found = []

    listingComplete = False
    while not listingComplete:
        event = client.wait_for_next_event()
        e_type = event.event_type
        if not event:
            break

        if not event.component.handle:
            # switch event.eventType:

            if e_type.SensorFound:
                print("Found sensor ", event.data.SensorFound.name)
                sensors_found.append(event.data.sensorFound)
                break

            elif event.eventType.ZenEventType_SensorListingProgress:
                print("Sensor listing progress ",
                      event.data.sensorListingProgress.progress, " %")
                if event.data.sensorListingProgress.complete:
                    listingComplete = True
                break
    return sensors_found


def connect_to_sensor_test(client, sensor):
    sensor_pair = client.obtainSensor(sensor.sensorDesc)
    obtain_error = sensor_pair.first
    sensor = sensor_pair.second
    if obtain_error:
        # Error while obtaining the sensor
        return obtain_error
    return sensor


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

    rows = seconds * HERTZ

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
    # amount_of_sensors = int(
    #   input(f"How many sensors [1-3] do you want to use? "))
    client = _create_openzen_instance()
    # for _ in range(amount_of_sensors):
    #    sensorInstances.append(connect_to_sensor(client=client))
    # collect_data(sensorInstances)

    print("Scanning for sensors...")
    sensors_found = scan_for_sensors(client)

    if len(sensors_found) == 0:
        print("No available sensors found")
    else:
        print("Available sensors found:")
        for i in range(len(sensors_found)):
            print("    ", (i + 1), ": ", sensors_found[i].name)

        chosen_sensors = [int(i) for i in input(
            "What sensors do you want to connect to?\nWrite answer like: 1 2 3\nSeparated by spaces")]

        sensor_arr = []
        for sensor in chosen_sensors:
            sensor_pair = connect_to_sensor_test(client, sensor)
            if sensor_pair.first:
                print("Error connecting to sensor")
                break
            else:
                s = sensor_pair.second
                print("Connected to sensor: ", s.name)
                sensor_arr.append(s)

        for sensor in sensor_arr:
            print(sensor.name)

        print("Closing program...")
