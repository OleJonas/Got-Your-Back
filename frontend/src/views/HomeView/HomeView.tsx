/**
 * @module HomeView
 * @category Views
 */
import { useState, useEffect, useMemo } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar.component";
import ContentBox from "../../components/ContentBox/ContentBox.component";
import ClassificationContent from "../../components/ClassificationContent/ClassificationContent.component";
import RecordContent from "../../components/RecordContent/RecordContent.component";
import LineChart from "../../components/LineChart/LineChart.component.jsx";
import PieChart from "../../components/PieChart/PieChart.component.jsx";
import SensorListContent from "../../components/SensorListContent/SensorListContent.component";
import handleErrors from "../../utils/handleErrors";
import useInterval from "../../utils/useInterval";
import SERVER_PORT from "../../utils/serverUtils";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.component";

/**
 * This is the main page of the application. It contains live classification data as well as different components also relating to live classification and recording of data.
 */
export const HomeView = () => {
	const classes = useStyles();
	const [datapoints, setDatapoints] = useState<any>({});
	const lastPosture: number =
		datapoints && Object.values(datapoints).length !== 0 ? (Object.values(datapoints)[Object.values(datapoints).length - 1] as number) : -1;
	const samplingRate: number = 5;
	const [buttonPressed, setButtonPressed] = useState<boolean>(false);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [hasSensors, setHasSensors] = useState<boolean>(false);

	/**
	 * useEffect that fetches classifications on render.
	 */
	useEffect(() => {
		fetch("http://localhost:" + SERVER_PORT + "/classifications", {
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
	 * custom React hook that fetches classifications every 5 seconds when recording is active.
	 */
	useInterval(() => {
		if (isRecording) {
			fetch("http://localhost:" + SERVER_PORT + "/classifications/latest", {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then(handleErrors)
				.then((response) => response.json())
				.then((data: JSON) => {
					let key: string = Object.keys(data)[0];
					let val: number = parseInt(Object.values(data)[0]);
					datapoints[key] = val;
					setDatapoints({ ...datapoints });
				})
				.catch(function (error) {});
		}
	}, 5000);

	/**
	 * useMemo that sets buttonPressed to false every time recording is stopped.
	 */
	useMemo(
		() => setButtonPressed(false),
		//eslint-disable-next-line
		[isRecording]
	);

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
							<Box mb={0.6} display="flex" alignItems="center">
								<Typography variant="h3" color="textPrimary">
									Connected sensors
								</Typography>
								<InfoTooltip
									text={
										'Shows the sensors connected to your machine using bluetooth. Scan for sensors by pressing the "Scan"-button below.'
									}
								/>
							</Box>
							<ContentBox>
								<SensorListContent
									hasSensors={hasSensors}
									setHasSensors={setHasSensors}
									setIsRecording={setIsRecording}
									buttonPressed={buttonPressed}
									recording={isRecording}
								/>
							</ContentBox>
						</Grid>

						<Grid item xs={6} md={3} className={classes.infoContainer}>
							<Box mb={0.6} display="flex" alignItems="center">
								<Typography variant="h3" color="textPrimary">
									Record
								</Typography>
								<InfoTooltip text={"Start/stop recording by pressing the button below. Disabled if sensors are missing."} />
							</Box>
							<ContentBox>
								<RecordContent
									posture={lastPosture}
									hasSensors={hasSensors}
									isRecording={isRecording}
									setIsRecording={(bool: boolean) => setIsRecording(bool)}
									buttonPressed={buttonPressed}
									setButtonPressed={(bool: boolean) => setButtonPressed(bool)}
								></RecordContent>
							</ContentBox>
						</Grid>

						<Grid item xs={6} md={3} className={classes.infoContainer}>
							<Box mb={0.6} display="flex" alignItems="center">
								<Typography variant="h3" color="textPrimary">
									Classification
								</Typography>
								<InfoTooltip text={"Shows the current classification. See the help section for further information."} />
							</Box>
							<ContentBox>
								<ClassificationContent posture={lastPosture} samplingRate={samplingRate} recording={isRecording}></ClassificationContent>
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={7} className={classes.graphContainer}>
							<Box mb={0.6} display="flex" alignItems="center">
								<Typography variant="h3" color="textPrimary">
									Last hour
								</Typography>
								<InfoTooltip text={"Shows classifications for the last hour. Hover over points for classification at given time."} />
							</Box>
							<ContentBox>
								<LineChart duration={0} data={datapoints} />
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={5} className={classes.graphContainer}>
							<Box mb={0.6} display="flex" alignItems="center">
								<Typography variant="h3" color="textPrimary">
									Distribution
								</Typography>
								<InfoTooltip text={"Shows the total distribution for today. Empty pane if you have yet to record data today."} />
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
