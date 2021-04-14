"""Test of config file

This is meant for testing the usage of a configfile, listing the id of all the known sensors.
"""

import os
from tempfile import NamedTemporaryFile

FIFO_NAME = "classifications"

if __name__ == "__main__":
    sensor_id_dict = dict()
    with open("./scripts/sensor_id.txt", "r") as f:
        for line in f:
            sensor_and_id = line.split(" ")
            sensor_id_dict[sensor_and_id[0]] = int(sensor_and_id[1])
    print(sensor_id_dict)

    with open("./scripts/sensor_id.txt") as fin, NamedTemporaryFile(dir='.', delete=False) as fout:
        for line in fin:
            if line.startswith("LPMSB2-3036EB"):
                line = "LPMSB2-3036EB 5\n"
            fout.write(line.encode('utf8'))

    os.replace(fout.name, "./scripts/sensor_id.txt")
