import os
import sys
import csv
import datetime
import random


def generate(todate, fromdate):
    today = datetime.datetime.strptime(todate, '%Y-%m-%d %H:%M:%S')
    fromday = datetime.datetime.strptime(fromdate, '%Y-%m-%d %H:%M:%S')

    while(not (today.date() == fromday.date())):
        with open(str(datetime.datetime.strftime(today, '%Y-%m-%d') + ".csv"), 'w', newline='') as file:
            fnames = ['time', 'prediction']
            writer = csv.DictWriter(file, fieldnames=fnames)
            nextTime = today + datetime.timedelta(seconds=1)
            for i in range(0, 8):
                randomNumber = random.randint(1,197)
                for _ in range(1,randomNumber):
                    writer.writerow({'time' : datetime.datetime.strftime(nextTime, '%Y-%m-%d %H:%M:%S'), 'prediction' : i})
                    nextTime = nextTime + datetime.timedelta(seconds=1)
        today = today + datetime.timedelta(days=1)

if __name__ == "__main__":
    
    todate = str(input())
    fromdate = str(input())
    generate(todate,fromdate)