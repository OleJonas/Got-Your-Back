import os
import sys
import csv
import datetime
import openzen
import keras
import threading
import scripts.realtime_test as rt
from multiprocessing import Process,Queue,Pipe
from scripts.sensor_bank import Sensor, Sensor_Bank 
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)

client = None
found_sensors = None
sensor_bank = None
data_queue = None

app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_ALLOW_HEADERS'] = "Content-Type"

cors = CORS(app, resources={r"/predictions": {"origins": "*"},
                            r"/all_predictions": {"origins": "*"}})

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
    arr = []
    with open('../predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            arr.append(jsonify({'x': row[0], 'y': int(row[1])}))
    return arr


@app.route("/predictions")
def get_csv_data():
    arr = []
    with open('../predictions.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            arr.append(jsonify({'x': row[0], 'y': int(row[1])}))
    return arr[-1]
    
    #return "predictions"

@app.route("/setup/scan")
def scan():
    global found_sensors
    found_sensors = rt.scan_for_sensors(client)
    res = dict()
    for i, sensor in enumerate(found_sensors): res[str(i)] = sensor.name
    return res

@app.route('/setup/connect')
def connect():
    global sensor_bank
    content = request.json
    s_name, sensor, imu = rt.connect_to_sensor(client, found_sensors[content["user_input"]])
    sensor_bank.add_sensor(s_name, sensor, imu)
    s_id = sensor_bank.handle_to_id[sensor_bank.sensor_arr[-1].handle]

    return f"id: {s_id}\nname: {sensor_bank.sensor_arr[-1].name}\nbattery percent: {sensor_bank.sensor_arr[-1].get_battery_percentage()}"


"""@app.route("/predictions")
def get_csv_data():
    with open('../predictions.csv', 'r') as file:
        rows = []
        reader = csv.reader(file, delimiter =  '\n')
        for row in reader:
            rows.append(rows)
    return rows
"""

@app.route("/setup/sync")
def sync_sensors():
    rt.sync_sensors(client, sensor_bank)
    return("All sensors are synced!")

@app.route("/classify")
def classification_pipe():
    rt.sync_sensors(client, sensor_bank)
    model = keras.models.load_model(f'model/models/ANN_model_{len(sensor_bank.sensor_arr)}.h5')

    parent_conn,child_conn = Pipe()
    classify_thread = Process(target=rt.classify, args=[child_conn, model])
    collect_thread = threading.Thread(target=rt.collect_data, args=[client, sensor_bank])
    collect_thread.start()
    classify_thread.start()


    #classify_thread = threading.Thread(target=rt.classify, args=[model], daemon=True)
    #classify_thread.start()

    thread.sleep(10)
    count = 0
    while count < 10:
        print(parent_conn.recv())
        count += 1
    return "caca"


@app.route("/setup/connect_all")
def connect_all():
    global sensor_bank
    for sensor in found_sensors:
        s_name, sensor, imu = rt.connect_to_sensor(client, sensor)
        sensor_bank.add_sensor(s_name, sensor, imu)
        s_id = sensor_bank.handle_to_id[sensor_bank.sensor_arr[-1].handle]

    return "All connected"

#print('', flush=True)

@app.route('/sensors')
def get_sensors():
    return {"list": [
                {"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"}, 
                {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
                {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}
            ]}
