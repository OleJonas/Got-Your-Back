from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/sensors')
def get_sensors():
    return [{"name": "LPMSB2 - 3036EB", "id": "1", "battery": "85,3%"}, 
            {"name": "LPMSB2 - 4B3326", "id": "2", "battery": "76,6%"},
            {"name": "LPMSB2 - 4B31EE", "id": "3", "battery": "54,26%"}]