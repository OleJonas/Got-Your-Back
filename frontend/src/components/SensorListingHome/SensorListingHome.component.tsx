import { FC, useState, useEffect, useCallback } from "react";
import { Box, Divider, Modal, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Check } from "@material-ui/icons";
import { theme } from "../../theme";
import { ConnectBtn } from "../Buttons/ConnectButton.component";
import sensor_icon from "../../assets/SENSOR_FARGET.png";
import { DisconnectButton } from "../../components/Buttons/DisconnectButton.component";

// Components
import { Button } from "../Buttons/Button.component";

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
				handle: props.index,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setConnected(true);
				setIsFetching(false);
			});
	}, [isFetching]);

	useEffect(() => {
		if (!props.clickConnect) return;
		props.clickConnect(props.index, connected);
	}, [connected]);

	const disconnect = useCallback(async () => {
		console.log("Disconnected!");
		/*
		await fetch("http://localhost:5000/setup/disconnect", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				handle: props.index,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setConnected(false);
			});
        */
	}, [connected]);

	/*
	const getBatteryPercent = useCallback(async () => {
		
		await fetch("http://localhost:5000/sensor/battery?id=" + props.index, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => {
				console.log(res.text());
				//res.json();
			})
			.then((data) => {
				console.log(data);
				setBatteryPercent(data);
			});
		
	}, [batteryPercent]);

	useEffect(() => {
		if (!props.connected) return;
		setInterval(getBatteryPercent, 5000);
	}, []);
    */
	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.grid} direction="row" justify="center" xs={2}>
				<Typography variant="body1" color="textPrimary">
					<img className={classes.img} src={sensor_icon}></img>
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
					{"3,7%"}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="center" item xs={3}>
				<DisconnectButton status={connected} func={disconnect} id="connectButton" disabled={isFetching}>
					{connected ? ">" : "||"}
				</DisconnectButton>
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
	},
});
