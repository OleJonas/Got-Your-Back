import { FC, useState, useEffect, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

// Components
import SensorButton from "../Buttons/SensorButton.component";
import BluetoothConnectedIcon from "@material-ui/icons/BluetoothConnected";

type SensorProps = {
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
 * @param props 
 * @returns A functional component showing data for the sensor
 */
export const SensorRowHome: FC<SensorProps> = (props: SensorProps) => {
	const [batteryPercent, setBatteryPercent] = useState<number>(props.battery);
	const [connected, setConnected] = useState<boolean>(false);
	const classes = useStyles();

	/**
	 * @remarks
	 * Does an async call to disconnect from the desired sensor.
	 * 
	 * @param name A string containing the sensors name
	 * @param id A number used to identify each sensor.
	 */
	const disconnect = async (name: string, id: number) => {
		await fetch("http://localhost:5000/setup/disconnect", {
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
	 * @remarks
	 * Does an async fetch request to aquire the current battery level of the sensor
	 */
	const getBatteryPercent = useCallback(async () => {
		if (!props.connected) return;
		await fetch("http://localhost:5000/sensor/battery?name=" + props.name, {
			headers: {
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data !== undefined) setBatteryPercent(data.battery);
			});
		// eslint-disable-next-line
	}, [batteryPercent]);

	useEffect(() => {
		if (!props.connected) return;
		setInterval(getBatteryPercent, 60000);
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container className={classes.root} direction="row" justify="center" alignItems="center">
			<Grid item direction="row" justify="center" xs={2}>
				<BluetoothConnectedIcon className={classes.icon} />
			</Grid>
			<Grid item direction="row" justify="flex-start" xs={3}>
				<Typography variant="body2" color="textPrimary">
					{props.name}
				</Typography>
			</Grid>
			<Grid item direction="row" justify="flex-start" xs={3}>
				<Typography variant="body2" color="textPrimary">
					{props.position}
				</Typography>
			</Grid>
			<Grid item direction="row" justify="center" xs={1}>
				<Typography variant="body2" color="textPrimary">
					{props.id}
				</Typography>
			</Grid>
			<Grid item direction="row" justify="center" xs={1}>
				<Typography variant="body2" color="textPrimary">
					{batteryPercent + "%"}
				</Typography>
			</Grid>
			<Grid container justify="center" item xs={2}>
				<SensorButton type="disconnect" status={connected} func={() => disconnect(props.name, props.id)} sensorid={props.id} disabled={props.busy} />
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
