#############
Introduction
#############

Structure
==========

Our backend is split into four main folders;
one for the backend server, one for classifications, one for models and one for the main scripts used. 
In addition to this, there is folders for data recorded for model training, classifications and reports made by the application.

::
   
      Got Your Back
      ├── backend
      │   ├── openzen.pyd
      │   ├── openzen.so
      │   ├── server.py
      │   └── server_test.py
      ├── classifications
      │   ├── [classification files]
      │   └── generate_dummy_data.py
      ├── data
      │   ├── annotation
      │   │   ├── testing
      │   │   └── training
      │   ├── overview_of_data_collection.ipynb
      │   ├── sensor_calibrations
      │   │   ├── 00043E3036EB_CAL
      │   │   ├── 00043E4B31EE_CAL
      │   │   └── 00043E4B3326_CAL
      │   ├── test_data
      │   │   └── [testing datasets]
      │   └── train_data
      │       └── [training datasets]
      ├── model
      │   ├── models
      │   ├── src
      │   │   ├── ANN.ipynb
      │   │   ├── CNN.ipynb
      │   │   ├── LSTM.ipynb
      │   │   └── RFC.ipynb
      │   └── utils
      │       ├── Data_presentation.ipynb
      │       ├── declarations.py
      │       ├── df_utils.py
      │       ├── Preprocess_data.ipynb
      │       └── Precision.ipynb
      ├── reports
      ├── requirements.txt
      ├── scripts
      │   ├── classification_handler.py
      │   ├── data_queue.py
      │   ├── openzen.pyd
      │   ├── openzen.so
      │   ├── realtime_classify.py
      │   ├── rnn_utils.py
      │   ├── sensor_bank.py
      │   └── tests
      │       ├── data_queue_test.py
      │       ├── openzen.pyd
      │       └── sensor_bank_test.py
      ├── start.bat
      ├── start.command
      ├── start_server.bat
      └── start_server.command
      

Setup & download
=================

There is two options when it comes to dowloading the project. 
The recommended option is to download one of the releases from GitHub. 
Another option is to fork the project, but as we depend on the repository of openzen, make sure to fork with submodules.

For setting up the backend side of the project, run
``pip install -r "requirements.txt"``
from the project root. 

Start server
=============

This project utilizes the pip package waitress-serve for running a production server.
This can be run by running the ``start_server.bat`` for windows and ``start_server.command`` for mac.
Another option is to run 
``waitress-serve --port 60066 "server:app"``
from inside the backend folder. 

*For running the application, you could either:*
      - Release
            - click on the ``start.command``/``start.bat`` (recommended) - this also starts server!
      - Forked - Build application
            - run ``npm install``
            - build by running ``npm run make_windows`` (only windows) or ``npm run make`` (both macOS and Windows)
            - now you could either find the application in dist and run it from there. Also possible to run ``start.command`` or ``start.bat`` now.
            - or you can run ``npm start`` (in browser) or ``npm run dev`` (in electron) from the frontend folder to run as development application.


Indices and tables
===================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`