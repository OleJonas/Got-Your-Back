import os
import sys
import csv
from datetime import datetime, date, timedelta
# sys.path.append(os.path.abspath("./lib/openzen/build"))
import openzen
import threading
import atexit
import json
import numpy as np
from flask import Flask, request, Response
from flask_cors import CORS
from collections import deque
from pathlib import Path
sys.path.append("scripts/")
from sensor_bank import Sensor_Bank
from joblib import load
import server_classify as sc

app = Flask(__name__)
client = None
found_sensors = None
sensor_bank = None
data_queue = None
classify = False
t_pool = []
app.config['CORS_ALLOW_HEADERS'] = ["*"]
CORS(app, support_credentials=True)


@app.before_first_request
def init():
    """
    Global initialisation of variables used in the server.
    """
    global client
    global sensor_bank
    global found_sensors
    openzen.set_log_level(openzen.ZenLogLevel.Warning)
    # Make client
    error, client = openzen.make_client()
    if not error == openzen.ZenError.NoError:
        print("Error while initializing OpenZen library")
        sys.exit(1)
    found_sensors = {}
    sensor_bank = Sensor_Bank()


@app.before_request
def before_request():
    """Create response for OPTIONS-requests.

    Returns:
        flask.Response: Response with the right headers.
    """
    if request.method == "OPTIONS":
        res = Response("")
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        res.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
        return res
    else:
        global sensor_bank
        sensor_bank.verify_sensors_alive()
        return


@app.route("/")
def confirm_access():
    """Confirm connection to API.

    Returns:
        str: Message confirming connection.
    """
    return "The API is up and running!"


"""
DEBUG
"""


@app.route('/dummy/scan')
def get_dummy_scan():
    """Fetch dummydata mocking a list of found sensors.

    Returns:
        dict: Dictionary with list of found sensors.
                Format:

                {"sensors": [str]}
    """
    return {"sensors": ["LPMSB2 - 3036EB", "LPMSB2 - 4B3326", "LPMSB2 - 4B31EE"]}


@app.route('/dummy/connect')
def get_dummy_connect():
    """Fetch dummydata mocking a list of connected sensors.

    Returns:
        dict: Dictionary with list of connected sensors.
                Each sensor object is on the format:

                {
                    name: str,
                    id: int,
                    battery: int
                }
    """

    global sensor_bank

    res = {"sensors": [
        {"name": "LPMSB2 - 3036EB", "id": "1", "battery_percent": "85,3%"},
        {"name": "LPMSB2 - 4B3326", "id": "2", "battery_percent": "76,6%"},
        {"name": "LPMSB2 - 4B31EE", "id": "3", "battery_percent": "54,26%"}
    ]}

    sensors = res["sensors"]

    for sensor in sensors:
        sensor_bank.add_sensor(sensor["name"], None, None)

    return res


@app.route("/dummy/get_sensors")
def dummy_get_sensors():
    """Fetch a list of dummy sensors.

    Returns:
        dict: Dictionary with list of connected sensors.
                Each sensor object is on the format:

                {
                    name: str,
                    id: int,
                    battery: int
                }
    """
    out = {"sensors": []}
    for s in sensor_bank.sensor_dict.values():
        out["sensors"].append({
            "name": s.name,
            "id": s.id,
            "battery": "69.420"
        })
    return json.dumps(out)


@app.route("/dummy/test_dead")
def test_dead():
    print(sensor_bank.sensor_dict)
    ans = sensor_bank.test_dead()
    print(sensor_bank.sensor_dict)
    return ans


@app.route('/dummy/found_sensors')
def get_dummy_found_sensors():
    return {"sensors": ["LPMSB2 - 3036EB", "LPMSB2 - 4B3326", "LPMSB2 - 4B31EE"]}


"""""""""""""""""""""""
SENSORCONNECTION
"""""""""""""""""""""""


@app.route("/setup/scan")
def scan():
    """
    Scan for available sensors using the openZen library.

    Returns:
        dict: Dictionary with list of found sensors.
                Format:

                {"sensors": [str]}
    """
    global found_sensors
    global sensor_bank
    helper = sensor_bank.scan_for_sensors(client)
    out = {"sensors": []}

    for sensor in helper:
        found_sensors[sensor.name] = sensor
        out["sensors"].append({"name": sensor.name})
    return out


