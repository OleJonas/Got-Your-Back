/**
 * @module SensorRowHome
 * @category Components
 */
import { useState, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import SensorButton from "../Buttons/SensorButton.component";
import BluetoothConnectedIcon from "@material-ui/icons/BluetoothConnected";
import SERVER_PORT from "../../utils/serverUtils";
import useInterval from "../../utils/useInterval";

export type sensorProps = {
	id: number;
	connected: boolean;
	name: string;
	battery: number;
	busy: boolean;
	position: string;
	disconnectFunc: (id: number) => void;
};

/**
 *
 * A functional component showing data for the sensor
 *
 * @param {sensorProps} props {@link sensorProps}
 */
export const SensorRowHome: React.FC<sensorProps> = (props: sensorProps) => {
	const [batteryPercent, setBatteryPercent] = useState<number>(props.battery);
	const [connected, setConnected] = useState<boolean>(false);
	const classes = useStyles();

	/**
	 * @param {string} name A string containing the sensors name
	 * @param {number} id A number used to identify each sensor.
	 * Does an async call to disconnect from the desired sensor.
	 */
	const disconnect = async (name: string, id: number) => {
		await fetch("http://localhost:" + SERVER_PORT + "/setup/disconnect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				names: [name],
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setConnected(false);
				props.disconnectFunc(id);
			});
	};

	/**
	 * Does an async fetch request to aquire the current battery level of the sensor
	 */
	const getBatteryPercent = useCallback(async () => {
		if (!props.connected) return;
		await fetch("http://localhost:" + SERVER_PORT + "/sensors/battery?name=" + props.name, {
			headers: {
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data !== undefined) {
					if (data.battery === "0.0") props.disconnectFunc(props.id);
					else setBatteryPercent(data.battery);
				}
			});
		// eslint-disable-next-line
	}, [batteryPercent]);

	useInterval(() => {
		if (!props.connected) return;
		getBatteryPercent();
	}, 30000);

	return (
		<Grid container className={classes.root} justify="flex-start" alignItems="center">
			<Grid item xs={2}>
				<BluetoothConnectedIcon className={classes.icon} />
			</Grid>
			<Grid item xs={3}>
				<Typography variant="body2" color="textPrimary">
					{props.name}
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography variant="body2" color="textPrimary">
					{props.position}
				</Typography>
			</Grid>
			<Grid item xs={1}>
				<Typography variant="body2" color="textPrimary">
					{props.id}
				</Typography>
			</Grid>
			<Grid item xs={1}>
				<Typography variant="body2" color="textPrimary">
					{batteryPercent + "%"}
				</Typography>
			</Grid>
			<Grid item xs={2}>
				<Grid container justify="center">
					<SensorButton
						type="disconnect"
						status={connected}
						func={() => disconnect(props.name, props.id)}
						sensorid={props.id}
						disabled={props.busy}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};
export default SensorRowHome;

const useStyles = makeStyles({
	root: {
		marginTop: "10px",
	},
	icon: {
		width: "30px",
		height: "30px",
		marginLeft: "30px",
		color: "#EDB93C",
	},
});
