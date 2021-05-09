import pandas as pd


class df_wrapper:
    """
    Wrapper class to ease use of dataframes in conjunction with keras and sklearn
    """

    def __init__(self, csv_f_name):
        self.csv_f_name = csv_f_name
        csv = pd.read_csv(self.csv_f_name)
        self.df = pd.DataFrame(csv)
        self.df_arr = []

    def split_mult_sensor_data(self, n_sensors):
        """
        Split sensordata into multiple dataframes

        Input\n:
        n_sensors - amount of sensors the dataframe consist of
        """
        for id in range(n_sensors):
            sensor_df = self.df[self.df["SensorId"] == (id + 1)]
            self.df_arr.append(sensor_df)

    def fix_offsets(self):
        """
        Each data-point has a timestamp associated with it that has to be corrected according to the starting time-value of the first data-point.
        The starting value is assigned randomly and is retrieved from the sensors, making this necessary. The offset is fixed so that the first
        time-value in the df_arr is 0.
        """

        offsets = []
        for i in range(len(self.df_arr)):
            df_time_offset = self.df_arr[i][" TimeStamp (s)"].iloc[0]
            offsets.append(df_time_offset)
            self.df_arr[i][" TimeStamp (s)"] = self.df_arr[i][" TimeStamp (s)"] - \
                df_time_offset
        return offsets

    def concat_sensor_data(self, n_sensors):
        """
        Concat rows from all sensors based on timestamp, and drops unused columns.
        Timestamp will only be kept from the first sensor.

        Input:\n
        n_sensors - amount of sensors the dataframe consist of
        """

        if "SensorId" not in self.df.columns:
            self.df['SensorId'] = [1 for i in range(len(self.df.index))]
            self.df = self.df.rename(columns={"Timestamp": " TimeStamp (s)"})

        # print("Splitting into ", n_sensors, " separate dataframes...")
        self.split_mult_sensor_data(n_sensors)

        drop_arr = []
        if " FrameNumber" not in self.df.columns:
            drop_arr = ['SensorId']
        else:
            drop_arr = ['SensorId', ' FrameNumber', ' MagX (uT)', ' MagY (uT)', ' MagZ (uT)', ' EulerX (deg)', ' EulerY (deg)',
                        ' EulerZ (deg)', ' Pressure (kPa)', ' Altitude (m)', ' Temperature (degC)', ' HeaveMotion (m)']

        self.df_arr[0] = self.df_arr[0].drop(drop_arr, axis=1)
        drop_arr.append(' TimeStamp (s)')

        for i in range(1, len(self.df_arr)):
            self.df_arr[i] = self.df_arr[i].drop(drop_arr, axis=1)

        df_lengths = [len(frame.index) for frame in self.df_arr]
        min_len = min(df_lengths)
        # print("Min length of sensor data: ", min_len)

        # Cutting excess data and fixing indexing after being cut
        for i in range(len(self.df_arr)):
            self.df_arr[i] = self.df_arr[i].iloc[:min_len]
            self.df_arr[i].index = [i for i in range(min_len)]

        # Finally concatenating all the dataframes into one
        self.df = pd.concat([frame for frame in self.df_arr], axis=1)

    def align_poses(self, annot_f_name, pose_map):
        """
        Method for aligning annotated data to the correct rows, and thereby giving the correct row the correct pose.
        The method drops the rows that are not inside the specified time intervals retrieved from _get_timestamp_and_pose()
        The df_wrappers object variable df is adjusted after these changes

        Input: \n
        annot_f_name - name of the annotation file
        pose_map - a dict containing the poses you want to use

        Output: \n
        Returns an array of poses
        """
        stamped_poses = _get_timestamp_and_pose(annot_f_name, pose_map)
        poses = []
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
                    poses.append(pose_id)
                else:
                    self.df = self.df.drop(row_index)
                    drops += 1
            else:
                self.df = self.df.drop(row_index)
                drops += 1
            row_index += 1

        self.df["Pose"] = poses

        return poses


def _get_timestamp_and_pose(annot_f_name, pose_map):
    """
    Retrieves poses in given time intervals from an annotation file

    Input: \n
    annot_f_name - name of the annotation file
    pose_map - a dict containing the poses you want to use

    Output: \n
    An array of poses together with their respective timestamps
    """

    rows = []
    with open(annot_f_name, "r") as f:
        lines = f.readlines()
        # This offset is the duration spent in the video before recording of data begun.
        offset = float(lines[1].strip().split(";")[1])
        for l in lines[1:]:
            sep_row = l.strip().split(";")
            finished_row = [round(float(x) - offset, 2)
                            for x in sep_row[1:3]]
            finished_row.append(pose_map[sep_row[3].lower()])
            rows.append(finished_row)
    return rows


if __name__ == "__main__":
    pass
