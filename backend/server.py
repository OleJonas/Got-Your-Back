from flask import Flask
app = Flask(__name__)
import csv
from scripts.sensor_bank import Sensor_Bank
import scripts.realtime_test as realtime_test
import openzen
import sys

client = None
found_sensors = None
sensor_bank = None

@app.before_first_request
def init():
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

@app.route("/predictions")
def get_csv_data():
    with open('../../../predictions.csv', 'r') as file:
        rows = []
        reader = csv.reader(file, delimiter = '\n')
        for row in reader:
            rows.append(rows)
    return rows
        

@app.route("/scan")
def scan_for_sensors():
    found = realtime_test.scan_for_sensors(client)
    return found


@app.route('/sensors')
def get_sensors():
    return [{"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"}, 
            {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
            {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}]