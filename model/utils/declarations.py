from dataclasses import dataclass

POSE_MAP = {
    "rett": 0,
    "fram": 1,
    "fram-hoyre": 2,
    "hoyre": 3,
    "bak-hoyre": 4,
    "bak": 5,
    "bak-venstre": 6,
    "venstre": 7,
    "fram-venstre": 8
}


@dataclass
class training_class:
    csv_file: str
    annot_file: str


@dataclass
class testing_class:
    csv_file: str
    annot_file: str


training_files = {
    "001": training_class("../../data/train_data/001_train_3_030221.csv",
                             "../../data/annotation/training/001_train_3_030221.txt"),
    "002": training_class("../../data/train_data/002_train_3_080221.csv",
                            "../../data/annotation/training/002_train_3_080221.txt"),
    "003": training_class("../../data/train_data/003_train_3_080221.csv",
                            "../../data/annotation/training/003_train_3_080221.txt"),
    "004": training_class("../../data/train_data/004_train_3_110221.csv",
                               "../../data/annotation/training/004_train_3_110221.txt"),
    "005": training_class("../../data/train_data/005_train_3_090221.csv",
                            "../../data/annotation/training/005_train_3_090221.txt"),
    "006": training_class("../../data/train_data/006_train_3_110221.csv",
                              "../../data/annotation/training/006_train_3_110221.txt"),
    # "007": training_class("../../data/train_data/007_train_3_030321.csv",
    #                     "../../data/annotation/training/007_train_3_030321.txt"),
    # "008": training_class("../../data/train_data/008_train_3_030321.csv",
    #                     "../../data/annotation/training/008_train_3_030321.txt"),
    "009": training_class("../../data/train_data/009_train_3_120421.csv",
                          "../../data/annotation/training/009_train_3_120421.txt"),
    # "010": training_class("../../data/train_data/010_train_3_220421.csv",
    #                       "../../data/annotation/training/010_train_3_220421.txt"),
}


testing_files = {
    "001": testing_class("../../data/test_data/001_test_3_100521.csv",
                            "../../data/annotation/testing/001_test_3_100521.txt"),
    "002": testing_class("../../data/test_data/002_test_3_140421.csv",
                          "../../data/annotation/testing/002_test_3_140421.txt"),
    "003": testing_class("../../data/test_data/003_test_3_120521.csv",
                         "../../data/annotation/testing/003_test_3_120521.txt"),
    "004": testing_class("../../data/test_data/004_test_3_110221.csv",
                              "../../data/annotation/testing/004_test_3_110221.txt"),
    "005": testing_class("../../data/test_data/005_test_3_090221.csv",
                           "../../data/annotation/testing/005_test_3_090221.txt"),
    "006": testing_class("../../data/test_data/006_test_3_110221.csv",
                             "../../data/annotation/testing/006_test_3_110221.txt"),
    "007": testing_class("../../data/test_data/007_test_3_030321.csv",
                        "../../data/annotation/testing/007_test_3_030321.txt"),
    "008": testing_class("../../data/test_data/008_test_3_120521.csv",
                       "../../data/annotation/testing/008_test_3_120521.txt"),
    "009": testing_class("../../data/test_data/009_test_3_120421.csv",
                          "../../data/annotation/testing/009_test_3_120421.txt"),
    "010": testing_class("../../data/test_data/010_test_3_220421.csv",
                        "../../data/annotation/testing/010_test_3_220421.txt"),
}

