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

import sys
import openzen
import csv
import time




"""
import cv2 
  
  
# define a video capture object 
vid = cv2.VideoCapture(0) 
  
while(True): 
      
    # Capture the video frame 
    # by frame 
    ret, frame = vid.read() 
  
    # Display the resulting frame 
    cv2.imshow('frame', frame) 
      
    # the 'q' button is set as the 
    # quitting button you may use any 
    # desired button of your choice 
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
  
# After the loop release the cap object 
vid.release() 
# Destroy all the windows 
cv2.destroyAllWindows() 
"""

print(time.perf_counter())
openzen.set_log_level(openzen.ZenLogLevel.Warning)

error, client = openzen.make_client()
if not error == openzen.ZenError.NoError:
    print("Error while initializing OpenZen library")
    sys.exit(1)

error = client.list_sensors_async()

# check for events
sensor_desc_connect = None
while True:
    zenEvent = client.wait_for_next_event()

    if zenEvent.event_type == openzen.ZenEventType.SensorFound:
        sensor = zenEvent.data.sensor_found

        if sensor_desc_connect is None:
            # Sensor with no label is LPMSB-4B3326
            if sensor.name == "LPMSB2-4B3326":
                print ("Found sensor {} on IoType {}".format( zenEvent.data.sensor_found.name,
                zenEvent.data.sensor_found.io_type))
                sensor_desc_connect = zenEvent.data.sensor_found

    if zenEvent.event_type == openzen.ZenEventType.SensorListingProgress:
        lst_data = zenEvent.data.sensor_listing_progress
        print("Sensor listing progress: {} %".format(lst_data.progress * 100))
        if lst_data.complete > 0:
            break
print("Sensor Listing complete")

if sensor_desc_connect is None:
    print("No sensors found")
    sys.exit(1)


# connect to the first sensor found
error, sensor = client.obtain_sensor(sensor_desc_connect)

# or connect to a sensor by name
#error, sensor = client.obtain_sensor_by_name("LinuxDevice", "LPMSCU2000003")

if not error == openzen.ZenSensorInitError.NoError:
    print("Error connecting to sensor")
    sys.exit(1)

print("Connected to sensor !")

imu = sensor.get_any_component_of_type(openzen.component_type_imu)
if imu is None:
    print("No IMU found")
    sys.exit(1)

# read bool property
error, is_streaming = imu.get_bool_property(openzen.ZenImuProperty.StreamData)
if not error == openzen.ZenError.NoError:
    print("Can't load streaming settings")
    sys.exit(1)

print("Sensor is streaming data: {}".format(is_streaming))

# load the alignment matrix from the sensor
# some sensors don't support this (for example IG1, BE1)
#error, accAlignment = imu.get_array_property_float(openzen.ZenImuProperty.AccAlignment)
# if not error == openzen.ZenError.NoError:
#    print ("Can't load alignment")
#    sys.exit(1)

# if not len(accAlignment) == 9:
#    print ("Loaded Alignment has incosistent size")
#    sys.exit(1)

#print ("Alignment loaded: {}".format(accAlignment))

# store float array
#error = imu.set_array_property_float(openzen.ZenImuProperty.AccAlignment, accAlignment)

# if not error == openzen.ZenError.NoError:
#    print ("Can't store alignment")
#    sys.exit(1)

#print("Stored alignment {} to sensor".format(accAlignment))

# start streaming data
time1 = time.perf_counter()
print(time1)
runSome = 0
with open("data2.csv", "w", newline="") as f:
    writer = csv.writer(f, delimiter=",",quoting=csv.QUOTE_NONE, escapechar="")

    writer.writerow(['Timestamp','a_x','a_y','a_z','g_x','g_y','g_z','w_x','w_y','w_z','r_x','r_y','r_z','q_w','q_x','q_y','q_z'])

    while True:
        zenEvent = client.wait_for_next_event()

        # check if its an IMU sample event and if it
        # comes from our IMU and sensor component
        if zenEvent.event_type == openzen.ZenEventType.ImuData and \
                zenEvent.sensor == imu.sensor and \
                zenEvent.component.handle == imu.component.handle:

            imu_data = zenEvent.data.imu_data
            print ("A: {} m/s^2".format(imu_data.a))
            print ("G: {} degree/s".format(imu_data.g))

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

        runSome = runSome + 1
        if runSome > 6000:
            break
print(time.perf_counter())
print(time.perf_counter() - time1)
print(runSome)

print("Streaming of sensor data complete")
sensor.release()
client.close()
print("OpenZen library was closed")
