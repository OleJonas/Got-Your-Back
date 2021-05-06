import threading

class Data_Queue:
    """A queue structure for keeping track of the data collected from sensors.

    Args:
        n_sensors (int): Number of sensors to collect data from.
    """

    def __init__(self, n_sensors=1):
        self.n_sensors = n_sensors
        self.queue = [[] for i in range(n_sensors)]
        self.entries = [0 for i in range(n_sensors)]
        self.__lock = threading.Lock()
    
    def shift(self):
        """Takes out the first datapoint from every sensor if present.

        Returns:
            [[[float]]]: List of data entries from all sensors, combined in a list of size n_sensors, if data from every sensor is present. None if not. 
        """
        with self.__lock:
            out = [[] for _ in range(self.n_sensors)]
            for i in range(self.n_sensors):
                if len(self.queue[i]) > 0:
                    if self.queue[i][0] == None:  # Return None if the queue didn't have data for all sensors requested
                        return None
                    out[i].append(self.queue[i][0])
            for i in range(self.n_sensors):
                self.queue[i] = self.queue[i][1:]
                self.entries[i] -= 1
            return out

    def push(self, sensor_id: int, data: list):
        """Add a new entry of data in the data queue.

        Args:
            sensor_id (int): Sensor id based on position on body.
            data ([float]): Columns of data from sensor.
        """
        with self.__lock:
            self.queue[sensor_id - 1].append(data)
            self.entries[sensor_id - 1] += 1
