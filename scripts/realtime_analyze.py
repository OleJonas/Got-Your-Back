from . import realtime_collect as rtc
import threading 
import keras


def getModel():
    return keras.model.load_model('../model/saved_model.pb')

class ThreadPool:
    pool = []
    
    def __init__(self, n_threads):
        for i in range(n_threads):
            pool.push

if __name__ == "__main__":
    pass








