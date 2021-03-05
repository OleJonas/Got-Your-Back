import csv
import sys
import openzen
from scripts.realtime_test import *
from scripts.sensor_bank import Sensor, Sensor_Bank 
from flask import Flask, request, jsonify
app = Flask(__name__)


client = None
found_sensors = None
sensor_bank = None

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

@app.route("/scan")
def scan():
    global found_sensors
    found_sensors = scan_for_sensors(client)
    return "ya yeet"


@app.route('/connect')
def connect():
    global sensor_bank
    content = request.json
    s_name, sensor, imu = connect_to_sensor(client, found_sensors[content["user_input"]])
    sensor_bank.add_sensor(s_name, sensor, imu)
    id = sensor_bank.handle_to_id[sensor_bank.sensor_arr[0].handle]

    return f"id: {id}\nname: {sensor_bank.sensor_arr[0].name}\nbattery percent: {sensor_bank.sensor_arr[0].get_battery_percentage()}"

#{"user_input": 0}


@app.route("/predictions")
def get_csv_data():
    with open('../predictions.csv', 'r') as file:
        rows = []
        reader = csv.reader(file, delimiter = '\n')
        for row in reader:
            rows.append(rows)
    return rows
        
@app.route('/sensors')
def get_sensors():
    return {"list": [
                {"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"}, 
                {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
                {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}
            ]}