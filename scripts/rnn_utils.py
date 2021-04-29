from scipy import stats
import numpy as np


def create_3d_array(array: list, num_timestamps: int):
    """Generate three-dimensional array for RNN

    Args:
        array ([float]): Data from sensors to be concatted
        num_timestamps (int): Number of timestamps to concat into new array

    Returns:
        [[[float]]]: Three dimensional array
    """
    arr_3d = []
    temp_2d = []
    for i in range(1, len(array)):
        temp_2d.append(array[i])
        if i % num_timestamps == 0:
            arr_3d.append(temp_2d)
            temp_2d = []
    return arr_3d


def create_2d_y_array(array: list, num_timestamps: int):
    """Generate two-dimensional array for RNN

    Args:
        array ([float]): Data from sensors to be concatted
        num_timestamps (int): Number of timestamps to concat into new array

    Returns:
        [[float]]: Two-dimensional array
    """
    temp_y_train = []
    mode_arr = []

    for i in range(1, len(array)):
        # temp_2d.append(array[0])
        temp_y_train.append(array[i])
        if i % num_timestamps == 0:
            mode_arr.append(temp_y_train)

            temp_y_train = []
            #temp_2d = []

    y_train_to_be_encoded = []

    for i in range(len(mode_arr)):
        mode = stats.mode(mode_arr[i])
        y_train_to_be_encoded.append(mode.mode[0])

    # ONE HOT ENCODING
    encoding = []
    for value in y_train_to_be_encoded:
        vector = [0 for _ in range(9)]
        vector[value] = 1
        encoding.append(vector)

    return np.array(encoding)
