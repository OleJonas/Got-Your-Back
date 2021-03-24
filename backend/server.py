import os
import sys
import csv
import datetime
import openzen
import keras
import threading
import atexit
import json
from flask import Flask, request, jsonify, request_started, Response
from flask_cors import CORS
sys.path.append("scripts/")
from sensor_bank import Sensor, Sensor_Bank
import realtime_test as rt
from multiprocessing import Process

app = Flask(__name__)
client = None
found_sensors = None
sensor_bank = None
data_queue = None
t_pool = []

app.config['CORS_ALLOW_HEADERS'] = ["*"]
CORS(app, support_credentials=True)

"""
Både cors(app) og cors support credentials?
"""


@app.before_first_request
def init():
    global client
    global sensor_bank
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)
    sensor_bank = Sensor_Bank()


"""
Dårlig practice?
"""


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
    return str(sensor_bank.sensor_arr)


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


# Setup endopoints

@app.route("/setup/scan")
def scan():
    global found_sensors
    found_sensors = rt.scan_for_sensors(client)
    res = dict()
    res["sensors"] = [sensor.name for sensor in found_sensors]
    return res


@app.route("/setup/connect", methods=["OPTIONS", "POST"])
def connect():
    global sensor_bank
    content = request.json
    print(content)
    s_name, sensor, imu = rt.connect_to_sensor(client, found_sensors[content["handle"]])
    sensor_bank.add_sensor(s_name, sensor, imu)
    s_id = sensor_bank.handle_to_id[sensor_bank.sensor_arr[-1].handle]
    res = {
        "name": s_name,
        "id": s_id,
        "battery": sensor_bank.sensor_arr[-1].get_battery_percentage().split("%")[0]
    }
    return res


@app.route("/setup/connect_all")
def connect_all():
    global sensor_bank
    for sensor in found_sensors:
        s_name, sensor, imu = rt.connect_to_sensor(client, sensor)
        sensor_bank.add_sensor(s_name, sensor, imu)
    return "All connected"


@app.route("/setup/sync")
def sync_sensors():
    rt.sync_sensors(client, sensor_bank)
    return "All sensors are synced!"


@app.route("/setup/disconnect", methods=["OPTIONS", "POST"])
def disconnect():
    # Takes a JSON object as argument. Should be on the form:
    # {
    #   handles: [0,1,2,...]
    # }
    global sensor_bank
    sensor_handles = request.json["handles"]
    print(sensor_handles)
    for handle in sensor_handles:
        sensor_bank.disconnect_sensor(handle)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


# Classification endpoints

@app.route("/classifications")
def get_all_classifications():
    res = dict()
    with open('predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            res[row[0]] = row[1]
    return res


@app.route("/classifications/latest")
def get_classification():
    rows = []
    with open('predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append([row[0], row[1]])
    return {rows[-1][0]: rows[-1][1]}


@app.route("/classify/start")
def classification_pipe():
    global t_pool
    global sensor_bank
    sensor_bank.run = True
    rt.sync_sensors(client, sensor_bank)
    model = keras.models.load_model(f"model/models/ANN_model_{len(sensor_bank.sensor_arr)}.h5")

    classify_thread = threading.Thread(target=rt.classify, args=[client, model, sensor_bank], daemon=True)
    collect_thread = threading.Thread(target=rt.collect_data, args=[client, sensor_bank], daemon=True)
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
    handle = int(request.args.get("id"))
    print(handle)
    percent = sensor_bank.sensor_arr[handle].get_battery_percentage()
    return {"battery": str(percent).split("%")[0]}


def shutdown():
    global client
    global sensor_bank
    for sensor in sensor_bank.sensor_arr:
        sensor_bank.disconnect_sensor(sensor.handle)
    client.close()


atexit.register(shutdown)
