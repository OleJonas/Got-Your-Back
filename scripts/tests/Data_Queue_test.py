import unittest
import sys
sys.path.append("../")
from data_queue import *

class Data_Queue_test(unittest.TestCase):
    def setUp(self):
        self.data_queue_1 = Data_Queue()
        self.data_queue_2 = Data_Queue(2)
        self.data_queue_3 = Data_Queue(3)
    
    def tearDown(self):
        self.data_queue_1 = None
        self.data_queue_2 = None
        self.data_queue_3 = None
    
    def test_push(self):
        # Testing queue with 1 sensor
        assert len(self.data_queue_1.queue[0]) == 0
        self.data_queue_1.push(1, ["a", "b", "c"])
        self.data_queue_1.push(1, ["a", "b", "c"])
        assert len(self.data_queue_1.queue[0]) == 2

        # Testing queue with 2 sensors
        for queue in self.data_queue_2.queue:
            assert len(queue) == 0

        self.data_queue_2.push(1, ["a", "b", "c"])
        self.data_queue_2.push(1, ["a", "b", "c"])
        self.data_queue_2.push(2, ["a", "b", "c"])
        self.data_queue_2.push(2, ["a", "b", "c"])

        for queue in self.data_queue_2.queue:
            assert len(queue) == 2

        # Testing queue with 3 sensors
        for queue in self.data_queue_3.queue:
            assert len(queue) == 0

        self.data_queue_3.push(1, ["a", "b", "c"])
        self.data_queue_3.push(1, ["a", "b", "c"])
        self.data_queue_3.push(2, ["a", "b", "c"])
        self.data_queue_3.push(2, ["a", "b", "c"])
        self.data_queue_3.push(3, ["a", "b", "c"])
        self.data_queue_3.push(3, ["a", "b", "c"])

        for queue in self.data_queue_3.queue:
            assert len(queue) == 2


    def test_shift_return_size(self):
        # Testing queue with 1 sensor
        self.data_queue_1.push(1, ["a", "b", "c"])
        res = self.data_queue_1.shift()
        assert len(res) == 1



        # Testing queue with 2 sensors
        self.data_queue_2.push(1, ["a", "b", "c"])
        self.data_queue_2.push(2, ["a", "b", "c"])
        res = self.data_queue_2.shift()
        assert len(res) == 2


        # Testing queue with 3 sensors
        self.data_queue_3.push(1, ["a", "b", "c"])
        self.data_queue_3.push(2, ["a", "b", "c"])
        self.data_queue_3.push(3, ["a", "b", "c"])
        res = self.data_queue_3.shift()
        assert len(res) == 3


    def test_data_queue_entries(self):
        # Testing queue with 1 sensor
        self.data_queue_1.push(1, ["a", "b", "c"])
        self.data_queue_1.push(1, ["a", "b", "c"])
        assert self.data_queue_1.entries[0] == 2

        self.data_queue_1.shift()
        assert self.data_queue_1.entries[0] == 1

        # Testing queue with 2 sensor
        for i in range(2):
            self.data_queue_2.push(i+1, ["a", "b", "c"])
            self.data_queue_2.push(i+1, ["a", "b", "c"])
        assert self.data_queue_2.entries[0] == 2
        assert self.data_queue_2.entries[1] == 2

        self.data_queue_2.shift()
        assert self.data_queue_2.entries[0] == 1
        assert self.data_queue_2.entries[1] == 1

        # Testing queue with 3 sensor
        for i in range(3):
            self.data_queue_3.push(i+1, ["a", "b", "c"])
            self.data_queue_3.push(i+1, ["a", "b", "c"])

        for i in range(3):
            assert self.data_queue_3.entries[i] == 2

        self.data_queue_3.shift()
        for i in range(3):
            assert self.data_queue_3.entries[i] == 1


    if __name__ == "__main__":
        unittest.main()