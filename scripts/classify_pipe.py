import os
import select
from realtime_test import classify

FIFO_NAME = "classifications"

if __name__ == "__main__":
    """
    Call script with args
    """

    try:
        fifo_pipe = os.open(FIFO_NAME, os.O_WRONLY) # Make pipe to send classifications to