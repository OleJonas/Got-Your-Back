import numpy
import pandas as pd


class struct_data:

    def __init__(self, data_f_name, annot_f_name, pose_map):
        self.data_f_name = data_f_name
        self.annot_f_name = annot_f_name
        self.pose_map = pose_map

        csv = pd.read_csv(self.data_f_name)

        self.df = pd.DataFrame(csv)
        self.df_arr = []


    def split_mult_sensor_data(self, n_sensors):
        for id in range(n_sensors):
            sensor_df = self.df[self.df["SensorId"] == (id+1)]
            self.df_arr.append(sensor_df)


    def fix_offsets(self):
        offsets = []
        for i in range(len(self.df_arr)):
            df_time_offset = self.df_arr[i][" TimeStamp (s)"].iloc[0]
            offsets.append(df_time_offset)
            self.df_arr[i][" TimeStamp (s)"] = self.df_arr[i][" TimeStamp (s)"] - df_time_offset
        return offsets


    def concat_sensor_data(self, n_sensors):
        # Fits and drops the columns 'SensorId',' TimeStamp (s)',' FrameNumber',' LinAccX (g)',' LinAccY (g)',
        # ' LinAccZ (g)',' Pressure (kPa)',' Altitude (m)',' Temperature (degC)',' HeaveMotion (m)'
        # from all data from the sensors. Timestamps will be kept for the first sensor, while the rest is dropped.
        # Then concatenates data into a common dataframe.   

        print("Splitting into ", n_sensors, " separate dataframes...")
        self.split_mult_sensor_data(n_sensors)

        print("Dropping unused columns...")
        self.df_arr[0] = self.df_arr[0].drop(['SensorId',' FrameNumber',' LinAccX (g)',' LinAccY (g)',' LinAccZ (g)',' Pressure (kPa)',' Altitude (m)',' Temperature (degC)',' HeaveMotion (m)'],axis=1)
        for i in range(1,len(self.df_arr)):
            print(self.df_arr[i])
            self.df_arr[i] = self.df_arr[i].drop(['SensorId',' TimeStamp (s)',' FrameNumber',' LinAccX (g)',' LinAccY (g)',' LinAccZ (g)',' Pressure (kPa)',' Altitude (m)',' Temperature (degC)',' HeaveMotion (m)'],axis=0)

        print("Fixing time offsets")
        offsets = self.fix_offsets()
        print("Offsets: ", offsets)

        df_lengths = [len(frame.index) for frame in self.df_arr]
        min_len = min(df_lengths)
        print("Min length of sensor data: ", min_len)

        # Cutting excess data and fixing indexing after being cut
        for i in range(len(self.df_arr)):
            self.df_arr[i] = self.df_arr[i].iloc[:min_len]
            self.df_arr[i].index = [i for i in range(min_len)]
            print(len(self.df_arr[i]))

        #Finally concatenating all the dataframes into one
        self.df = pd.concat([self.df_arr[0], self.df_arr[1], self.df_arr[2]], axis=1)

        return min_len


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
                    drops += 1
            else:
                self.df = self.df.drop(row_index)
                drops += 1
            row_index += 1

        print(len(self.df.index))
        print("drops: {}".format(drops))
        print(len(df_stamped_poses))
        self.df["Pose"] = df_stamped_poses

        return self.df, df_stamped_poses

    def align_poses_2(self, df, stamped_poses):
        df_stamped_poses = []
        pose_index = 0
        row_index = 0
        drops = 0
        for stamp in df[" TimeStamp (s)"]:
            pose_id = -1
            if stamp <= stamped_poses[-1][1] and stamp >= stamped_poses[0][0]:
                if stamp > stamped_poses[pose_index][1]:
                    pose_index += 1
                pose_id = stamped_poses[pose_index][2]
                if stamp >= stamped_poses[pose_index][0]:
                    df_stamped_poses.append(pose_id)
                else:
                    df = df.drop(row_index)
                    drops += 1
            else:
                df = df.drop(row_index)
                drops += 1
            row_index += 1

        print(len(df.index))
        print("drops: {}".format(drops))
        print(len(df_stamped_poses))
        df["Pose"] = df_stamped_poses

        return df, df_stamped_poses


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
