import { useState } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

// Componentes
import { Button } from "../Buttons/Button.component";
import { SensorRowHome } from "../SensorRow/SensorRowHome.component";
import { SensorModal } from "../SensorModal/SensorModal.component";

type Sensor = {
	index: number;
	name: string;
	id: number;
	battery: number;
};

export const SensorListContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState([
		{ name: "LPMSB2 - 3036EB", id: 1, battery: 85.2 },
		{ name: "LPMSB2 - 4B3326", id: 2, battery: 76.6 },
		{ name: "LPMSB2 - 4B31EE", id: 3, battery: 54.26 },
	]);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	const removeSensor = (id: number) => {
		console.log("Removing sensor...  " + id);
		const helper = sensors.filter((sensor) => {
			return sensor.index !== id;
		});
		console.log(helper);
		setSensors(helper);
	};

	const sendSensors = (sensorArr: any) => {
		console.log("Send sensors yes" + sensorArr);
		console.log(sensorArr[0].name);
		setSensors(sensorArr);
	};

	const mapSensors = sensors.map((sensor: Sensor) => {
		return (
			<SensorRowHome connected={true} index={sensor.index} disconnectFunc={removeSensor} name={sensor.name} battery={sensor.battery} />
		);
	});

	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.header} xs={12}>
				<Grid item xs={2}></Grid>
				<Grid item justify="flex-start" xs={4}>
					<Typography variant="h5" color="textPrimary">
						Sensor name
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={2}>
					<Typography variant="h5" color="textPrimary">
						Id
					</Typography>
				</Grid>
				<Grid item justify="flex-start" xs={2}>
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
				<Button func={openModal}>Scan</Button>
				<SensorModal sendSensors={sendSensors} close={closeModal} open={open}></SensorModal>
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
