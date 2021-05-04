## Structure

The frontend folder has the following subfolders of importance:

- build - output directory for built react project
- dist - output directory for built electron application
- src
  - components - functional components
  - views - each program view
  - utils - typescript utilities

**Full tree:**

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

There is two options when it comes to dowloading the project.
The recommended option is to download one of the releases from GitHub.
Another option is to fork the project, but as we depend on the repository of openzen, make sure to fork with submodules.

For setting up the backend side of the project, run
`pip install -r "requirements.txt"`
from the project root. By downloading a release it is not necessary to install further dependencies. If forking the project instead, run `cd frontend && npm install`

## Run application

#### Release download

Run the `start.command`/`start.bat` executable.

#### Forked project

Find the application in dist and run it from there or run the application with one of the following scripts (in frontend directory):

- `npm start` (in browser)
- `npm run dev` (in electron) from the frontend folder.
