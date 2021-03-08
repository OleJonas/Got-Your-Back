from flask import Flask
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
app = Flask(__name__)
import csv
#from scripts.sensor_bank import Sensor_Bank
#import scripts.realtime_test as realtime_test
import openzen
import sys
from datetime import datetime
import time
import datetime

app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_ALLOW_HEADERS'] = "Content-Type"

cors = CORS(app, resources={r"/predictions": {"origins": "*"},
                            r"/all_predictions": {"origins": "*"}})

client = None
found_sensors = None
sensor_bank = None
"""
@app.before_first_request
def init():
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)

    sensor_bank = Sensor_Bank()
"""
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

"""
@app.route("/scan")
def scan_for_sensors():
    found = realtime_test.scan_for_sensors(client)
    return found

@app.route('/sensors')
def get_sensors():
    return [{"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"}, 
            {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
            {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}]"""