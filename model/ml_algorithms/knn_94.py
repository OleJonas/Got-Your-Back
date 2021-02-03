from sklearn.neighbors import NeighborhoodComponentsAnalysis, KNeighborsClassifier
from sklearn.metrics import classification_report, confusion_matrix
from struct_data import struct_data
import pandas as pd
import numpy as np
import seaborn as sns
import sys
sys.path.insert(1, os.path.join(sys.path[0], '..'))

csv_f_name = "../../data/sensortest/data_martin_sensortest.csv"
annot_f_name = "../../data/annotation/martin_sensortest.txt"

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

knn_train = struct_data(csv_f_name, annot_f_name, POSE_MAP)

df_train = knn_train.df

knn_train.split_mult_sensor_data(3)
offsets = knn_train.fix_offsets()
# print(offsets)
# print(knn_train.df_arr[0])
# print(knn_train.df_arr[1])

df_train_id1 = knn_train.df_arr[0]
df_train_id2 = knn_train.df_arr[1]
df_train_id3 = knn_train.df_arr[2]

df_train_id2 = df_train_id2.iloc[:len(df_train_id1)]
df_train_id3 = df_train_id3.iloc[:len(df_train_id1)]

min_len = len(df_train_id1.index)
df_train_id1.index = [i for i in range(min_len)]
df_train_id2.index = [i for i in range(min_len)]
df_train_id3.index = [i for i in range(min_len)]
df_train = pd.concat([df_train_id1, df_train_id2, df_train_id3], axis=1)


#df_train_id1 = df_train[df_train['SensorId']==1]
#df_train_id2 = df_train[df_train['SensorId']==2]
#df_train_id3 = df_train[df_train['SensorId']==3]

#timestamp_offset_1 = df_train_id1[' TimeStamp (s)'].iloc[0]
#df_train_id1[' TimeStamp (s)'] = df_train_id1[' TimeStamp (s)'] - timestamp_offset_1

#timestamp_offset_2 = df_train_id2[' TimeStamp (s)'].iloc[0]
#df_train_id2[' TimeStamp (s)'] = round(df_train_id2[' TimeStamp (s)'] - timestamp_offset_2, 2)

#timestamp_offset_3 = df_train_id3[' TimeStamp (s)'].iloc[0]
#df_train_id3[' TimeStamp (s)'] = round(df_train_id3[' TimeStamp (s)'] - timestamp_offset_3, 2)

# knn_train.split_mult_sensor_data(2)
#df_train_id1 = knn_train.df_arr[0]
# df_train_id1


stamped_poses = knn_train.get_timestamp_and_pose()
print(stamped_poses)

df_train, df_stamped_poses = knn_train.align_poses(stamped_poses)

print(len(knn_train.df.index))
# print(len(df_stamped_poses))
y_train = knn_train.df["Pose"]
# df['Pose'].hist(bins=4)
sns.lineplot(data=df_train, x=" TimeStamp (s)", y='Pose')

sns.histplot(data=df_train['SensorId'])

print(y_train)
print(len(y_train))


"""
csv_file = "../../data/test_data/Simon_test_1.csv"
annot_file = "../../data/annotation/Simon_test_1.txt"
"""
csv_file = "../../data/test_data/martin_test_2sensorer.csv"
annot_file = "../../data/annotation/martin_test_2_sensor.txt"


knn_test = struct_data(csv_file, annot_file, POSE_MAP)
s_poses = knn_test.get_timestamp_and_pose()
print(s_poses)
df_test, df_stamped_poses = knn_test.align_poses(s_poses)

y_test = df_stamped_poses  # df_test["Pose"]

sns.histplot(data=df_test['SensorId'])


x_test = df_test.drop([' TimeStamp (s)'], axis=1)
#x_test = x_test.drop(['Pose'],axis=1)
x_test = x_test.drop(['Pose', ' FrameNumber', ' LinAccX (g)', ' LinAccY (g)', ' MagX (uT)', ' MagY (uT)', ' MagZ (uT)',
                      ' LinAccZ (g)', ' Pressure (kPa)', ' Altitude (m)', ' Temperature (degC)', ' HeaveMotion (m)'], axis=1)
x_test


sns.histplot(x_train['SensorId'])


"""
from sklearn import svm
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NeighborhoodComponentsAnalysis,KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsClassifier

k = 1
accuracy_array = []
k_array = []

for num in range(20):
    
    neigh = KNeighborsClassifier(n_neighbors=k)
    neigh.fit(x_train,y_train)
    predictions = neigh.predict(x_test)
    number_of_corrects = 0

    print(y_test[1200:1230])
   
    for n in range(len(predictions)):
        if(predictions[n] == y_test[n]):
            number_of_corrects += 1

    print("number of correct: {}".format(number_of_corrects))
    print("number of guesses: {}".format(len(predictions)))
    print("% correct: {}".format(number_of_corrects/len(predictions)*100))
    accuracy_array.append(number_of_corrects/len(predictions)*100)
    k_array.append(k)
    print("K: {}".format(k))
    k += 1
    print(accuracy_array)
    print(k_array)

resframe = pd.DataFrame({'k':k_array, '%':accuracy_array})
resframe
    

sns.lineplot(data=resframe,x="k",y="%")
"""


print(x_train.shape)
print(y_train.shape)
print(x_test.shape)

#x_train = x_train.drop(['SensorId'], axis=1)
#x_test = x_test.drop(['SensorId'], axis=1)
pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=1))
#neigh = KNeighborsClassifier(n_neighbors=1)
pipe.fit(x_train, y_train)
predictions = pipe.predict(x_test)


"""
for num in range(len(predictions)):
    print(predictions[num])
"""

df_predict = pd.DataFrame({'x': df_test[' TimeStamp (s)'], 'y': predictions})
sns.lineplot(data=df_predict, x='x', y='y')

print(confusion_matrix(y_test, predictions))
print(classification_report(y_test, predictions, zero_division=True))

sns.heatmap(confusion_matrix(y_test, predictions),
            cmap="YlGnBu", annot=True, fmt="d")

number_of_corrects = 0
for num in range(len(predictions)):
    if(predictions[num] == y_test[num]):
        number_of_corrects += 1

print("number of correct: {}".format(number_of_corrects))
print("number of guesses: {}".format(len(predictions)))
print("% correct: {}".format(number_of_corrects/len(predictions)*100))
