from dataclasses import dataclass

@dataclass
class Sensor:
    name: str
    bluetooth_address: str

SENSORS = {
    1: Sensor("LPMSB2-3036EB", "00-04-3e-30-36-eb"),
    2: Sensor("LPMSB2-4B3326", "00-04-3e-4b-33-26"),
    3: Sensor("LPMSB2-4B31EE", "00-04-3e-4b-31-ee"),
}