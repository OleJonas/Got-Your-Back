import os
import csv


def _extract_markers(filepath_to_fcpxml):
    "Extracts only the markers from .fcpxml-file"
    bashCommand = f'cat {filepath_to_fcpxml} | grep marker > "{os.path.dirname(__file__)}/markers.txt"'
    os.system(bashCommand)


def _duration_to_decimal(string):
    "Duration in .fcpxml is written in fractions if not whole seconds. This method returns duration in decimalformat"
    if "/" in string:
        elements = string.split('/')
        return float(elements[0])/float(elements[1])
    return float(string)


def _duration_from_rows_and_hertz(filepath_to_data, sensor_hz):
    file = open(filepath_to_data)
    reader = csv.reader(file)
    lines = len(list(reader))+1
    duration = lines/sensor_hz
    return duration


POSE_MAP = {
    "ingen_data": -1,
    "rett": 0,
    "framover": 1,
    "bakover": 2,
    "venstre": 3,
    "hoyre": 4,
    "overgang": 5
}


def get_timestamp_and_pose_from_FCPXML(filepath_to_fcpxml, filepath_to_data, sensor_hz=100, filepath_to_markers=f"{os.path.dirname(__file__)}/markers.txt"):
    """
    This method turns an xml-file exported from Final Cut Pro X with markers for video annotation, into the same list as returned in the original get_timestamp_and_pose() method.

    Input:\n
    - filepath_to_fcpxml, 
    - filepath_to_data,
    - sensor_hz, default 100
    - filepath_to_markers, default './markers.txt'

    Output:
    A list on form [[starttime, endtime, pose], ...] for information from markers/annotation
    """
    _extract_markers(filepath_to_fcpxml)
    duration = _duration_from_rows_and_hertz(filepath_to_data, sensor_hz)
    rows = []
    with open(filepath_to_markers, "r") as f:
        lines = f.readlines()
        # This offset is the duration spent in the video before recording of data begun.
        offset = _duration_to_decimal(
            lines[0].strip().split('\"')[1].strip('s'))
        finished_row = [0]
        posture = POSE_MAP[lines[0].strip().split('\"')[5].lower()]
        for l in lines[1:]:
            sep_row = l.strip().split('\"')
            finished_row.append(
                round(_duration_to_decimal(sep_row[1].strip('s'))-offset, 2))
            finished_row.append(posture)
            rows.append(finished_row)
            finished_row = [finished_row[1]]
            posture = POSE_MAP[sep_row[5].lower()]
        finished_row.append(duration)
        finished_row.append(posture)
        rows.append(finished_row)
    return rows


if __name__ == '__main__':
    path_to_xml = "/Users/martinnilsen/Desktop/Annotation.fcpxml"
    path_to_data = "backend/datacollection/data.csv"
    print(get_timestamp_and_pose_from_FCPXML(path_to_xml, path_to_data))
