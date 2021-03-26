import os
import sys
import csv
import datetime
import openzen
import keras
import threading
import numpy as np
import atexit
import json
from flask import Flask, request, Response
from flask_cors import CORS
sys.path.append("scripts/")
from sensor_bank import Sensor_Bank
import server_classify as sc

app = Flask(__name__)
client = None
found_sensors = None
sensor_bank = None
data_queue = None
t_pool = []

app.config['CORS_ALLOW_HEADERS'] = ["*"]
CORS(app, support_credentials=True)


@app.before_first_request
def init():
    global client
    global sensor_bank
    global found_sensors
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)
    sensor_bank = Sensor_Bank()
    found_sensors = dict()


# Dårlig practice?
@app.before_request
def before_request():
    if request.method == "OPTIONS":
        res = Response("ye")
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        res.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
        return res
    else:
        return


@app.route("/")
def confirm_access():
    return "The API is up and running!"


# Debug endpoints

@app.route("/debug/get_sensors")
def get_sensors():
    return str(sensor_bank.sensor_dict)


@app.route('/dummy/connected_sensors')
def get_dummy_connected_sensors():
    return {"sensors": [
        {"name": "LPMSB2 - 3036EB", "id": 1, "battery": 85.2},
        {"name": "LPMSB2 - 4B3326", "id": 2, "battery": 76.6},
        {"name": "LPMSB2 - 4B31EE", "id": 3, "battery": 54.26},
    ]}


@app.route('/dummy/found_sensors')
def get_dummy_found_sensors():
    return {"sensors": ["LPMSB2 - 3036EB", "LPMSB2 - 4B3326", "LPMSB2 - 4B31EE"]}


# Setup endpoints

@app.route("/setup/scan")
def scan():
    global found_sensors
    global sensor_bank
    helper = sc.scan_for_sensors(client)
    out = {"sensors": []}

    for sensor in helper:
        found_sensors[sensor.name] = sensor
        out["sensors"].append({"name": sensor.name, "id": sensor_bank.sensor_id_dict[sensor.name]})
    return out


@app.route("/setup/connect", methods=["OPTIONS", "POST"])
def connect():
    global sensor_bank
    sensor_name = request.json["name"]
    s_name, sensor, imu = sc.connect_to_sensor(client, found_sensors[sensor_name])
    sensor_bank.add_sensor(s_name, sensor, imu)
    s_id = sensor_bank.sensor_id_dict[s_name]
    res = {
        "name": s_name,
        "id": s_id,
        "battery": sensor_bank.sensor_dict[sensor_name].get_battery_percentage().split("%")[0]
    }
    return res


@app.route("/setup/connect_all")
def connect_all():
    global sensor_bank
    for key in found_sensors:
        s_name, _, imu = sc.connect_to_sensor(client, found_sensors[key])
        sensor_bank.add_sensor(s_name, found_sensors[key], imu)
    return "All connected"


@app.route("/setup/sync")
def sync_sensors():
    sc.sync_sensors(client, sensor_bank)
    return "All sensors are synced!"


@app.route("/setup/disconnect", methods=["OPTIONS", "POST"])
def disconnect():
    global sensor_bank
    sensor_names = request.json["names"]
    print(sensor_names)
    for name in sensor_names:
        sensor_bank.disconnect_sensor(name)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route("/setup/set_id", methods=["POST"])
def set_id():
    name = request.json["name"]
    s_id = request.json["id"]
    sensor_bank.set_id(name, s_id)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


# Classification endpoints

@app.route("/classifications")
def get_all_classifications():
    res = dict()
    with open('./classifications/classifications.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            res[row[0]] = row[1]
    return res


@app.route("/classifications/latest")
def get_classification():
    rows = []
    with open('./classifications/classifications.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append([row[0], row[1]])
    return {rows[-1][0]: rows[-1][1]}


@app.route("/classifications/history")
def get_days_predictions():
    days = int(request.args.get("duration"))
    res = dict()
    filearray = os.listdir("./classifications/dummydata")
    startDate = filearray[0].split(".")[0]
    today = datetime.datetime.strptime(startDate, '%Y-%m-%d')

    # Iterate through every day of the 'duration'-days long interval, and get the most frequently occurent prediction from each day
    for i in range(0, days):
        ith_Day = today + datetime.timedelta(days=i)
        ith_Day_str = ith_Day.strftime("%Y-%m-%d")
        classifications = np.zeros(9)

        # if there is a file for the i-th day in the interval, proceed, if not, skip
        if((ith_Day_str + ".csv") in filearray):
            with open("./classifications/dummydata/" + str(ith_Day_str + ".csv"), 'r') as file:
                reader = csv.reader(file)
                for row in reader:
                    classifications[int(row[1])] += 1
            res[ith_Day_str] = int(np.argmax(classifications))
    return res


@app.route("/classify/start")
def classification_pipe():
    global t_pool
    global sensor_bank
    sensor_bank.run = True
    sc.sync_sensors(client, sensor_bank)
    model = keras.models.load_model(f"model/models/ANN_model_{len(sensor_bank.sensor_dict)}.h5")

    classify_thread = threading.Thread(target=sc.classify, args=[client, model, sensor_bank], daemon=True)
    collect_thread = threading.Thread(target=sc.collect_data, args=[client, sensor_bank], daemon=True)
    t_pool.append(classify_thread)
    t_pool.append(collect_thread)
    collect_thread.start()
    classify_thread.start()

    print("classification started")
    return json.dumps(sensor_bank.run)


@app.route("/classify/status")
def check_classify():
    return json.dumps(sensor_bank.run)


@app.route("/classify/stop")
def stop_classify():
    global sensor_bank
    global t_pool
    sensor_bank.run = False
    print("Stopping classification...")
    for t in t_pool:
        t.join()
    return json.dumps(sensor_bank.run)


# Information endpoints

@app.route("/sensor/battery")
def get_battery():
    global sensor_bank
    name = str(request.args.get("name"))
    print(name)
    try:
        percent = sensor_bank.sensor_dict[name].get_battery_percentage()
    except:
        return "-1"
    return {"battery": str(percent).split("%")[0]}


@app.route("/status")
def get_status():
    global sensor_bank
    return {
        "isRecording": sensor_bank.run,
        "numberOfSensors": len(sensor_bank.sensor_dict)
    }


def shutdown():
    global client
    global sensor_bank
    for sensor in sensor_bank.sensor_dict.values():
        sensor_bank.disconnect_sensor(sensor.name)
    client.close()


atexit.register(shutdown)
