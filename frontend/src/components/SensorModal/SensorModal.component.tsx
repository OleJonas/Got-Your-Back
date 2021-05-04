/**
 * @module SensorModal
 * @category Components
 */
import { useState, useEffect, useCallback } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Sensor } from "../SensorListContent/SensorListContent.component";
import Button from "../Buttons/Button.component";
import SensorRowModal from "../SensorRow/SensorRowModal.component";
import loader from "../../assets/loader.svg";
import SERVER_PORT from "../../utils/serverUtils";

export type modalProps = {
	open: boolean;
	alreadyConnected: string[]; // Array of sensor names that are already connected
	close: () => void;
	sendSensors: (sensor: any) => void;
};

/**
 *
 * A GUI interface modal for connecting to sensors.
 *
 * @param {modalProps} props {@link modalProps}
 */
export const SensorModal: React.FC<modalProps> = (props) => {
	const classes = useStyles();
	const [sensorsFound, setSensorsFound] = useState<any>();
	const [isFetching, setIsFetching] = useState(false);
	const [open, setOpen] = useState(false);

	/**
	 * Uses an API call to fetch sensors available to connect to via bluetooth. When found, the state is updated.
	 */
	const scanForSensors = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		await fetch("http://localhost:" + SERVER_PORT + "/setup/scan", {
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
		//eslint-disable-next-line
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
	};

	/**
	 * @param data JSON data about the sensor returned from the connect API call.
	 * @param isConnected Boolean telling if the sensor is connected or not.
	 * Function that sends sensor data up to the SensorListContent component
	 */
	const addConnected = (data: any, isConnected: boolean) => {
		if (isConnected) {
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
	 * @returns An array of Sensor type objects that are found via searching, but not yet connected.
	 */
	const getSensorsNotConnected: (foundSensors: Sensor[]) => Sensor[] = (foundSensors): Sensor[] => {
		if (props.alreadyConnected.length > 0) {
			return foundSensors.filter((sensor: Sensor) => !props.alreadyConnected.includes(sensor.name));
		} else {
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
					<Typography variant="h2">
						{isFetching ? "Searching for sensors..." : sensorsFound && sensorsFound.length === 0 ? "No sensors found" : "Sensors found"}
					</Typography>
				</DialogTitle>
				<DialogContent className={classes.dialogContent} dividers>
					<Box className={classes.sensorBox}>
						{isFetching ? (
							<Box>
								<img src={loader} className={classes.loading} alt="Rotating loading icon"></img>
							</Box>
						) : (
							<Box>
								<Grid container className={classes.columns} justify="flex-start">
									<Grid item xs={5}>
										<Grid container className={classes.grid} justify="flex-start">
											<Typography variant="h6">Sensor name</Typography>
										</Grid>
									</Grid>
									<Grid item xs={3}>
										<Grid container className={classes.grid} justify="flex-start">
											<Typography variant="h6">Status</Typography>
										</Grid>
									</Grid>
									<Grid item xs={2}></Grid>
								</Grid>
								{sensorsFound ? (
									sensorsFound.map((sensor: Sensor) => <SensorRowModal key={sensor.name} clickConnect={addConnected} name={sensor.name} />)
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
		height: "calc(320px + 150px)",
		width: "70%",
	},
	sensorBox: {
		height: "calc(100% - 100px)",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
		overflow: "auto",
	},
	btnGrid: {
		marginTop: "35px",
		marginBottom: "10px",
	},
	"@keyframes rotate": {
		from: {
			transform: "rotate(0)",
		},
		to: {
			transform: "rotate(360deg)",
		},
	},
	loading: {
		animation: "1s linear infinite $rotate",
	},
});
