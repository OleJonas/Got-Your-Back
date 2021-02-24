from realtime_collect import *
import threading 
import keras
import time
import pandas as pd

def get_model():
    return keras.model.load_model('../model/saved_model.pb')


def analyze_data(data, analyze_buf, model, pred_arr):    

    pipe = make_pipeline(model)

    timestamp = 0
    tolerance = 0.5 # Used to give some leeway to the timestamps as they won't be exactly the same all the time
    while True:

        while len(data) == 0:
            time.sleep(0.2)

        buf = None
        found_first = False
        search_for = 1

        while not found_first:
            for row in data:
                if row[0] == search_for and row[1] <= tolerance:
                    found_first = True
                    timestamp = float(data[1])
                    tolerance = 0.1
                    search_for += 1
                    buf = row
                    break

        while search_for < 4:
            for row in data:
                if row[0] == search_for and row[1] == timestamp:
                    buf.append(row[2:-1])
                    search_for += 1
                    break
        
        data_point = pd.DataFrame(buf)
        pred_arr.append(pipe.predict(data_point))
        

if __name__ == "__main__":
    pass
    

