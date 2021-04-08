import { useState, useEffect } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import { ContentBox } from "../../components/ContentBox/ContentBox.component";
import { ClassificationContent } from "../../components/ClassificationContent/ClassificationContent.component";
import { RecordContent } from "../../components/RecordContent/RecordContent.component";
import { LineChart } from "../../components/LineChart/LineChart.component.jsx";
import { PieChart } from "../../components/PieChart/PieChart.component.jsx";
import { SensorListContent } from "../../components/SensorListContent/SensorListContent.component";
import handleErrors from "../../utils/handleErrors";
import useInterval from "../../utils/useInterval";

/**
 * @remarks
 * This is the main page of the application. It contains live classification data as well as different components also relating to live classification and recording of data.
 */
export const HomeView = () => {
	const classes = useStyles();
	const [datapoints, setDatapoints] = useState<any>({});
	const lastPosture: number =
		datapoints && Object.values(datapoints).length !== 0 ? (Object.values(datapoints)[Object.values(datapoints).length - 1] as number) : -1;
	const samplingRate: number = 5;
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [hasSensors, setHasSensors] = useState<boolean>(false);

	/**
	 * @remarks
	 * useEffect that fetches classifications on render.
	 */
	useEffect(() => {
		fetch("http://localhost:5000/classifications", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then(handleErrors)
			.then((response) => response.json())
			.then((data) => {
				setDatapoints(data);
			})
			.catch(function (error) {});
	}, []);

	/**
	 * @remarks
	 * custom React hook that fetches classifications every 3 seconds when recording is active.
	 */
	useInterval(() => {
		if (isRecording) {
			fetch("http://localhost:5000/classifications/latest", {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then(handleErrors)
				.then((response) => response.json())
				.then((data: JSON) => {
					let key: string = Object.keys(data)[0];
					let val: number = Object.values(data)[0];
					datapoints[key] = val;
					setDatapoints({ ...datapoints });
				})
				.catch(function (error) {});
		}
		console.log(isRecording);
	}, 3000);

	/**
	 * @remarks
	 * useEffect that fetches status of the sensors on render and every ninth second.
	 */
	useEffect(() => {
		fetch("http://localhost:5000/status")
			.then((response) => response.json())
			.then((data) => {
				setIsRecording(data.isRecording);
				setHasSensors(data.numberOfSensors !== 0);
			});

		const interval = setInterval(() => {
			fetch("http://localhost:5000/status")
				.then((response) => response.json())
				.then((data) => {
					if (data.isRecording !== isRecording) setIsRecording(data.isRecording);
					if ((data.numberOfSensors !== 0) !== hasSensors) setHasSensors(data.numberOfSensors !== 0);
				});
		}, 9000);
		return () => clearInterval(interval);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1} lg={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} lg={11} className={classes.height}>
					<Grid container spacing={2} className={classes.container}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								Welcome Back!
							</Typography>
						</Grid>

						<Grid item xs={12} md={6} className={classes.infoContainer}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Connected sensors
								</Typography>
							</Box>
							<ContentBox>
								<SensorListContent />
							</ContentBox>
						</Grid>

						<Grid item xs={6} md={3} className={classes.infoContainer}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Record
								</Typography>
							</Box>
							<ContentBox>
								<RecordContent
									posture={lastPosture}
									samplingRate={samplingRate}
									isRecording={isRecording}
									hasSensors={hasSensors}
								></RecordContent>
							</ContentBox>
						</Grid>

						<Grid item xs={6} md={3} className={classes.infoContainer}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Classification
								</Typography>
							</Box>
							<ContentBox>
								<ClassificationContent posture={lastPosture} samplingRate={samplingRate} recording={isRecording}></ClassificationContent>
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={7} className={classes.graphContainer}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Last hour
								</Typography>
							</Box>
							<ContentBox>
								<LineChart data={datapoints} />
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={5} className={classes.graphContainer}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Distribution
								</Typography>
							</Box>
							<ContentBox>
								<PieChart data={datapoints} />
							</ContentBox>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};
export default HomeView;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	container: {
		height: "100%",
		padding: "20px",
		overflow: "auto",
	},
	infoContainer: {
		minHeight: "300px",
	},
	graphContainer: {
		minHeight: "300px",
		height: "40vh",
	},
	height: {
		height: "100%",
	},
});
