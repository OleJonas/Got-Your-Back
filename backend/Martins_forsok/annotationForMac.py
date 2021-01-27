def _divisionToSeconds(string):
    if "/" in string:
        elements = string.split('/')
        return float(elements[0])/float(elements[1])
    return float(string)


POSE_MAP = {
    "bra": 0,
    "overgang": 1,
    "darlig": 2
}


def get_timestamp_and_pose_from_XML(filename):
    """
    This method turns an xml-file exported from Final Cut Pro X with markers for video annotation, into the same list as returned in the original get_timestamp_and_pose() method.

    After annotating in FCPX, with opt+m for placing markers, you export the XML and run the command 
    `cat [path to XML] | grep marker > [filename].txt`
    This file is the one to pass into this method

    You also have to include the duration of the video, in which you can get in FCPX. The seconds is easily retrievable, but you have to calculate the number in decimal format using frames/24. 
    """
    duration = float(input("Hvor lang var videoen? "))
    # For å regne mellom frames og sekunder (FCPX bruker minutter:sekunder:frames), må du skrive ant sekunder som vanlig men frames tar du ant frames delt på 24.
    # Tenk for eksempel en video som varer 12:08, varer da i 12 sekunder og 8 frames, dvs. 12,333 ettersom 8/24 = 0,333.
    rows = []
    with open(filename, "r") as f:
        lines = f.readlines()
        # This offset is the duration spent in the video before recording of data begun.
        offset = _divisionToSeconds(lines[0].strip().split('\"')[1].strip('s'))
        finished_row = [0]
        posture = POSE_MAP[lines[0].strip().split('\"')[5].lower()]
        for l in lines[1:]:
            sep_row = l.strip().split('\"')
            finished_row.append(
                round(_divisionToSeconds(sep_row[1].strip('s'))-offset, 2))
            finished_row.append(posture)
            rows.append(finished_row)
            finished_row = [finished_row[1]]
            posture = POSE_MAP[sep_row[5].lower()]
        finished_row.append(duration)
        finished_row.append(posture)
        print(offset)
        rows.append(finished_row)
    return rows


print(get_timestamp_and_pose_from_XML("backend/Martins_forsok/file.txt"))
