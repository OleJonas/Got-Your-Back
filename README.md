# Got Your Back

This repository is for our Bachelors project; a project in which we want to be able to classify your posture over time and give feedback to the user regarding their posture both live and over time. This will be visualized by Simon Årdal's seaborn diagrams, in which you will find EVERYWHERE. Buckle up, this gonna be a wild ride!!!

#### For cloning this repo, write:

As we depend on another repo for the OpenZen-library, you have to clone the project with the submodules included. 
The following line wil fix this for you:

`git clone --recurse-submodules https://github.com/OleJonas/Got-Your-Back.git 'GotYourBack'`

#### Setup

We have to fix the setupprocess for openzen, for Linux and for Windows. Maybe create a script for building, adding classpath and updating the openzen.pyd/so for Linux and Mac automatically if possible?


#### Structure

Here we will describe the folderstructure:

```bash
Got Your Back
├── ANN_model
│   ├── saved_model.pb
│   └── variables
│       ├── variables.data-00000-of-00001
│       └── variables.index
├── README.md
├── assets
│   └── Logo.svg
├── data
│   ├── annotation
│   │   ├── testing
│   │   │   ├── elise_test_3_090221.txt
│   │   │   ├── emanuel_test_3_110221.txt
│   │   │   ├── martin_test_1_030221.txt
│   │   │   ├── martin_test_2_030221.txt
│   │   │   ├── martin_test_3_040221.txt
│   │   │   ├── simon_test_1_020221.txt
│   │   │   └── xiaomeng_test_3_110221.txt
│   │   └── training
│   │       ├── elise_train_3_090221.txt
│   │       ├── emanuel_train_3_110221.txt
│   │       ├── jonas_train_1_080221.txt
│   │       ├── jonas_train_3_080221.txt
│   │       ├── martin_train_1_020221.txt
│   │       ├── martin_train_2_020221.txt
│   │       ├── martin_train_3_030221.txt
│   │       ├── simon_train_1_080221.txt
│   │       ├── simon_train_1_280121.txt
│   │       ├── simon_train_2_080221.txt
│   │       ├── simon_train_3_080221.txt
│   │       └── xiaomeng_train_3_110221.txt
│   ├── confirm_data.ipynb
│   ├── live
│   │   └── info.txt
│   ├── overview_of_data_collection.ipynb
│   ├── sensor_calibrations
│   │   ├── 00043E4B31EE_CAL
│   │   ├── 00043E4B3326_CAL
│   │   └── 00043E3036EB_CAL
│   ├── test_data
│   │   ├── elise_test_3_090221.csv
│   │   ├── emanuel_test_3_110221.csv
│   │   ├── martin_test_1_030221.csv
│   │   ├── martin_test_2_030221.csv
│   │   ├── martin_test_3_040221.csv
│   │   ├── simon_test_1_020221.csv
│   │   └── xiaomeng_test_3_110221.csv
│   └── train_data
│       ├── elise_train_3_090221.csv
│       ├── emanuel_train_3_110221.csv
│       ├── jonas_train_1_080221.csv
│       ├── jonas_train_2_080221.csv
│       ├── jonas_train_3_080221.csv
│       ├── martin_train_1_020221.csv
│       ├── martin_train_2_020221.csv
│       ├── martin_train_3_020221.csv
│       ├── martin_train_3_030221.csv
│       ├── simon_train_1_080221.csv
│       ├── simon_train_1_280121.csv
│       ├── simon_train_2_080221.csv
│       ├── simon_train_3_080221.csv
│       └── xiaomeng_train_3_110221.csv
├── lib
├── model
│   ├── annotation
│   │   ├── ANVIL
│   │   │   └── data_management.ipynb
│   │   └── FCPX
│   │       ├── annotation_for_FCPX.py
│   │       ├── data_management.py
│   │       └── markers.txt
│   ├── deprecated
│   │   ├── ANN_PyTorch.ipynb
│   │   ├── openzen.pyd
│   │   └── openzen_python_test.py
│   ├── df_utils.py
│   ├── file_declarations.py
│   ├── ml_algorithms
│   │   ├── ANN.ipynb
│   │   └── RFC.ipynb
│   └── sensors.py
├── realtimetest.csv
├── requirements.txt
├── scripts
│   ├── Queue.py
│   ├── deprecated
│   │   ├── collect_data.py
│   │   ├── realtime_collect.py
│   │   └── realtime_jonas.py
│   ├── openzen.pyd
│   └── realtime_classify.py
└── setup.cfg
```

### Sensor properties fetchable

From the sensors we can fetch different properties using one of the following methods:
* get_float_property()
* get_byte_property()
* get_int32_property()
* get_uint64_property()
* get_array_property()
* execute_command()

