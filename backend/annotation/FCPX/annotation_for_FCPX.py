import os


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


def _calculate_video_length(filepath_to_video):
    "Calculates video length from video"
    from moviepy.video.io.VideoFileClip import VideoFileClip
    clip = VideoFileClip(filepath_to_video)
    return clip.duration


POSE_MAP = {
    "bra": 0,
    "overgang": 1,
    "darlig": 2
}


def get_timestamp_and_pose_from_XML(filepath_to_fcpxml, filepath_to_video, filepath_to_markers=f"{os.path.dirname(__file__)}/markers.txt"):
    """
    This method turns an xml-file exported from Final Cut Pro X with markers for video annotation, into the same list as returned in the original get_timestamp_and_pose() method.

    Input:\n
    - filepath_to_fcpxml, 
    - filepath_to_video, 
    - filepath_to_markers, 

    Output:
    A list on form [[starttime, endtime, pose], ...] for information from markers/annotation
    """
    _extract_markers(filepath_to_fcpxml)
    duration = float(_calculate_video_length(filepath_to_video))
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


path_to_xml = "/Users/martinnilsen/Desktop/Annotation.fcpxml"
path_to_video = "/Users/martinnilsen/Desktop/martinsVideo.mov"
print(get_timestamp_and_pose_from_XML(path_to_xml, path_to_video))
