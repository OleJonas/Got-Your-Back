import { FC, useState, useEffect, useCallback } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Sensor } from "../SensorListContent/SensorListContent.component";

// Components
import { Button } from "../Buttons/Button.component";
import { SensorRowModal } from "../SensorRow/SensorRowModal.component";
import loader from "../../assets/loader.svg";
import "./loader.css";

type modalProps = {
	open: boolean;
	alreadyConnected: string[]; // Array of sensor names that are already connected
	close: () => void;
	sendSensors: (sensor: any) => void;
};

export const SensorModal: FC<modalProps> = (props) => {
	const classes = useStyles();
	const [sensorsFound, setSensorsFound] = useState<any>();
	const [isFetching, setIsFetching] = useState(false);
	const [open, setOpen] = useState(false);

	/**
	 * @remarks
	 * Uses an API call to fetch sensors available to connect to via bluetooth. When found, the state is updated.
	 */
	const scanForSensors = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		await fetch("http://localhost:5000/setup/scan", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {

				setSensorsFound(getSensorsNotConnected(data["sensors"]));
				setIsFetching(false);
				setOpen(true);
			});
	}, [isFetching]);

	useEffect(() => {
		if (props.open === true) {
			setOpen(props.open);
			scanForSensors();
		}
		// eslint-disable-next-line
	}, [props.open]);

	const handleClose = () => {
		props.close();
		setOpen(false);

		// DUMMY DATA
		/*
		let inboundSensors = [];
		for (let i = 0; i < 3; i++) {
			let s = {
				index: i,
				connected: true,
				name: "SENSOR" + i,
			};
			inboundSensors.push(s);
		}
		props.sendSensors(inboundSensors);
		props.close();
		setOpen(false);
		*/
	};

	/**
	 * @remarks
	 * Function that sends sensor data up to the SensorListContent component
	 *
	 * @param data JSON data about the sensor returned from the connect API call.
	 * @param isConnected Boolean telling if the sensor is connected or not.
	 */
	const addConnected = (data: any, isConnected: boolean) => {
		console.log("addConnected");
		console.log(isConnected);
		if (isConnected) {
			console.log("isConnected = true");
			let s = {
				id: data.id,
				connected: true,
				name: data.name,
				battery: data.battery_percent.split("%")[0],
			};
			props.sendSensors(s);
		}
	};

	/**
	 *
	 * @returns An array of Sensor type objects that are found via searching, but not yet connected.
	 */


	const getSensorsNotConnected: (foundSensors: Sensor[]) => Sensor[] = (foundSensors): Sensor[] => {
		console.log(props.alreadyConnected);
		if (props.alreadyConnected.length > 0) {
			console.log("alreadyConnected.len: " + props.alreadyConnected.length);
			return foundSensors.filter((sensor: Sensor) => !props.alreadyConnected.includes(sensor.name));
		} else {
			console.log("alreadyConnected was empty");
			return foundSensors;
		}
	};

	return (
		<Box>
			<Dialog
				classes={{ paper: classes.paper }}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				className={classes.root}
			>
				<DialogTitle className={classes.title} id="customized-dialog-title">
					<Typography variant="h2">{isFetching ? "Searching for sensors..." : "Sensors found"}</Typography>
				</DialogTitle>
				<DialogContent className={classes.dialogContent} dividers>
					<Box className={classes.sensorBox}>
						{isFetching ? (
							<Box>
								<img src={loader} className="loading" alt="Rotating loading icon"></img>
							</Box>
						) : (
							<Box>
								<Grid className={classes.columns} container xs={12}>
									<Grid container className={classes.grid} justify="flex-start" item xs={5}>
										<Typography variant="h6">Sensor name</Typography>
									</Grid>
									<Grid container className={classes.grid} justify="flex-start" item xs={3}>
										<Typography variant="h6">Status</Typography>
									</Grid>
									<Grid container className={classes.grid} justify="center" item xs={2}></Grid>
								</Grid>

								{sensorsFound ? (
									sensorsFound.map((sensor: Sensor) => (
										<SensorRowModal clickConnect={addConnected} name={sensor.name} />
									))
								) : (
									<></>
								)}
							</Box>
						)}
					</Box>
					<Grid container justify="center" className={classes.btnGrid}>
						<Grid item xs={6}>
							<Button disabled={isFetching} func={scanForSensors}>
								Refresh
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button func={handleClose}>Close</Button>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</Box>
	);
};
export default SensorModal;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		textAlign: "center",
		borderRadius: "0",
	},
	dialogContent: {
		height: "1000px",
	},
	grid: {
		justify: "center",
		alignItems: "center",
		paddingLeft: "30px",
	},
	columns: {
		maxWidth: "100%",
		justifyContent: "space-between",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "50px",
		backgroundColor: "white",
		borderBottom: "1px solid black",
	},
	title: {
		marginTop: "20px",
	},
	paper: {
		height: "80%",
		width: "70%",
	},
	sensorBox: {
		height: "60%",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
		overflow: "auto",
	},
	btnGrid: {
		marginTop: "15%",
	},
});
