import unittest
import sys
sys.path.append("../")
import sensor_bank as sb

class sensor_bank_test(unittest.TestCase):
    """
    This test class is dependent on having compatible bluetooth devices available. Almost all tests will fail if this requirement is not met.
    """

    def setUp(self):
        self.bank = sb.Sensor_Bank()

    def tearDown(self):
        self.bank = None

    
    def test_add_sensor(self):
        





def suite():
    suite = unittest.TestSuite()
    suite.addTest()


if __name__ == "__main__":
    runner = unittest.TextTestRunner()
    runner.run(suite())