# Got Your Back

[![GotYourBack CI/CD](https://github.com/OleJonas/Got-Your-Back/actions/workflows/gotyourback_CI.yml/badge.svg?branch=main)](https://github.com/OleJonas/Got-Your-Back/actions/workflows/gotyourback_CI.yml)
[![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](https://olejonas.github.io/Got-Your-Back/)

This project contains code written in relation to our bachelor project at NTNU. Our assignment was to classify sitting postures with machine learning algorithms on accelerometer- and gyroscope-data. The datasets are recorded using sensors from LP-RESEARCH, and provided in this repository. Additionally, we have developed an electron app for recording data and classifying your sitting posture in realtime.

#### Installation and setup:

##### Prerequisites
* [Python 3.8](https://www.python.org/downloads/release/python-380/)
* [pip](https://pip.pypa.io/en/stable/installing/)
* [node.js](https://nodejs.org/en/download/7.2)

##### Setup:
* Download latest release
* Open a terminal in the project root
* Run `pip install -r "requirements.txt"`
* Run the command `start.bat` for windows or `start.command` for mac

##### Alternative: Clone project
As we depend on another repo for the OpenZen-library, you have to clone the project with the submodules included. The following line will fix this for you:
`git clone --recurse-submodules https://github.com/OleJonas/Got-Your-Back.git 'GotYourBack'`

You will also need to run `npm install` inside the frontend-folder, and `pip install -r "requirements.txt"` inside root. For running the application you will need to make it using `npm run make_windows` for windows or `npm run make` for mac. Another option is to run as development server either in browser (`npm start`) or as an electron application (`npm run dev`).

#### Troubleshooting

If you are experiencing any problems connecting to the sensors (eg. `The file "btScan" doesn't exist`), try building the openzen lib again. 
This is done by running the following commands:
- `cd ./lib/openzen`
- `mkdir build && cd build`
- `make -j4`
- `cmake -DZEN_PYTHON=ON ..`

In the openzen-folder, you wil now find a file called openzen.pyd (Windows), or openzen.so (Unix). 
Copy this file and place it in the scripts- and backend-folder.