@app.route("/setup/connect", methods=["OPTIONS", "POST"])
def connect():
    """Connect to sensor based on sensorname.

    Returns:
        dict: Dictionary with information about connected sensor if connected. Error message if not.
                Each sensor object is on the format:

                {
                    name: str,
                    id: int,
                    battery: int
                }
    """
    global sensor_bank
    content = request.json
    res = None

    try:
        s_name, sensor, imu = sensor_bank.connect_to_sensor(client, found_sensors[content["name"]])
        sensor_bank.add_sensor(s_name, sensor, imu)
        s_id = sensor_bank.sensor_dict[s_name].id
        res = {
            "name": s_name,
            "id": s_id,
            "battery_percent": sensor_bank.sensor_dict[s_name].get_battery_percentage()
        }
    except:
        res = json.dumps({'success': False, 'error': "Could not connect to sensor, please try again..."}), 503, {'ContentType': 'application/json'}

    return res


@app.route("/setup/connect_all")
def connect_all():
    """Connect to all sensors.

    Returns:
        str: Message confirming that all sensors are connected.
    """
    global sensor_bank
    for sensor in found_sensors.values():
        s_name, sensor, imu = sensor_bank.connect_to_sensor(client, sensor)
        sensor_bank.add_sensor(s_name, sensor, imu)
    return "All connected"


@app.route("/setup/sync")
def sync_sensors():
    """Synchronize all sensors using the openZen library.

    Returns:
        str: Message confirming that all sensors are synced.
    """
    sensor_bank.sync_sensors(client, sensor_bank)
    return "All sensors are synced!"


@app.route("/setup/disconnect", methods=["OPTIONS", "POST"])
def disconnect():
    """Disconnect sensor(s) based on name(s) given in request body.

    Returns:
        str: Message confirming successful disconnect.
        http.HTTPStatus.OK: Response status code 200.
    """
    global sensor_bank
    names = request.json["names"]
    print(names)
    for name in names:
        sensor_bank.disconnect_sensor(name)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route("/setup/get_sensors")
def get_sensors():
    """Fetch a list of connected sensors.

    Returns:
        dict: Dictionary with list of connected sensors.
                Each sensor object is on the format:

                {
                    name: str,
                    id: int,
                    battery: int
                }
    """
    out = {"sensors": []}
    for s in sensor_bank.sensor_dict.values():
        out["sensors"].append({
            "name": s.name,
            "id": s.id,
            "battery": s.get_battery_percentage().split("%")[0]
        })
    return json.dumps(out)


"""""""""""""""""""""""
CLASSIFY
"""""""""""""""""""""""


@app.route("/classify/start")
def start_classify():
    """Start classifying.

    Returns:
        str: Message confirming that the server is classifying.
    """
    global t_pool
    global sensor_bank
    sensor_bank.run = True
    sensor_bank.sync_sensors(client)
    # keras model
    # model = keras.models.load_model(f"model/models/ANN_model_{len(sensor_bank.sensor_dict)}.h5")

    rfc_model = load(f"model/models/RFC_model_{len(sensor_bank.sensor_dict)}.joblib")
    classify_thread = threading.Thread(target=sc.classify, args=[rfc_model, sensor_bank], daemon=True)
    collect_thread = threading.Thread(target=sc.collect_data, args=[client, sensor_bank], daemon=True)
    t_pool.append(classify_thread)
    t_pool.append(collect_thread)
    collect_thread.start()
    classify_thread.start()

    print("Classification started")
    return json.dumps(sensor_bank.run)


@app.route("/classify/status")
def check_classify():
    """Check if classifying.

    Returns:
        bool: True if server is classifying. False if not.
    """
    return json.dumps(sensor_bank.run)


@app.route("/classify/stop")
def stop_classify():
    """Stop classifying.

    Returns:
        str: Message confirming that the server has stopped classifying.
    """
    global sensor_bank
    global t_pool
    sensor_bank.run = False
    print("Stopping classification...")
    for t in t_pool:
        t.join()
    return json.dumps(sensor_bank.run)


"""
FETCH CLASSIFICATIONS
"""


@app.route("/classifications")
def get_all_classifications():
    """Get all classifications for today.

    Returns:
        dict: Dictionary with classifications if file found and not empty. {Error: "FileEmpty" | "FileNotFound"} if not.
        http.HTTPStatus: Response status code 200 if file found and not empty, else 507.
    """
    INTERVAL = 10
    counter = 0
    classifications = np.zeros(9)
    res = dict()

    try:
        with open(sc._classification_fname(), 'r') as file:
            try:
                for row in csv.reader(file):
                    classifications[int(row[1])] += 1
                    counter += 1
                    if counter % INTERVAL == 0:
                        res[row[0]] = int(np.argmax(classifications))
                        classifications = np.zeros(9)
                return res
            except IndexError:  # empty file
                return json.dumps({'Error': "FileEmpty"}), 507, {'ContentType': 'application/json'}
    except FileNotFoundError:
        return json.dumps({'Error': "FileNotFound"}), 507, {'ContentType': 'application/json'}


