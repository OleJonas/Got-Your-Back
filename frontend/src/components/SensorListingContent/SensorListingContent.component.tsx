import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorListing } from "../SensorListing/SensorListing"
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
		setOpen(false)
	}

	const sendSensors = (sensorArr: any) => {
		console.log("Send sensors yes" + sensorArr);
		console.log(sensorArr[0].name)
		setSensors(sensorArr);
	} 

	const mapSensors = sensors.map(sensor => {
		return (<SensorListing connected={true} index={sensor.index} name={sensor.name} battery={true} />)
	})

	/*
	const mapSensors = () => {
		let out = []
		if(sensors.length > 0){
			for(let i = 0; i < sensors.length; i++){
				out.push(<SensorListing connected={true} index={sensors[i].index} name={sensors[i].name} battery={true} />)
			}
		}
		return out;
	}
	*/

	return (
		<Box>
			<Box className={classes.sensorBox}>
				<Grid className={classes.columns} container lg={12}>
					<Grid container className={classes.grid} justify="flex-start" item lg={5}>
						<Typography variant="h6">Sensor name</Typography>
					</Grid>
					<Grid container className={classes.grid} justify="flex-start" item lg={4}>
						<Typography variant="h6">Status</Typography>
					</Grid>
					<Grid container className={classes.grid} justify="center" item lg={3}>
						<Typography variant="h6"></Typography>
					</Grid>
				</Grid>
			</Box>
			{mapSensors}
			<Button func={openModal}>Scan </Button>
			<SensorModal sendSensors={sendSensors} close={closeModal} open={open}></SensorModal>
		</Box>
	);
};

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
		marginTop: "30px",
	},
	paper: {
		height: "80%",
		width: "70%",
	},
	sensorBox: {
		height: "60%",
		marginTop: "30px",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
	},
	btnGrid: {
		marginTop: "50px",
		width: "100%",
	},
});
