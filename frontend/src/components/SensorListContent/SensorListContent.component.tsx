import { useState, useCallback, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

// Componentes
import { Button } from "../Buttons/Button.component";
import { SensorRowHome } from "../SensorRow/SensorRowHome.component";
import { SensorModal } from "../SensorModal/SensorModal.component";

type Sensor = {
	id: number;
	name: string;
	battery: number;
};

export const SensorListContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState<Sensor[]>([]);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	const removeSensor = (id: number) => {
		console.log("Removing sensor...  " + id);
		const helper = sensors.filter((sensor: Sensor) => {
			return sensor.id !== id;
		});
		setSensors(helper);
	};

	const addSensors = (sensor: Sensor) => {
		let helper = sensors;
		helper.push(sensor);
		setSensors(helper);
	};


	const getConnectedSensors = useCallback(async () => {

		await fetch("http://localhost:5000/setup/get_sensors", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then(data => {
				console.log(data);
				setSensors(data["sensors"]);
			})
	}, []);


	useEffect(() => {
		console.log("useEffect");
		getConnectedSensors();
		// eslint-disable-next-line
	}, []);


	const mapSensors = sensors.map((sensor: Sensor) => {
		return (
			<SensorRowHome connected={true} id={sensor.id} disconnectFunc={removeSensor} name={sensor.name} battery={sensor.battery} />
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
				<SensorModal sendSensors={addSensors} close={closeModal} open={open}></SensorModal>
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
