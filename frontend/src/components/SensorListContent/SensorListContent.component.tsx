import { useState, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import Button from "../Buttons/Button.component";
import SensorRowHome from "../SensorRow/SensorRowHome.component";
import SensorModal from "../SensorModal/SensorModal.component";
import sensor_placement from "../../utils/sensor_placement";
import SERVER_PORT from "../../utils/server_utils";
import useInterval from "../../utils/useInterval";

export type Sensor = {
	id: number;
	name: string;
	battery: number;
};

type ListProps = {
	recording: boolean;
	hasSensors: boolean;
	setHasSensors: (bool: boolean) => void;
	setIsRecording: (bool: boolean) => void;
	buttonPressed: boolean;
};

/**
 * @returns A listing of the currently connected sensors.
 */
export const SensorListContent: React.FC<ListProps> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState<Sensor[]>([]);
	//const [classifying, setClassifying] = useState<boolean>(false);

	const openModal = () => {
		getConnectedSensors().then(() => {
			setOpen(true);
		});
	};

	const closeModal = () => {
		setOpen(false);
	};

	/**
	 * @remarks
	 * Removes the chosen sensor from the sensors array.
	 *
	 * @param id Number denoting which sensor is to be removed
	 */
	const removeSensor = (id: number) => {
		const helper = sensors.filter((sensor: Sensor) => {
			return sensor.id !== id;
		});
		setSensors(helper);
	};

	/**
	 * useEffect that fetches status of the sensors on render.
	 */
	useEffect(() => {
		fetch("http://localhost:" + SERVER_PORT + "/status")
			.then((response) => response.json())
			.then((data) => {
				props.setIsRecording(data.isRecording);
				props.setHasSensors(data.numberOfSensors !== 0);
			});

		// eslint-disable-next-line
	}, []);

	/**
	 * custom React hook that fetches status of the sensors every 9 seconds.
	 */
	useInterval(() => {
		fetch("http://localhost:" + SERVER_PORT + "/status")
			.then((response) => response.json())
			.then((data) => {
				if (data.isRecording !== props.recording) props.setIsRecording(!props.recording);
				if ((data.numberOfSensors !== 0) !== props.hasSensors && checkCorrectSensors()) props.setHasSensors(true);
			});
	}, 9000);

	/**
	 * @remarks
	 * useEffect that checks if sensorlist has sensors.
	 */
	useEffect(() => {
		/*
        Method that checks if the correct sensors are connected, if not, the user should not be allowed to start classification.
        */
		if (sensors.length === 0 || checkCorrectSensors() === false) props.setHasSensors(false);
		//eslint-disable-next-line
	}, [sensors]);

	const checkCorrectSensors = () => {
		const id_arr = sensors.map((sensor: Sensor) => sensor.id);

		for (let i = 1; i < sensors.length + 1; i++) {
			if (!id_arr.includes(i)) {
				return false;
			}
		}
		return true;
	};

	/**
	 * @remarks
	 * Adds the given sensor to the sensors array
	 *
	 * @param sensor An object of the sensor type
	 */
	const addSensor = (sensor: Sensor) => {
		let helper = sensors;
		helper.push(sensor);
		setSensors(helper);
	};

	/**
	 * @remarks
	 * Uses an API call to fetch sensors currently connected via bluetooth. Then sets state to reflect the sensors found to be connected.
	 */
	const getConnectedSensors = async () => {
		await fetch("http://localhost:" + SERVER_PORT + "/setup/get_sensors", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setSensors(data["sensors"]);
			});
	};

	useEffect(() => {
		getConnectedSensors();
		// eslint-disable-next-line
	}, []);

	/**
	 * @remarks
	 * Returns an array containing one SensorRowHome component for each sensor in this components sensors array.
	 */
	const mapSensors = sensors.map((sensor: Sensor) => {
		return (
			<SensorRowHome
				key={sensor.id}
				connected={true}
				id={sensor.id}
				busy={props.recording || props.buttonPressed}
				disconnectFunc={removeSensor}
				name={sensor.name}
				position={sensor_placement[sensor.id.toString()]}
				battery={sensor.battery}
			/>
		);
	});

	/**
	 * @remarks
	 * A helper method for use in the SensorModal component. It is used to tell the component which sensors are already connected and should not show up in the list of available sensors.
	 * @returns
	 * An array of strings containing the names of the currently connected sensors.
	 */
	const getSensorsConnectedNames = () => {
		let out: string[] = [];
		sensors.forEach((sensor: Sensor) => out.push(sensor.name));
		return out;
	};

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12}>
				<Grid container className={classes.header}>
					<Grid item xs={2}></Grid>
					<Grid item xs={3}>
						<Typography variant="h5" color="textPrimary">
							Sensor name
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography variant="h5" color="textPrimary">
							Placement
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography variant="h5" color="textPrimary">
							Id
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography variant="h5" color="textPrimary">
							Battery
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="h5" color="textPrimary"></Typography>
					</Grid>
					<Grid item xs={12}>
						<hr className={classes.hr} />
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.container}>
				{mapSensors}
			</Grid>
			<Grid item xs={12}>
				<Grid container className={classes.button}>
					<Button func={openModal} disabled={props.recording || props.buttonPressed}>
						Scan
					</Button>
					{open ? (
						<SensorModal
							sendSensors={addSensor}
							alreadyConnected={getSensorsConnectedNames()}
							close={closeModal}
							open={open}
						></SensorModal>
					) : (
						<></>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};
export default SensorListContent;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	header: {
		height: "15%",
		marginTop: "15px",
	},
	hr: {
		width: "90%",
	},
	container: {
		height: "55%",
		overflow: "auto",
	},
	button: {
		height: "25%",
		justifyContent: "center",
		alignItems: "center",
	},
});
