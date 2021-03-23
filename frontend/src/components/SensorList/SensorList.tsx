import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";

// Components
import { SensorRowModal } from "../SensorRow/SensorRowModal";

type SensorListProps = {
	connected: boolean;
	color: string;
	sensors?: any[];
};

export const SensorList: FC<SensorListProps> = (props: SensorListProps) => {
	const classes = useStyles();

	return (
		<Box>
			<Box className={props.color === "white" ? classes.whiteSensorBox : classes.sensorBox}>
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

				{props.sensors ? props.sensors.map((sensor: string, index: number) => <SensorRowModal index={index} name={sensor} />) : <></>}
			</Box>
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

	whiteSensorBox: {
		height: "60%",
		marginTop: "30px",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
	},

	sensorBox: {
		height: "60%",
		marginTop: "30px",
		width: "95%",
		margin: "auto",
	},

	btnGrid: {
		marginTop: "50px",
		width: "100%",
	},
});
