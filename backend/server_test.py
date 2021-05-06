import requests
import unittest

url = 'http://0.0.0.0:60066'


class server_test(unittest.TestCase):
    """
    This test class is dependent on having a server running. If running the no-dummy test-suite, a set of compatible bluetooth devices is also required.
    """

    ###########
    # DUMMY SUITE
    ###########

    def test_get_dummy_connect(self):
        res = _make_request(url + "/dummy/connect", {}, "get")

        sensors = res["sensors"]
        assert isinstance(sensors, list)

    def test_dummy_get_sensors(self):
        _make_request(url + "/dummy/connect", {}, "get")

        res = _make_request(url + "/dummy/get_sensors", {}, "get")["sensors"]

        assert isinstance(res, list)
        for sensor in res:
            assert "name" in sensor
            assert "id" in sensor
            assert "battery" in sensor

    ###########
    # LIVE TEST SUITE
    ###########


def _make_request(URL, PARAMS, TYPE):
    # sending get request and saving the response as response object
    r = None

    if TYPE == "get":
        r = requests.get(url=URL, params=PARAMS)
    else:
        r = requests.post(url=URL, params=PARAMS)

    # extracting data in json format
    return r.json()


def dummy_suite():
    suite = unittest.TestSuite()
    suite.addTest(server_test("test_get_dummy_connect"))
    suite.addTest(server_test("test_dummy_get_sensors"))
    return suite


def live_suite():
    pass


if __name__ == '__main__':
    runner = unittest.TextTestRunner()
    runner.run(dummy_suite())
