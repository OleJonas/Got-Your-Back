from .scripts.realtime_jonas import *
from .scripts.realtime_collect import *
from tensorflow import keras
import threading


if __name__ == "__main__":
    global pred_arr
    global data_buf

    path_to_model = "..."
    model = keras.models.load_model(path_to_model)
    analyze_buf = []

    t = threading.Thread(target=analyze_data(data_buf, analyze_buf, model, pred_arr))