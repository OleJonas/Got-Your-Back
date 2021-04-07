import { FC, useState, useEffect, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

// Components
import SensorButton from "../Buttons/SensorButton.component";

type SensorProps = {
	id: number;
	connected: boolean;
	name: string;
	clickConnect?: any;
};

/**
 * @remarks
 * A functional component showing the details of a not connected sensor.
 */
export const SensorRowModal: FC<SensorProps> = (props) => {
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [connected, setConnected] = useState<boolean>(false);
	const [sensorData, setSensorData] = useState<any>();
	const classes = useStyles();

	/**
	 * @remarks
	 * Function that connects to the chosen sensor via bluetooth.
	 * Then the function sets the state variables sensorData and connected, as well as isFetching to the corresponding data returned from the async call.
	 */
	const connect = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		await fetch("http://localhost:5000/setup/connect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				name: props.name,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setSensorData(data);
				setConnected(true);
				setIsFetching(false);
			});
		// eslint-disable-next-line
	}, [isFetching]);

	useEffect(() => {
		if (!props.clickConnect) return;
		props.clickConnect(sensorData, connected);
		// eslint-disable-next-line
	}, [connected]);

	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={5}>
				<Typography variant="body1" color="textSecondary">
					{props.name}
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={2}>
				<Typography variant="body1" color="textSecondary">
					{props.id}
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={3}>
				<Typography variant="body1" color="textSecondary">
					{connected ? "Connected" : "Disconnected"}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="flex-start" item xs={2}>
				<SensorButton type="connect" status={connected} func={connect} id="connectButton" disabled={isFetching} />
			</Grid>
		</Grid>
	);
};
export default SensorRowModal;

const useStyles = makeStyles({
	root: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	grid: {
		paddingLeft: "30px",
		height: "50px",
		alignItems: "center",
	},
});
