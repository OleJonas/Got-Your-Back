Structure
**********

This project's API is divided into two parts; one for the sensor handling, data collection and classification in Python, and one for the frontend application in React Typescript.


Backend
-------

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
--------

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



Indices and tables
------------------

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`