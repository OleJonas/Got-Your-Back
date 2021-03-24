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
            endOfDay = today + datetime.timedelta(hours=8)
            total_seconds = (endOfDay - today).total_seconds()
            nextTime = today
            for i in range(0, int(total_seconds)):
                randomNumber = random.randint(0,8)
                writer.writerow({'time' : datetime.datetime.strftime(nextTime, '%Y-%m-%d %H:%M:%S'), 'prediction' : randomNumber})
                nextTime = nextTime + datetime.timedelta(seconds=1)
        today = today + datetime.timedelta(days=1)

if __name__ == "__main__":
    
    todate = str(input())
    fromdate = str(input())
    generate(todate,fromdate)