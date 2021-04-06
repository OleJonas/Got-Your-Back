.. Got Your Back documentation master file, created by
   sphinx-quickstart on Tue Apr  6 13:08:40 2021.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Got Your Back's documentation!
=========================================

This is the API documentation for code written in the project Got Your Back. The main goal of the methods and code provided is to connect and collect data from sensors provided by `LP-RESEARCH
<https://lp-research.com>`_, classify sitting postures in realtime using machine learning algorithms - and give a user the possibility to control all this in an application provided by us.


.. Structure::

Structure
********

This project's API is divided into two parts; one for the sensor handling, data collection and classification in Python, and one for the frontend application in React Typescript.


Backend
-----------------

Our backend code is split into three folders; one for the server, one for classification and one for the main scripts used.

::
   
   Got Your Back
   ├── backend
   │     ├── openzen.pyd
   │     └── server.py
   ├── classifications
   │     └── generate_dummy_data.py
   └── scripts
         ├── openzen.pyd
         ├── config_test.py
         ├── Data_Queue.py
         ├── realtime_classify.py
         ├── sensor_bank.py
         ├── sensor_id.txt
         └── server_classify.py


Frontend
-----------------

Our frontend folder is a React project, and we will therefore only focus on the src folder as this is where the relevant .ts and .tsx files are located.

::

   frontend/src
   ├── assets
   ├── components
   │     ├── Buttons
   │     │     ├── Button.component.tsx
   │     │     ├── SensorButton.component.tsx
   ├── utils
   ├── views
   │     ├── AboutView
   │     │     ├── AboutView.tsx
   ├── App.test.tsx
   ├── App.tsx
   ├── index.tsx
   ├── openzen.pyd
   ├── Routing.tsx
   └── theme.tsx





