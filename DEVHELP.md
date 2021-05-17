#### For cloning repo:

As we depend on another repo for the OpenZen-library, you have to clone the project with the submodules included.
The following line will fix this for you:

`git clone --recurse-submodules https://github.com/OleJonas/Got-Your-Back.git 'GotYourBack'`

### Sensor properties fetchable

From the sensors we can fetch different properties using one of the following methods:

- get_float_property()
- get_byte_property()
- get_int32_property()
- get_uint64_property()
- get_array_property()
- execute_command()

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

## Creating Python docs

With Sphinx fully installed and python lib accessible from terminal:
```
cd docs
sphinx-build -b html ./source ./build_backend/html
```
and make html from rst only with `make html`


## Create trees

### Backend
```
tree -L 3 -I 'frontend|lib|docs|*.md|*.csv|2021*' "Got Your Back"
```
### Frontend
```
tree -L 4 -I 'node_modules' "Got Your Back/frontend"
```
