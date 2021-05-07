import unittest
import sys
sys.path.append("../")
import sensor_bank as sb

class sensor_bank_test(unittest.TestCase):
    """
    This test class is dependent on having compatible bluetooth devices available. Almost all tests will fail if this requirement is not met.
    """

    def setUp(self):
        self.client = sb._get_client()
        self.bank = sb.Sensor_Bank()

    def tearDown(self):
        self.bank = None

    def test_scan_for_sensors(self):
        sensors = self.bank.scan_for_sensors(self.client)
        assert isinstance(sensors, list)

        for s in sensors:
            assert isinstance(s, openzen.ZenSensorDesc)

    def test_connect_to_sensor(self):
        sensors = self.bank.scan_for_sensors(self.client)
        s_names = [s.name for s in sensors]

        for s in sensors:
            s_name, sensor, imu = self.bank.connect_to_sensor(self.client, s)
            assert s_name in s_names
            assert isinstance(sensor, openzen.ZenSensor)
            assert isinstance(imu, openzen.ZenSensorComponent)

    def test_add_sensor(self):
        sensors = ["a", "b", "c"]
        s_names = ["s1", "s2", "s3"]
        imus = ["i1", "i2", "i3"]

        assert len(self.bank.sensor_dict) == 0
        for i in range(len(sensors)):
            self.bank.add_sensor(s_names[i], sensors[i], imus[i])

            assert self.bank.sensor_dict[s_names[i]].zen_handle == i+1
            assert len(self.bank.sensor_dict) == i + 1

    def test_remove_unsync_data(self):
        self._connect_setup()
        sb._remove_unsync_data(self.client)
        zenEvent = client.poll_next_event()
        assert zenEvent == None

    def test_disconnect_sensor(self):
        self._connect_setup()

        n_sensors = len(self.bank.sensor_dict)
        s_names = [sensor.name for sensor in self.bank.sensor_dict.values()]
        for name in s_names:
            self.bank.disconnect_sensor(name)
            assert len(self.bank.sensor_dict) == n_sensors - 1
            n_sensors -= 1

    def _connect_setup(self):
        found_sensors = self.bank.scan_for_sensors(self.client)
        sensors = []
        s_names = [s.name for s in found_sensors]
        imus = []

        for sensor in found_sensors:
            s_name, s, imu = self.bank.connect_to_sensor(self.client, sensor)
            sensors.append(s)
            imus.append(imu)

        for i in range(len(sensors)):
            self.bank.add_sensor(s_names[i], sensors[i], imus[i])


def no_server_suite():
    suite = unittest.TestSuite()
    suite.addTest(sensor_bank_test("test_add_sensor"))

def with_server_suite():
    suite = unittest.TestSuite()
    suite.addTest(sensor_bank_test("test_scan_for_sensors"))
    suite.addTest(sensor_bank_test("test_connect_to_sensor"))
    suite.addTest(sensor_bank_test("test_add_sensor"))
    suite.addTest(sensor_bank_test("test_remove_unsync_data"))
    suite.addTest(sensor_bank_test("test_disconnect_sensor"))

if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    runner.run(no_server_suite())
    #runner.run(with_server_suite())
