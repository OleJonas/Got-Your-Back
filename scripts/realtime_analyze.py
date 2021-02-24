from scripts.realtime_collect import data
import threading 
import keras
import time
import numpy as np

SLEEPTIME = 0.5

def get_model():
    return keras.model.load_model('../model/saved_model.pb')


def concat_data_thread():    
    id_found = [False for i in range(3)]
    predict_buff = []
    while(True):
        if(len(data) == 0):
            print("No work for thread... sleeping for {SLEEPTIME} second(s)")
            time.sleep(SLEEPTIME)
        else:
            first_timestamp = data[0][1]
            first_id = data[0][0]
            id_found[first_id] = True
            predict_buff.append(data[0])
            for row in data[1:-1]:
                if(row[1] == first_timestamp and id_found[row[0]] == False):
                    id_found[row[0]] = True
                    predict_buff.append(row)
                if(id_found[0] == True, id_found[1] == True, id_found[2] == True):
                    
                    #FOUND SAME TIMESTAMP FROM ALL SENSORS. 
                    #ROW CONCATINATION HERE

                    print(predict_buff)
                
                    break
    """
    Realtime collect sin metode collect_data er den som synkroniserer og henter ut data
    Den må etter å ha synkronisert bare stå og gå kontinuerlig (én tråd), samt legge data til buffer
    Så må vi ha en tråd som sover, og sjekker bufferet ved et gitt tidspunkt og predicter på det. Popper buffer
    """

if __name__ == "__main__":
    pass
    

