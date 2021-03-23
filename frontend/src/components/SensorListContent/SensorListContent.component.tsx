import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorRowHome } from "../SensorRow/SensorRowHome.component";
import { SensorModal } from "../SensorModal/SensorModal.component";

type Sensor = {
	index: number;
	name: string;
};

export const SensorListContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState([]);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};


	const removeSensor = (id: number) => {
		console.log("Removing sensor...  " + id);
		const helper = sensors.filter(sensor => {return sensor.index !== id});
		console.log(helper)
		setSensors(helper);
	}
	

	const sendSensors = (sensorArr: any) => {
		console.log("Send sensors yes" + sensorArr);
		console.log(sensorArr[0].name);
		setSensors(sensorArr);
	};

	const mapSensors = sensors.map((sensor) => {
		return <SensorRowHome connected={true} index={sensor.index} disconnectFunc={removeSensor} name={sensor.name} battery={sensor.battery} />;
	});

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid1} item container lg={12}>
				<Grid className={classes.columns} justify="center" alignItems="center" item container lg={12}>
					<Grid container justify="flex-start" item lg={2}>
						<Typography variant="h5" color="textPrimary"></Typography>
					</Grid>
					<Grid container justify="flex-start" item lg={3}>
						<Typography variant="h5" color="textPrimary">
							Sensor name
						</Typography>
					</Grid>
					<Grid container justify="center" item lg={2}>
						<Typography variant="h5" color="textPrimary">
							Id
						</Typography>
					</Grid>
					<Grid container justify="center" item lg={2}>
						<Typography variant="h5" color="textPrimary">
							Battery
						</Typography>
					</Grid>
					<Grid container justify="center" item lg={3}>
						<Typography variant="h5" color="textPrimary"></Typography>
					</Grid>
				</Grid>
				{mapSensors}
			</Grid>
			<Grid lg={12} item container className={classes.grid2}>
				<Button func={openModal}>Scan </Button>
				<SensorModal sendSensors={sendSensors} close={closeModal} open={open}></SensorModal>
			</Grid>
		</Box>
	);
};
export default SensorListContent;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	grid1: {
		height: "75%",
	},
	grid2: {
		justifyContent: "center",
		alignItems: "center",
		height: "25%",
	},
	greds: {
		height: "100%",
	},
	columns: {
		marginTop: "20px",
		height: "20%",
	},
});