ZenImu object:
```
openzen.ZenImuProperty.Invalid = 0,
openzen.ZenImuProperty.StreamData = 1000,
openzen.ZenImuProperty.SamplingRate,
openzen.ZenImuProperty.SupportedSamplingRates,
openzen.ZenImuProperty.PollSensorData,
openzen.ZenImuProperty.CalibrateGyro,
openzen.ZenImuProperty.ResetOrientationOffset,
openzen.ZenImuProperty.CentricCompensationRate,
openzen.ZenImuProperty.LinearCompensationRate,
openzen.ZenImuProperty.FieldRadius,
openzen.ZenImuProperty.FilterMode,
openzen.ZenImuProperty.SupportedFilterModes,
openzen.ZenImuProperty.FilterPreset,
openzen.ZenImuProperty.OrientationOffsetMode,
openzen.ZenImuProperty.AccAlignment,
openzen.ZenImuProperty.AccBias,
openzen.ZenImuProperty.AccRange,
openzen.ZenImuProperty.AccSupportedRanges,
openzen.ZenImuProperty.GyrAlignment,
openzen.ZenImuProperty.GyrBias,
openzen.ZenImuProperty.GyrRange,
openzen.ZenImuProperty.GyrSupportedRanges,
openzen.ZenImuProperty.GyrUseAutoCalibration,
openzen.ZenImuProperty.GyrUseThreshold,
openzen.ZenImuProperty.MagAlignment,
openzen.ZenImuProperty.MagBias,
openzen.ZenImuProperty.MagRange,
openzen.ZenImuProperty.MagSupportedRanges,
openzen.ZenImuProperty.MagReference,
openzen.ZenImuProperty.MagHardIronOffset,
openzen.ZenImuProperty.MagSoftIronMatrix,
openzen.ZenImuProperty.OutputLowPrecision,
openzen.ZenImuProperty.OutputRawAcc,
openzen.ZenImuProperty.OutputRawGyr,
openzen.ZenImuProperty.OutputRawMag,
openzen.ZenImuProperty.OutputEuler,
openzen.ZenImuProperty.OutputQuat,
openzen.ZenImuProperty.OutputAngularVel,
openzen.ZenImuProperty.OutputLinearAcc,
openzen.ZenImuProperty.OutputHeaveMotion,
openzen.ZenImuProperty.OutputAltitude,
openzen.ZenImuProperty.OutputPressure,
openzen.ZenImuProperty.OutputTemperature,
openzen.ZenImuProperty.OutputAccCalibrated,
openzen.ZenImuProperty.OutputRawGyr0,
openzen.ZenImuProperty.OutputRawGyr1,
openzen.ZenImuProperty.OutputGyr0BiasCalib,
openzen.ZenImuProperty.OutputGyr1BiasCalib,
openzen.ZenImuProperty.OutputGyr0AlignCalib,
openzen.ZenImuProperty.OutputGyr1AlignCalib,
openzen.ZenImuProperty.OutputMagCalib,
openzen.ZenImuProperty.DegRadOutput,
openzen.ZenImuProperty.CanChannelMode,
openzen.ZenImuProperty.CanPointMode,
openzen.ZenImuProperty.CanStartId,
openzen.ZenImuProperty.CanBaudrate,
openzen.ZenImuProperty.CanMapping,
openzen.ZenImuProperty.CanHeartbeat,
openzen.ZenImuProperty.UartBaudRate,
openzen.ZenImuProperty.UartFormat,
openzen.ZenImuProperty.StartSensorSync,
openzen.ZenImuProperty.StopSensorSync,
openzen.ZenImuProperty.Max
```
ZenSensor object:
```
openzen.ZenSensorProperty.Invalid = 0,
openzen.ZenSensorProperty.DeviceName = 1000,
openzen.ZenSensorProperty.FirmwareInfo,
openzen.ZenSensorProperty.FirmwareVersion,
openzen.ZenSensorProperty.SerialNumber,
openzen.ZenSensorProperty.RestoreFactorySettings,
openzen.ZenSensorProperty.StoreSettingsInFlash,
openzen.ZenSensorProperty.BatteryCharging,
openzen.ZenSensorProperty.BatteryLevel,
openzen.ZenSensorProperty.BatteryVoltage,
openzen.ZenSensorProperty.BaudRate,
openzen.ZenSensorProperty.SupportedBaudRates,
openzen.ZenSensorProperty.DataMode,
openzen.ZenSensorProperty.TimeOffset,
openzen.ZenSensorProperty.SensorModel,
openzen.ZenSensorProperty.SensorSpecific_Start = 10000,
openzen.ZenSensorProperty.SensorSpecific_End = 19999,
openzen.ZenSensorProperty.Max
```
