import { FC, useState, useEffect, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

// Components
import SensorButton from "../Buttons/SensorButton.component";
import BluetoothConnectedIcon from "@material-ui/icons/BluetoothConnected";

type SensorProps = {
	id?: number;
	connected: boolean;
	name: string;
	index: number;
	clickConnect?: any;
	battery: number;
	disconnectFunc: (id: number) => void;
};

export const SensorRowHome: FC<SensorProps> = (props: SensorProps) => {
	const [batteryPercent, setBatteryPercent] = useState<number>(props.battery);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [connected, setConnected] = useState<boolean>(false);
	const classes = useStyles();

	useEffect(() => {
		if (!props.clickConnect) return;
		props.clickConnect(props.index, connected);
	}, [connected]);

	const disconnect = async (index:number) => {

		await fetch("http://localhost:5000/setup/disconnect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				"handles": [index]
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setConnected(false);
				props.disconnectFunc(index);
			});
	}

	const getBatteryPercent = useCallback(async () => {
		if (!props.connected) return;
		await fetch("http://localhost:5000/sensor/battery?id=" + props.index, {
			headers: {
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data !== undefined) setBatteryPercent(data.battery);
			});
	}, [batteryPercent]);

	useEffect(() => {
		if (!props.connected) return;
		setInterval(getBatteryPercent, 30000);
	}, []);

	return (
		<Grid container className={classes.root} direction="row" justify="center" alignItems="center">
			<Grid item direction="row" justify="center" xs={2}>
				<BluetoothConnectedIcon className={classes.icon} />
			</Grid>
			<Grid item direction="row" justify="flex-start" xs={4}>
				<Typography variant="body2" color="textPrimary">
					{props.name}
				</Typography>
			</Grid>
			<Grid item direction="row" justify="center" xs={2}>
				<Typography variant="body2" color="textPrimary">
					{props.index}
				</Typography>
			</Grid>
			<Grid item direction="row" justify="center" xs={2}>
				<Typography variant="body2" color="textPrimary">
					{batteryPercent + "%"}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="center" item xs={3}>
				<SensorButton type="disconnect" status={connected} func={()=>disconnect(props.index)} id="connectButton" disabled={isFetching} />
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
		margin: "0 0 0 30px",
		color: "#EDB93C",
	},
});
