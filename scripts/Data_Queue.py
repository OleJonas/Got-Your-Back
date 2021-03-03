class Data_Queue:
    """
    All data from sensors divided into columns depending on sensorID
    """

    def __init__(self, n_sensors=1):
        self.n_sensors = n_sensors
        self.queue = [[] for i in range(n_sensors)]
        self.entries = [0 for i in range(n_sensors)]

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
