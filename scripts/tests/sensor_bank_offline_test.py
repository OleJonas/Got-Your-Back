import unittest
import sys
sys.path.append("../")
import sensor_bank as sb

class sensor_bank_offline_test(unittest.TestCase):

    """
    This test class is dependent on having compatible bluetooth devices available. Almost all tests will fail if this requirement is not met.
    """

    def setUp(self):
        self.client = sb._get_client()
        self.bank = sb.Sensor_Bank()

    def tearDown(self):
        self.bank = None

    def test_add_sensor(self):
            sensors = ["a", "b", "c"]
            s_names = ["s1", "s2", "s3"]
            imus = ["i1", "i2", "i3"]

            assert len(self.bank.sensor_dict) == 0
            for i in range(len(sensors)):
                self.bank.add_sensor(s_names[i], sensors[i], imus[i])

                assert self.bank.sensor_dict[s_names[i]].zen_handle == i+1
                assert len(self.bank.sensor_dict) == i + 1

    def no_server_suite():
        suite = unittest.TestSuite()
        suite.addTest(sensor_bank_test("test_add_sensor"))

if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    runner.run(no_server_suite())