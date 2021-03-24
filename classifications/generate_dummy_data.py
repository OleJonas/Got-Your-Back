import csv
import datetime
import random


def generate(todate, fromdate):
    # Parse input-strings to Datetime-objects
    today = datetime.datetime.strptime(todate, '%Y-%m-%d %H:%M:%S')
    fromday = datetime.datetime.strptime(fromdate, '%Y-%m-%d %H:%M:%S')

    # Number of hours of recording each day
    HOURS = 8

    # Iterate through every day, checks if the date is equal to the "fromdate", which was
    # given as input
    while(not (today.date() == fromday.date())):

        # Create new CSV-file, with date of 'today' as filename
        with open(str(datetime.datetime.strftime(today, '%Y-%m-%d') + ".csv"), 'w', newline='') as file:
            # Declaring fieldnames and DictWriter
            fnames = ['time', 'prediction']
            writer = csv.DictWriter(file, fieldnames=fnames)

            # Declaring end of today (end of current day in the iteration) and get total amount of seconds for that day.
            endOfDay = today + datetime.timedelta(hours=HOURS)
            total_seconds = (endOfDay - today).total_seconds()
            nextTime = today

            # for every second of the day, generate random posture from 0-8
            for i in range(0, int(total_seconds)):
                randomNumber = random.randint(0, 8)

                # Write posture for each second to res
                writer.writerow({'time': datetime.datetime.strftime(nextTime, '%Y-%m-%d %H:%M:%S'), 'prediction': randomNumber})
                nextTime = nextTime + datetime.timedelta(seconds=1)

        # iterating to next day, and proceed to check if equal to the last day
        today = today + datetime.timedelta(days=1)


if __name__ == "__main__":
    todate = str(input())
    fromdate = str(input())
    generate(todate, fromdate)
