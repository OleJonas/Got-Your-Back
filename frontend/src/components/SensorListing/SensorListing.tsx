import { FC, useState, useEffect, useCallback } from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Button from "../Buttons/Button.component";
import SensorButton from "../Buttons/SensorButton.component";

type SensorProps = {
	id?: number;
	connected: boolean;
	name: string;
	index: number;
	clickConnect?: any;
	battery: boolean;
};

export const SensorListing: FC<SensorProps> = (props) => {
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
	}, [connected]);

	const getName = () => {
		return props.name;
	};

	const getStatus = () => {
		let out: string = "";
		if (props.id) out += props.id + "  ";
		out += connected ? "Connected" : "Disconnected";
		return out;
	};

	const getBatteryPercent = useCallback(async () => {
		/*
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
		*/
	}, [batteryPercent]);

	useEffect(() => {
		if (!props.connected) return;
		setInterval(getBatteryPercent, 5000);
	}, []);

	const renderConnected = () => {
		return (
			<Grid container className={classes.root}>
				<Grid container item className={classes.gridConnected} direction="row" justify="flex-start" xs={2}>
					<Typography variant="body1" color="textPrimary">
						{props.name}
					</Typography>
				</Grid>
				<Grid container item className={classes.gridConnected} direction="row" justify="flex-start" xs={4}>
					<Typography variant="body1" color="textPrimary">
						{props.name}
					</Typography>
				</Grid>
				<Grid container item className={classes.gridConnected} direction="row" justify="flex-start" xs={2}>
					<Typography variant="body1" color="textPrimary">
						{props.index}
					</Typography>
				</Grid>
				<Grid container item className={classes.gridConnected} direction="row" justify="flex-start" xs={2}>
					<Typography variant="body1" color="textPrimary">
						{3}
					</Typography>
				</Grid>
				<Grid className={classes.gridConnected} container justify="flex-start" item xs={2}>
					<SensorButton type="connect" status={connected} func={connect} id="connectButton" disabled={isFetching} />
				</Grid>
			</Grid>
		);
	};

	const renderNotConnected = () => {
		return (
			<Grid container className={classes.root}>
				<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={5}>
					<Typography variant="body1" color="textSecondary">
						{props.name}
					</Typography>
				</Grid>
				<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={4}>
					<Typography variant="body1" color="textSecondary">
						{getStatus()}
					</Typography>
				</Grid>
				<Grid className={classes.grid} container justify="flex-start" item xs={3}>
					<SensorButton type="connect" status={connected} func={connect} id="connectButton" disabled={isFetching} />
				</Grid>
			</Grid>
		);
	};

	return <Box>{props.connected ? renderConnected() : renderNotConnected()}</Box>;
};

const AddButton = () => {
	return <></>;
};

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
	gridConnected: {
		border: "2px solid red",
	},
});
