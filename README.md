# Got Your Back

[![GotYourBack CI/CD](https://github.com/OleJonas/Got-Your-Back/actions/workflows/gotyourback_CI.yml/badge.svg?branch=main)](https://github.com/OleJonas/Got-Your-Back/actions/workflows/gotyourback_CI.yml)
[![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](https://olejonas.github.io/Got-Your-Back/)

This project contains code written in relation to our bachelor project at NTNU. Our assignment was to classify sitting postures with machine learning algorithms on accelerometer- and gyroscope-data. The datasets are recorded using sensors from LP-RESEARCH, and provided in this repository. Additionally, we have developed an electron app for recording data and classifying your sitting posture in realtime.

#### Installation and setup:

##### Prerequisites
* [Python](https://www.python.org/downloads/)
* [pip](https://pip.pypa.io/en/stable/installing/)
* [node.js](https://nodejs.org/en/download/7.2)

##### Setup:
* Download latest release
* Open a terminal in the project root
* Run `pip install -r "requirements.txt"`
* Run the command `start.bat` for windows and `start.command` for mac

##### Alternative: Clone project
As we depend on another repo for the OpenZen-library, you have to clone the project with the submodules included. The following line will fix this for you:
`git clone --recurse-submodules https://github.com/OleJonas/Got-Your-Back.git 'GotYourBack'`

You will also need to run `npm install` inside the frontend-folder, and `pip install -r "requirements.txt"` inside root. For running the application you will need to make it using `npm run make_windows` for windows or `npm run make` for mac. Another option is to run as development server either in browser (`npm start`) or as an electron application (`npm run dev`).

#### Structure

##### Frontend

```bash
Got Your Back/frontend
├── README.md
├── assets
├── build
├── dist
├── package-lock.json
├── package.json
├── public
│   ├── electron.js
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── @types
│   ├── App.tsx
│   ├── Routing.tsx
│   ├── assets
│   ├── components
│   │   ├── Buttons
│   │   │   ├── Button.component.tsx
│   │   │   └── SensorButton.component.tsx
│   │   ├── ClassificationContent
│   │   │   └── ClassificationContent.component.tsx
│   │   ├── ColumnChart
│   │   │   └── ColumnChart.component.tsx
│   │   ├── ContentBox
│   │   │   └── ContentBox.component.tsx
│   │   ├── HomeShade
│   │   │   └── HomeShade.component.tsx
│   │   ├── InfoTooltip
│   │   │   └── InfoTooltip.component.tsx
│   │   ├── LineChart
│   │   │   └── LineChart.component.jsx
│   │   ├── NavBar
│   │   │   └── NavBar.component.tsx
│   │   ├── PieChart
│   │   │   └── PieChart.component.jsx
│   │   ├── RecordContent
│   │   │   └── RecordContent.component.tsx
│   │   ├── SensorListContent
│   │   │   └── SensorListContent.component.tsx
│   │   ├── SensorModal
│   │   │   └── SensorModal.component.tsx
│   │   ├── SensorRow
│   │   │   ├── SensorRowHome.component.tsx
│   │   │   └── SensorRowModal.component.tsx
│   │   ├── StatusBar
│   │   │   └── StatusBar.component.tsx
│   │   ├── StatusGraphPopup
│   │   │   └── StatusGraphPopup.component.tsx
│   │   └── StatusPopup
│   │       └── StatusPopup.component.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── theme.tsx
│   ├── utils
│   │   ├── dateUtils.ts
│   │   ├── handleErrors.ts
│   │   ├── postureNames.ts
│   │   ├── sensorPlacement.ts
│   │   ├── serverUtils.ts
│   │   └── useInterval.ts
│   └── views
│       ├── HelpView
│       │   └── HelpView.tsx
│       ├── HistoryView
│       │   └── HistoryView.tsx
│       ├── HomeView
│       │   └── HomeView.tsx
│       └── ReportView
│           └── ReportView.tsx
└── tsconfig.json
```

##### Backend

```bash
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
│   │   ├── Preprocess_data.ipynb
│   │   ├── Precision.ipynb
│   │   └── RFC.ipynb
│   └── utils
│       ├── declarations.py
│       └── df_utils.py
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
```
