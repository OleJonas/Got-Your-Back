import { FC, useState, useEffect, useCallback } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";

// Components
import sensor_icon from "../../assets/SENSOR_FARGET.png";
import SensorButton from "../../components/Buttons/SensorButton.component";
import BluetoothConnectedIcon from "@material-ui/icons/BluetoothConnected";
import { theme } from "../../theme";

type SensorProps = {
	id?: number;
	connected: boolean;
	name: string;
	index: number;
	clickConnect?: any;
	battery: boolean;
};

export const SensorListingHome: FC<SensorProps> = (props) => {
	const [name, setName] = useState<string>("");
	const [batteryPercent, setBatteryPercent] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [connected, setConnected] = useState<boolean>(false);
	const classes = useStyles();

	useEffect(() => {
		if (!props.clickConnect) return;
		props.clickConnect(props.index, connected);
	}, [connected]);

	const disconnect = useCallback(async () => {
		console.log("Disconnected!");

		await fetch("http://localhost:5000/setup/disconnect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				handles: [props.index],
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setConnected(false);
			});
	}, [connected]);

	const getBatteryPercent = useCallback(async () => {
		if (!props.connected) return;
		await fetch("http://localhost:5000/sensor/battery?id=" + props.index, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}).then((res) => {
			res.json();
			console.log(res);
		});
		/*
			.then(data => {
				if(data !== undefined) setBatteryPercent(data.battery);
			});
			*/
	}, [batteryPercent]);

	useEffect(() => {
		if (!props.connected) return;
		setInterval(getBatteryPercent, 5000);
	}, []);

	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.grid} direction="row" justify="center" xs={2}>
				<Typography variant="body1" color="textPrimary">
					<img className={classes.img} src={BluetoothConnectedIcon}></img>
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={3}>
				<Typography variant="body1" color="textPrimary">
					{props.name}
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="center" xs={2}>
				<Typography variant="body1" color="textPrimary">
					{props.index}
				</Typography>
			</Grid>
			<Grid container item className={classes.grid} direction="row" justify="center" xs={2}>
				<Typography variant="body1" color="textPrimary">
					{batteryPercent}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="center" item xs={3}>
				<SensorButton type="disconnect" status={connected} func={disconnect} id="connectButton" disabled={isFetching} />
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles({
	root: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	grid: {
		marginTop: "10px",
	},
	img: {
		width: "40px",
		height: "40px",
		color: "#EDB93C",
	},
});
