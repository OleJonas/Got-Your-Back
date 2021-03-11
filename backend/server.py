import os
import sys
import csv
import datetime
import openzen
import keras
import threading
import time
from flask import Flask, request, jsonify
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
classify = False
t_pool = []

app.config['CORS_ALLOW_HEADERS'] = ["*"]

cors = CORS(app)


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


@app.route("/")
def hello_world():
    return 'Hello, World!'


@app.route("/all_predictions")
def get_all_csv_data():
    res = dict()
    with open('predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            res[row[0]] = row[1]
    return res


@app.route("/prediction")
def get_csv_data():
    rows = []
    with open('predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append([row[0], row[1]])
    return {rows[-1][0]: rows[-1][1]}


@app.route("/setup/scan")
def scan():
    global found_sensors
    found_sensors = rt.scan_for_sensors(client)
    res = dict()
    for i, sensor in enumerate(found_sensors):
        res[str(i)] = sensor.name
    return res


@app.route('/setup/connect')
def connect():
    global sensor_bank
    content = request.json
    s_name, sensor, imu = rt.connect_to_sensor(client, found_sensors[content["user_input"]])
    sensor_bank.add_sensor(s_name, sensor, imu)
    s_id = sensor_bank.handle_to_id[sensor_bank.sensor_arr[-1].handle]

    return f"id: {s_id}\nname: {sensor_bank.sensor_arr[-1].name}\nbattery percent: {sensor_bank.sensor_arr[-1].get_battery_percentage()}"



@app.route("/setup/sync")
def sync_sensors():
    rt.sync_sensors(client, sensor_bank)
    return("All sensors are synced!")


@app.route("/classify/start")
def classification_pipe():
    global t_pool
    global sensor_bank
    sensor_bank.run = True
    rt.sync_sensors(client, sensor_bank)
    model = keras.models.load_model(f'model/models/ANN_model_{len(sensor_bank.sensor_arr)}.h5')

    classify_thread = threading.Thread(target=rt.classify, args=[client, model, sensor_bank], daemon=True)
    collect_thread = threading.Thread(target=rt.collect_data, args=[client, sensor_bank], daemon=True)
    t_pool.append(classify_thread)
    t_pool.append(collect_thread)
    collect_thread.start()
    classify_thread.start()

    print("classification started")

    return "started classification..."


def check_classify():
    return classify


@app.route("/classify/stop")
def stop_classify():
    global sensor_bank
    global t_pool
    sensor_bank.run = False
    print("Stopping classification...")
    for t in t_pool:
        t.join()
    return str(sensor_bank.run)


@app.route("/setup/connect_all")
def connect_all():
    global sensor_bank
    for sensor in found_sensors:
        s_name, sensor, imu = rt.connect_to_sensor(client, sensor)
        sensor_bank.add_sensor(s_name, sensor, imu)
    return "All connected"



@app.route('/connected_sensors')
def get_dummy_connected_sensors():
    return {"sensors": [
        {"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"},
        {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
        {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}
    ]}


@app.route('/found_sensors')
def get_dummy_found_sensors():
    return {"sensors": ["LPMSB2 - 3036EB", "LPMSB2 - 4B3326", "LPMSB2 - 4B31EE"]}


