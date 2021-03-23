import { FC, useState, useEffect, useCallback } from "react";
import { Box, Grid, Dialog, DialogTitle, DialogContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import { Button } from "../Buttons/Button.component";
import { SensorRowModal } from "../SensorRow/SensorRowModal.component";
import loader from "../../assets/loader.svg";
import "./loader.css";

type modalProps = {
	open: boolean;
	close?: any;
	sendSensors: any;
};

export const SensorModal: FC<modalProps> = (props) => {
	const classes = useStyles();
	const [sensorsFound, setSensorsFound] = useState<any>();
	const [connectedSensors, setConnectedSensors] = useState<any[]>([]);
	const [isFetching, setIsFetching] = useState(false);
	const [open, setOpen] = useState(false);

	const scanForSensors = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

		await fetch("http://localhost:5000/setup/scan", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log("Data: ", data);
				setSensorsFound(data["sensors"]);
				setIsFetching(false);
				setOpen(true);
			});
	}, [isFetching]);

	useEffect(() => {
		if (props.open === true) {
			setOpen(props.open);
			scanForSensors();
		}
	}, [props.open]);

	const handleClose = () => {
		if (connectedSensors) {
			let inboundSensors: any[] = [];
			connectedSensors.forEach((sensor: any) => {
				let s = {
					index: sensor.id,
					connected: true,
					name: sensor.name,
					battery: sensor.battery_percent,
				};
				inboundSensors.push(s);
			});
			props.sendSensors(inboundSensors);
		}
		props.close();
		setOpen(false);
		/*

		// DUMMY DATA
		console.log("Yo fra inni if ye!");
		let inboundSensors = [];
		for (let i = 0; i < 3; i++) {
			let s = {
				index: i,
				connected: true,
				name: "SENSOR" + i,
			};
			inboundSensors.push(s);
		}
		props.sendSensors(inboundSensors);
		props.close();
		setOpen(false);
        */
	};

	const addConnected = (data: any, isConnected: boolean) => {
		console.log("addConnected");
		let helper = connectedSensors;
		console.log(isConnected);
		if (helper) {
			if (isConnected) {
				console.log("isConnected = true");
				helper.push(data);
			}
		}
		setConnectedSensors(helper);
	};

	return (
		<Box>
			<Dialog
				classes={{ paper: classes.paper }}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				className={classes.root}
			>
				<DialogTitle className={classes.title} id="customized-dialog-title">
					<Typography variant="h2">{isFetching ? "Searching for sensors..." : "Sensors found"}</Typography>
				</DialogTitle>
				<DialogContent className={classes.dialogContent} dividers>
					<Box className={classes.sensorBox}>
						{isFetching ? (
							<Box>
								<img src={loader} className="loading" alt="Rotating loading icon"></img>
							</Box>
						) : (
							<Box>
								<Grid className={classes.columns} container lg={12}>
									<Grid container className={classes.grid} justify="flex-start" item lg={5}>
										<Typography variant="h6">Sensor name</Typography>
									</Grid>
									<Grid container className={classes.grid} justify="flex-start" item lg={4}>
										<Typography variant="h6">Status</Typography>
									</Grid>
									<Grid container className={classes.grid} justify="center" item lg={3}>
										<Typography variant="h6"></Typography>
									</Grid>
								</Grid>

								{sensorsFound ? (
									sensorsFound.map((sensor: string, index: number) => (
										<SensorRowModal clickConnect={addConnected} connected={false} index={index} name={sensor} battery={false} />
									))
								) : (
									<></>
								)}
							</Box>
						)}
					</Box>
					<Grid container justify="center" className={classes.btnGrid}>
						<Grid item xs={6}>
							<Button disabled={isFetching} func={scanForSensors}>
								Refresh
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button func={handleClose}>Close</Button>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</Box>
	);
};
export default SensorModal;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		textAlign: "center",
		borderRadius: "0",
	},
	dialogContent: {
		height: "1000px",
	},
	grid: {
		justify: "center",
		alignItems: "center",
		paddingLeft: "30px",
	},
	columns: {
		maxWidth: "100%",
		justifyContent: "space-between",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "50px",
		backgroundColor: "white",
		borderBottom: "1px solid black",
	},
	title: {
		marginTop: "30px",
	},
	paper: {
		height: "80%",
		width: "70%",
	},
	sensorBox: {
		height: "60%",
		marginTop: "30px",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
	},
	btnGrid: {
		marginTop: "50px",
		width: "100%",
	},
});
