import csv
import datetime
import random


def generate(from_date: str, to_date: str, hours_per_day: int):
    """Generate dummy classification data from date to another date.

    Args:
        from_date (str): Start date on format "%Y-%m-%d %H:%M:%S".
        to_date (str): End date on format "%Y-%m-%d".
        hours_per_day (int): Number of hours of recording each day.
    """
    # Parse input-strings to Datetime-objects
    current_day = datetime.datetime.strptime(from_date, '%Y-%m-%d %H:%M:%S')
    end_day = datetime.datetime.strptime(to_date, '%Y-%m-%d')

    # Iterate through every day, checks if the date is equal to the "from_date", which was
    # given as input
    while(not (current_day.date() == (end_day.date() + datetime.timedelta(days=1)))):
        # Create new CSV-file, with date of 'current_day' as filename
        with open(f"./classifications/{str(datetime.datetime.strftime(current_day, '%Y-%m-%d'))}.csv", 'w+', newline='') as file:
            # Declaring fieldnames and DictWriter
            fnames = ['time', 'prediction']
            writer = csv.DictWriter(file, fieldnames=fnames)

            # Declaring end of current_day (end of current day in the iteration) and get total amount of seconds for that day.
            endOfDay = current_day + datetime.timedelta(hours=hours_per_day)
            total_seconds = (endOfDay - current_day).total_seconds()
            nextTime = current_day

            # for every second of the day, generate random posture from 0-8
            counter = 0
            current_value = random.randint(0, 8)
            for i in range(0, int(total_seconds)):
                if counter == 300:
                    current_value = random.randint(0, 8)
                    counter = 0

                # Write posture for each second to res
                writer.writerow({'time': datetime.datetime.strftime(nextTime, '%Y-%m-%d %H:%M:%S'), 'prediction': current_value})
                nextTime = nextTime + datetime.timedelta(seconds=1)
                counter += 1

        # iterating to next day, and proceed to check if equal to the last day
        current_day = current_day + datetime.timedelta(days=1)


if __name__ == "__main__":
    from_date = str(input("Start date on format '%Y-%m-%d %H:%M:%S': "))
    # 2021-03-01 09:00:00
    to_date = str(input("End date on format '%Y-%m-%d': "))
    # 2021-04-30
    hours_per_day = 8
    print("Starting to generate dummydata")
    generate(from_date, to_date, hours_per_day)
    print("Dummydata generated!")
