import numpy
import pandas as pd


class struct_data:

    def __init__(self, data_f_name, annot_f_name, pose_map):
        self.data_f_name = data_f_name
        self.annot_f_name = annot_f_name
        self.pose_map = pose_map

        csv = pd.read_csv(self.data_f_name)
        self.df_arr = [pd.DataFrame(csv)]


    def fix_offsets(self, n_sensors):
        offsets = []
        for sensor in n_sensors:
            df_time_offset = self.df[self.df[" TimeStamp (s)"] == sensor][0]
            offsets.append(df_time_offset)
            self.df[" TimeStamp (s)"] = self.df[self.df[" TimeStamp (s)"] == sensor] - df_time_offset
        return offsets


    def split_mult_sensor_data(self, n_sensors):
        pass


    def get_timestamp_and_pose(self):
        rows = []
        with open(self.annot_f_name, "r") as f:
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


    def align_poses(self, stamped_poses):
        df_stamped_poses = []
        pose_index = 0
        row_index = 0
        drops = 0
        for stamp in self.df[" TimeStamp (s)"]:
            pose_id = -1
            if stamp <= stamped_poses[-1][1] and stamp >= stamped_poses[0][0]:
                if stamp > stamped_poses[pose_index][1]:
                    pose_index += 1
                pose_id = stamped_poses[pose_index][2]
                if stamp >= stamped_poses[pose_index][0]:
                    df_stamped_poses.append(pose_id)
                else:
                    self.df = self.df.drop(row_index)
            else:
                self.df = self.df.drop(row_index)
            row_index += 1

        print(len(self.df.index))
        print("drops: {}".format(drops))
        print(len(df_stamped_poses))
        self.df["Pose"] = df_stamped_poses

        return self.df, df_stamped_poses


if __name__ == "__main__":

    csv_f_name = "data/train_data/data_martin_1_forsok2.csv"
    annot_f_name = "data/annotation/martin_train_1.txt"

    POSE_MAP = {
        "rett": 0,
        "fram": 1,
        "fram-hoyre": 2,
        "hoyre": 3,
        "bak-hoyre": 4,
        "bak": 5,
        "bak-venstre": 6,
        "venstre": 7,
        "fram-venstre": 8
    }

    noe = struct_data(csv_f_name, annot_f_name, POSE_MAP)
