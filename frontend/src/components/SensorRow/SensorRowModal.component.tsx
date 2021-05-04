/**
 * @module SensorRowModal
 * @category Components
 */
import { useState, useEffect, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import SensorButton from "../Buttons/SensorButton.component";
import SERVER_PORT from "../../utils/serverUtils";

export type sensorProps = {
	name: string;
	clickConnect?: any;
};

/**
 *
 * A functional component showing the details of a not connected sensor.
 *
 * @param {sensorProps} props {@link sensorProps}
 */
export const SensorRowModal: React.FC<sensorProps> = (props) => {
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [connected, setConnected] = useState<boolean>(false);
	const [sensorData, setSensorData] = useState<{ battery_percent: string; id: number; name: string }>();
	const classes = useStyles();

	/**
	 *
	 * Function that connects to the chosen sensor via bluetooth.
	 * Then the function sets the state variables sensorData and connected, as well as isFetching to the corresponding data returned from the async call.
	 */
	const connect = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		await fetch("http://localhost:" + SERVER_PORT + "/setup/connect", {
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
				if (!data.hasOwnProperty("error")) {
					setSensorData(data);
					setConnected(true);
				}
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
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={6}>
				<Typography variant="body1" color="textSecondary">
					{props.name}
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={3}>
				<Typography variant="body1" color="textSecondary">
					{connected ? "Connected" : "Disconnected"}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="center" item xs={2}>
				<SensorButton
					type="connect"
					loading={isFetching}
					status={connected}
					func={connect}
					sensorid={sensorData ? sensorData.id : 0}
					disabled={isFetching || connected}
				/>
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
