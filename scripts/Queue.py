class Queue:
    def __init__(self, n_columns=1):
        if n_columns == 1: self.queue = []
        else: self.queue = [[] for i in range(n_columns)]
        self.n_columns = n_columns
        self.entries = [0 for i in range(n_columns)]
    
    def shift(self): pass
    def push(self): pass
    def sync_queue(self): pass

class Pred_Queue(Queue):
    def __init__(self):
        super(Pred_Queue, self).__init__()

    def shift(self):
        out = []
        if self.queue[0] == None: # Return None if the queue didn't have data for all sensors requested
            return None
        out.append(self.queue[0])
        self.queue = self.queue[1:]
        self.entries[0] -= 1
        print(out)
        return out
    
    def push(self, sensor_id, data):
        self.queue.append(data)
        self.entries[0] += 1    
        
class Data_Queue(Queue):
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
        print(out)
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