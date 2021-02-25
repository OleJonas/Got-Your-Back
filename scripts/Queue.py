from collections import deque
from datetime import datetime

class Queue:
    def __init__(self, n_columns=1):
        if n_columns == 1: self.queue = []
        else: self.queue = [[] for i in range(n_columns)]
        self.n_columns = n_columns
        self.entries = [0 for i in range(n_columns)]
    
    def shift(self): pass
    def push(self): pass
    def sync_queue(self): pass
    def flush_unneeded_rows(self): pass

class Pred_Queue(Queue):
    """
    Prediction queue, including concatted rows from data_queue
    """

    def __init__(self):
        super(Pred_Queue, self).__init__()
        self.timestamps = deque([])

    def flush_unneeded_rows(self):
        amount_to_flush = min(self.entries)
        for i in range(self.n_columns):
            self.queue[i] = self.queue[i][amount_to_flush:]
            self.entries[i] -= amount_to_flush
        for _ in range(amount_to_flush): self.timestamps.popleft()

    def shift(self):
        out = []
        if len(self.queue) < 1: # Return None if the queue didn't have data for all sensors requested
            return None
        out.append(self.queue[0])
        self.queue = self.queue[1:]
        self.entries[0] -= 1
        return out
    
    def push(self, sensor_id, data):
        self.queue.append(data)
        self.entries[0] += 1
        a = datetime.now()
        self.timestamps.append(f"{a.minute}:{a.second}:{str(a.microsecond)[:2]}")
        
class Data_Queue(Queue):
    """
    All data from sensors divided into columns depending on sensorID
    """
    def __init__(self, n_columns):
        super(Data_Queue, self).__init__(n_columns)

    def shift(self):
        out = [[] for i in range(self.n_columns)]

        for i in range(self.n_columns):
            if len(self.queue[i]) > 0:
                if self.queue[i][0] == None: # Return None if the queue didn't have data for all sensors requested
                    return None
                out[i].append(self.queue[i][0])

        for i in range(self.n_columns):
            self.queue[i] = self.queue[i][1:]
            self.entries[i] -= 1
        #print(out)
        return out
    
    def push(self, sensor_id, data):
        self.queue[sensor_id-1].append(data)
        self.entries[sensor_id-1] += 1

    def sync_queue(self):
        sync = False
        tries = 20
        indexes = [100,0,0]
        
        while not sync:
            found = 1
            timestamp = self.queue[0][indexes[0]][1]
            i = 0
            while i < tries and found < 3:
                for j in range(1,self.n_columns):
                    if self.queue[j][i][1] == timestamp: 
                        indexes[j] = indexes[0] + i
                        found += 1
                        
            if found == 3: sync = True
            else: indexes = [indexes[0]+1, 0, 0]

        for i in range(self.n_columns):
            self.queue[i] = self.queue[i][indexes[i]:]