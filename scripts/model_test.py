import keras
import numpy as np
import csv
import file

if __name__ == "__main__":
    model = keras.models.load_model('ANN_model')
    filepath = "./data/test_data/elise_test_3_090221.csv"

    with open(filepath, "r") as f:
        reader = csv.reader(f, )