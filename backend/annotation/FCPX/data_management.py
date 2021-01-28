import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from annotation_for_FCPX import get_timestamp_and_pose_from_FCPXML

POSE_MAP = {
    "ingen_data": -1,
    "rett": 0,
    "framover": 1,
    "bakover": 2,
    "venstre": 3,
    "hoyre": 4,
    "overgang": 5
}

csv = pd.read_csv("backend/datacollection/data.csv")
df = pd.DataFrame(csv)
df_time_offset = df["Timestamp"][0]
df["Timestamp"] = df["Timestamp"] - df_time_offset

path_to_xml = "/Users/martinnilsen/Desktop/Annotation.fcpxml"
path_to_data = "backend/datacollection/data.csv"
stamped_poses = get_timestamp_and_pose_from_FCPXML(path_to_xml, path_to_data)
print(stamped_poses)

df_stamped_poses = []
index = 0
for stamp in df["Timestamp"]:
    pose_id = -1
    if stamp <= stamped_poses[-1][1]:
        if stamp > stamped_poses[index][1]:
            index += 1
        pose_id = stamped_poses[index][2]
        # If timestamp is in new index, but haven't reached the starting time of this interval yet, set pose_id to default value 5.
        if stamp < stamped_poses[index][0]:
            pose_id = 5
    # If timestamp of the data point exceeds last timestamp recorded by the annotation, append default -1 value
    df_stamped_poses.append(pose_id)

# print(df_stamped_poses)

df["Pose"] = df_stamped_poses
print(df[240:290][:])

# df['Pose'].hist(bins=4)
sns.lineplot(data=df, x="Timestamp", y='Pose')
plt.show()
