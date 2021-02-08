
def get_timestamp_and_pose(annot_f_name):
        rows = []
        with open(annot_f_name, "r") as f:
            lines = f.readlines()
            # This offset is the duration spent in the video before recording of data begun.
            offset = float(lines[1].strip().split(";")[1])
            for l in lines[1:]:
                sep_row = l.strip().split(";")
                finished_row = [round(float(x)-offset, 2)
                                for x in sep_row[1:3]]
                finished_row.append(self.pose_map[sep_row[3].lower()])
                rows.append(finished_row)
        return rows