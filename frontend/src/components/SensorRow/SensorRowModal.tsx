import { FC, useState, useEffect, useCallback } from "react";
import { Box, Typography, Grid, makeStyles } from "@material-ui/core";

// Components
import SensorButton from "../Buttons/SensorButton.component";

type SensorProps = {
	id?: number;
	connected: boolean;
	name: string;
	index: number;
	clickConnect?: any;
	battery: boolean;
};

export const SensorRowModal: FC<SensorProps> = (props) => {
	const [batteryPercent, setBatteryPercent] = useState<string>("");
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [connected, setConnected] = useState<boolean>(false);
	const [sensorData, setSensorData] = useState<any>();
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
				setSensorData(data);
				setConnected(true);
				setIsFetching(false);
			});
	}, [isFetching]);

	useEffect(() => {
		if (!props.clickConnect) return;
		props.clickConnect(sensorData, connected);
	}, [connected]);


	const getStatus = () => {
		let out: string = "";
		if (props.id) out += props.id + "  ";
		out += connected ? "Connected" : "Disconnected";
		return out;
	};

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
	gridConnected: {
		border: "2px solid red",
	},
});
