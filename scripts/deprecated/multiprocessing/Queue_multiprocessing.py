import multiprocessing


class Queue:
    def __init__(self, n_sensors=1):
        self.n_sensors = n_sensors
        if n_sensors == 1:
            self.queue = multiprocessing.Array("i", [])
            self.entries = multiprocessing.Value('i', 0)
        else:
            self.queue = [[] for i in range(n_sensors)]
            self.entries = [0 for i in range(n_sensors)]

    def shift(self): pass
    def push(self): pass
    def sync_queue(self): pass
    def flush(self): pass


class Pred_Queue(Queue):
    """
    Prediction queue, consisting of concatted rows from data_queue
    """

    def __init__(self):
        super(Pred_Queue, self).__init__()

    def shift(self):
        out = []
        if len(self.queue) < 1:  # Return None if the queue didn't have data for all sensors requested
            return None
        out.append(self.queue[0])
        with self.queue.get_lock():
            self.queue = self.queue[1:]
        with self.entries.get_lock():
            self.entries -= 1
        return out

    def push(self, data):
        with self.queue.get_lock():
            self.queue.append(data)
            self.entries += 1


class Data_Queue(Queue):
    """
    All data from sensors divided into columns depending on sensorID
    """

    def __init__(self, n_sensors):
        super(Data_Queue, self).__init__(n_sensors)

    def shift(self):
        out = [[] for i in range(self.n_sensors)]
        for i in range(self.n_sensors):
            if len(self.queue[i]) > 0:
                if self.queue[i][0] == None:  # Return None if the queue didn't have data for all sensors requested
                    return None
                out[i].append(self.queue[i][0])
        for i in range(self.n_sensors):
            self.queue[i] = self.queue[i][1:]
            self.entries[i] -= 1
        return out

    def push(self, sensor_id, data):
        self.queue[sensor_id - 1].append(data)
        self.entries[sensor_id - 1] += 1

    def sync_queue(self):
        sync = False
        tries = 20
        indexes = [100, 0, 0]

        while not sync:
            found = 1
            timestamp = self.queue[0][indexes[0]][1]
            i = 0
            while i < tries and found < 3:
                for j in range(1, self.n_sensors):
                    if self.queue[j][i][1] == timestamp:
                        indexes[j] = indexes[0] + i
                        found += 1
            if found == 3:
                sync = True
            else:
                indexes = [indexes[0] + 1, 0, 0]

        for i in range(self.n_sensors):
            self.queue[i] = self.queue[i][indexes[i]:]
