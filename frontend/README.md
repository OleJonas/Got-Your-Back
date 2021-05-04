
## Structure

The frontend folder has the following subfolders of importance:
* build - output directory for built react project
* dist - output directory for built electron application
* src


one for the backend server, one for classifications, one for models and one for the main scripts used. 
In addition to this, there is folders for data recorded for model training, classifications and reports made by the application.

```bash
Got Your Back/frontend
├── README.md
├── assets
│   └── icon.png
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
│   │   ├── App_Icon.png
│   │   ├── Logo.svg
│   │   ├── Sensor_placement.svg
│   │   ├── Sensor_placement_numerated.svg
│   │   ├── loader.svg
│   │   ├── loader_black.svg
│   │   └── loader_white.svg
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

## Setup & download
=================

There is two options when it comes to dowloading the project. 
The recommended option is to download one of the releases from GitHub. 
Another option is to fork the project, but as we depend on the repository of openzen, make sure to fork with submodules.

For setting up the backend side of the project, run
``pip install -r "requirements.txt"``
from the project root. 

## Start server


This project utilizes the pip package waitress-serve for running a production server.
This can be run by running the ``start_server.bat`` for windows and ``start_server.command`` for mac.
Another option is to run 
``waitress-serve --port 60066 "server:app"``
from inside the backend folder. 

*For running the application, you could either:*
      - Release
            - click on the ``start.command``/``start.bat`` (recommended) - this also starts server!
      - Forked
            - find the application in dist and run it from there
            - run ``npm start`` (in browser) or ``npm run dev`` (in electron) from the frontend folder.

