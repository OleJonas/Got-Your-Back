import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorListingHome } from "../SensorListingHome/SensorListingHome.component";
import { SensorModal } from "../SensorModal/SensorModal.component";

export const SensorListingContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [sensors, setSensors] = useState([]);

	const openModal = () => {
		console.log(open);
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	const sendSensors = (sensorArr: any) => {
		console.log("Send sensors yes" + sensorArr);
		console.log(sensorArr[0].name);
		setSensors(sensorArr);
	};

	const mapSensors = sensors.map((sensor) => {
		return <SensorListingHome connected={true} index={sensor.index} name={sensor.name} battery={true} />;
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
