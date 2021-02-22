from dataclasses import dataclass

@dataclass
class training_class:
    csv_file: str
    annot_file: str

@dataclass
class testing_class:
    csv_file: str
    annot_file: str

training_files = {
    "Martin": training_class("../../data/train_data/martin_train_3_030221.csv", 
                            "../../data/annotation/training/martin_train_3_030221.txt"),
    "Simon": training_class("../../data/train_data/simon_train_3_080221.csv",
                            "../../data/annotation/training/simon_train_3_080221.txt"),
    "Jonas": training_class("../../data/train_data/jonas_train_3_080221.csv",
                            "../../data/annotation/training/jonas_train_3_080221.txt"),
    "Elise": training_class("../../data/train_data/elise_train_3_090221.csv",
                            "../../data/annotation/training/elise_train_3_090221.txt"),
    "Emanuel": training_class("../../data/train_data/emanuel_train_3_110221.csv",
                            "../../data/annotation/training/emanuel_train_3_110221.txt"),
    "Xiaomeng": training_class("../../data/train_data/xiaomeng_train_3_110221.csv",
                            "../../data/annotation/training/xiaomeng_train_3_110221.txt"),
}

testing_files = {
    "Martin": testing_class("../../data/test_data/martin_test_3_040221.csv",
                            "../../data/annotation/testing/martin_test_3_040221.txt"),
    "Emanuel": testing_class("../../data/test_data/emanuel_test_3_110221.csv",
                             "../../data/annotation/testing/emanuel_test_3_110221.txt"),
    "Elise": testing_class("../../data/test_data/elise_test_3_090221.csv", 
                            "../../data/annotation/testing/elise_test_3_090221.txt"),
    "Xiaomeng": testing_class("../../data/test_data/xiaomeng_test_3_110221.csv", 
                            "../../data/annotation/testing/xiaomeng_test_3_110221.txt")
}