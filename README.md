# Got Your Back

This project contains code written in relation to our bachelor project at NTNU. Our assignment is to classify sitting postures with machine learning algorithms on accelerometer- and gyroscope-data. The datasets are recorded using sensors from LP-RESEARCH, and provided in this repository. Additionally, we have developed an electron app for recording data and live-classify your sitting posture over time.

#### Releases:

For cloning:
As we depend on another repo for the OpenZen-library, you have to clone the project with the submodules included. The following line will fix this for you:

`git clone --recurse-submodules https://github.com/OleJonas/Got-Your-Back.git 'GotYourBack'`

TODO:
Create releases for both windows and mac and upload

#### Setup

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
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── setupTests.ts
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