@app.route("/classifications/latest")
def get_classification():
    """Get the latest classification for today.

    Returns:
        dict: Dictionary with latest classification if file found and not empty. {Error: "FileEmpty" | "FileNotFound"} if not.
        http.HTTPStatus: Response status code 200 if file found and not empty, else 507.
    """

    try:
        with open(sc._classification_fname(), 'r') as file:
            try:
                lastrow = deque(csv.reader(file), 1)[0]
            except IndexError:  # empty file
                return json.dumps({'FileEmpty': True}), 507, {'ContentType': 'application/json'}
            return {str(lastrow[0]): lastrow[1]}
    except FileNotFoundError:
        return json.dumps({'Error': "FileNotFound"}), 507, {'ContentType': 'application/json'}


@app.route("/classifications/history")
def get_classifications_history():
    """Get historical classifications based on duration given in request body.

    Returns:
        dict: Dictionary with classifications if file not empty. {Error: "FileEmpty"} if not.
        http.HTTPStatus: Response status code 200 if file not empty, else 507.
    """
    days = int(request.args.get("duration"))
    res = dict()
    filearray = os.listdir("./classifications/")
    startDate = (date.today() - timedelta(days=days))

    # Iterate through every day of the 'duration'-days long interval, and get the most frequently occurent prediction from each day
    for i in range(0, days):
        ith_Day = startDate + timedelta(days=i)
        ith_Day_str = ith_Day.strftime("%Y-%m-%d")
        classifications = np.zeros(9)

        # if there is a file for the i-th day in the interval, proceed, if not, skip
        if((ith_Day_str + ".csv") in filearray):
            try:
                with open("./classifications/" + str(ith_Day_str + ".csv"), 'r') as file:
                    reader = csv.reader(file)
                    for row in reader:
                        classifications[int(row[1])] += 1
            except IndexError:  # empty file
                return json.dumps({'FileEmpty': True}), 507, {'ContentType': 'application/json'}
            res[ith_Day_str] = int(np.argmax(classifications))
    return res


"""
STATUS/BATTERY LEVEL
"""


@app.route("/sensors/battery")
def get_battery():
    """Get battery percent based on name given in request body.

    Returns:
        dict: Dictionary on the format {battery: str}
    """
    global sensor_bank
    name = request.args.get("name")
    percent = sensor_bank.sensor_dict[name].get_battery_percentage()
    return {"battery": str(percent).split("%")[0]}


@app.route("/status")
def get_status():
    """Get status about connection and classification.

    Returns:
        dict: Dictionary with status information on the format:
            {
                isRecording: str,
                numberOfSensors: int
            }
    """
    global sensor_bank
    return {
        "isRecording": sensor_bank.run,
        "numberOfSensors": len(sensor_bank.sensor_dict)
    }


"""
User reports
"""


def _get_report_fname():
    return f'./reports/{datetime.now().year}-{datetime.now().month}/{date.today().strftime("%Y-%m-%d")}.csv'


@app.route("/reports", methods=["POST"])
def write_report():
    """Write how the user feels to file
    """
    req = request.json
    user_status = req["status"]
    with open(_get_report_fname(), 'a+', newline='') as file:
        try:
            sc._write_to_csv(csv.writer(file), user_status)
        except:
            print("Could not write to file :(")
            return json.dumps({'success': False}), 507, {'ContentType': 'application/json'}
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route("/reports", methods=["GET"])
def get_report():
    """Fetch user reports
    """
    try:
        year = int(request.args.get('year'))
        month = '%02d' % int(request.args.get('month'))
        paths = sorted(Path(f"./reports/{year}-{month}").iterdir(), key=os.path.getmtime)
        file_array = [path.name for path in paths if not path.name.startswith(".")]
        rows = []
        for fname in file_array:
            with open(f"./reports/{year}-{month}/{fname}", 'r') as file:
                try:
                    for row in csv.reader(file):
                        rows.append(row)
                except IndexError:  # empty file
                    return json.dumps({'FileEmpty': True}), 507, {'ContentType': 'application/json'}
        return {"data": rows}
    except FileNotFoundError:
        return json.dumps({'Error': "FileNotFound"}), 507, {'ContentType': 'application/json'}
    except TypeError:
        return json.dumps({'Error': "You have to pass in both query arguments year and month!"}), 400, {'ContentType': 'application/json'}


@ app.route("/reports/available")
def get_report_months_available():
    paths = sorted(Path("./reports/").iterdir(), key=os.path.getmtime)
    res = [path.name for path in paths if not path.name.startswith(".")]
    return {"data": res}


def shutdown():
    """Disconnect sensors and close connections by server shutdown.
    """
    global client
    global sensor_bank
    for name in sensor_bank.sensor_dict:
        sensor_bank.disconnect_sensor(name)
    client.close()


atexit.register(shutdown)
