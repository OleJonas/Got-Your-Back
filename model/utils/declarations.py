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
    "Martin": training_class("../../data/train_data/001_train_3_030221.csv",
                             "../../data/annotation/training/001_train_3_030221.txt"),
    "Simon": training_class("../../data/train_data/002_train_3_080221.csv",
                            "../../data/annotation/training/002_train_3_080221.txt"),
    "Jonas": training_class("../../data/train_data/003_train_3_080221.csv",
                            "../../data/annotation/training/003_train_3_080221.txt"),
    "Xiaomeng": training_class("../../data/train_data/004_train_3_110221.csv",
                               "../../data/annotation/training/004_train_3_110221.txt"),
    "Elise": training_class("../../data/train_data/005_train_3_090221.csv",
                            "../../data/annotation/training/005_train_3_090221.txt"),
    "Emanuel": training_class("../../data/train_data/006_train_3_110221.csv",
                              "../../data/annotation/training/006_train_3_110221.txt"),
    "Lea": training_class("../../data/train_data/007_train_3_030321.csv",
                          "../../data/annotation/training/007_train_3_030321.txt"),
    "Joy": training_class("../../data/train_data/008_train_3_030321.csv",
                          "../../data/annotation/training/008_train_3_030321.txt"),
}

testing_files = {
    "Martin": testing_class("../../data/test_data/001_test_3_040221.csv",
                            "../../data/annotation/testing/001_test_3_040221.txt"),
    "Xiaomeng": testing_class("../../data/test_data/004_test_3_110221.csv",
                              "../../data/annotation/testing/004_test_3_110221.txt"),
    "Elise": testing_class("../../data/test_data/005_test_3_090221.csv",
                           "../../data/annotation/testing/005_test_3_090221.txt"),
    "Emanuel": testing_class("../../data/test_data/006_test_3_110221.csv",
                             "../../data/annotation/testing/006_test_3_110221.txt"),
    "Lea": testing_class("../../data/test_data/007_test_3_030321.csv",
                         "../../data/annotation/testing/007_test_3_030321.txt"),
    "Joy": testing_class("../../data/test_data/008_test_3_030321.csv",
                         "../../data/annotation/testing/008_test_3_030321.txt"),
}
