import { FC, useState, useEffect, useCallback } from "react";
import { Box, Divider, Modal, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "../../theme";
import { ConnectBtn } from "../Buttons/ConnectButton.component";

// Components
import { Button } from "../Buttons/Button.component";

type SensorProps = {
	id?: number;
	name: string;
	index: number;
};

export const SensorListing: FC<SensorProps> = (props) => {
	const [name, setName] = useState<string>("");
	const [batteryPercent, setBatteryPercent] = useState<number>(0);
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

	const sensorString = () => {
		let out: string = "";
		if (props.id) out += props.id + "  ";
		out += props.name + "  ";
		out += connected ? "Tilkoblet" : "Frakoblet";
		return out;
	};

	return (
		<Grid container className={classes.root}>
			<Grid container item className={classes.grid} direction="row" justify="flex-start" xs={9}>
				<Typography variant="body1" color="textSecondary">
					{sensorString()}
				</Typography>
			</Grid>
			<Grid className={classes.grid} container justify="center" item xs={3}>
				<ConnectBtn func={connect} id="connectButton" disabled={isFetching}>
					{connected ? ">" : "||"}
				</ConnectBtn>
			</Grid>
		</Grid>
	);
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
});
