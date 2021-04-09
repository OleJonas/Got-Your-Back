import { useState, useEffect, FC } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

// Componentes
import { Button } from "../Buttons/Button.component";
import { SensorRowHome } from "../SensorRow/SensorRowHome.component";
import { SensorModal } from "../SensorModal/SensorModal.component";
import { sensor_placement } from "../../utils/sensor_placement";

export type Sensor = {
	id: number;
	name: string;
	battery: number;
};

type ListProps = {
	recording: boolean;
};

/**
 * @returns A listing of the currently connected sensors.
 */
export const SensorListContent: FC<ListProps> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState<Sensor[]>([]);
	//const [classifying, setClassifying] = useState<boolean>(false);

	const openModal = () => {
		getConnectedSensors().then(() => {
			console.log(sensors);
			setOpen(true);
		})
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
		console.log("Removing sensor...  " + id);
		const helper = sensors.filter((sensor: Sensor) => {
			return sensor.id !== id;
		});
		setSensors(helper);
	};

	/**
	 * @remarks
	 * Adds the given sensor to the sensors array
	 * 
	 * @param sensor An object of the sensor type
	 */
	const addSensors = (sensor: Sensor) => {
		let helper = sensors;
		helper.push(sensor);
		setSensors(helper);
	};

	/**
	 * @remarks
	 * Uses an API call to fetch sensors currently connected via bluetooth. Then sets state to reflect the sensors found to be connected.
	 */
	const getConnectedSensors = async () => {

		await fetch("http://localhost:5000/setup/get_sensors", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
		.then((res) => res.json())
		.then(data => {
			setSensors(data["sensors"]);
		}).then(() => console.log(sensors))
	}


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
			<SensorRowHome connected={true} id={sensor.id} busy={props.recording} disconnectFunc={removeSensor} name={sensor.name} position={sensor_placement[sensor.id.toString()]} battery={sensor.battery} />
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
		sensors.forEach((sensor: Sensor) => out.push(sensor.name))
		return out;
	}

	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.header} xs={12}>
				<Grid item xs={2}></Grid>
				<Grid item justify="flex-start" xs={3}>
					<Typography variant="h5" color="textPrimary">
						Sensor name
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={3}>
					<Typography variant="h5" color="textPrimary">
						Placement
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={1}>
					<Typography variant="h5" color="textPrimary">
						Id
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={1}>
					<Typography variant="h5" color="textPrimary">
						Battery
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={2}>
					<Typography variant="h5" color="textPrimary"></Typography>
				</Grid>
				<Grid xs={12}>
					<hr className={classes.hr} />
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.container}>
				{mapSensors}
			</Grid>
			<Grid xs={12} item container className={classes.button}>
				<Button func={openModal} disabled={props.recording}>Scan</Button>
				{open? <SensorModal sendSensors={addSensors} alreadyConnected={getSensorsConnectedNames()} close={closeModal} open={open}></SensorModal> : <></>
				}
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
