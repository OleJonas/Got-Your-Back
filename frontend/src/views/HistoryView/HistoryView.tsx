import { useEffect, useState } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import { ContentBox } from "../../components/ContentBox/ContentBox.component";
import { LineChart } from "../../components/LineChart/LineChart.component.jsx";
import { PieChart } from "../../components/PieChart/PieChart.component.jsx";
import { ColumnChart } from "../../components/ColumnChart/ColumnChart.component";


// DENNE MÅ NOEN ANDRE KOMMENTERE ANER IKKE HVA JEG SKAL SKRIVE HER



/**
 * 
 * @returns The history page showing statistics from the last few days all the way back to months.
 */
export const HistoryView = () => {
	const [durationLine, setDurationLine] = useState<number>(7);
	const [durationColumn, setDurationColumn] = useState<number>(7);
	const classes = useStyles();
	const [datapointsLine, setDatapointsLine] = useState<any>({
		"1998-09-10 08:25:50": "1",
	});
	const [datapointsColumn, setDatapointsColumn] = useState<any>({
		"1998-09-10 08:25:50": "1",
	});

	useEffect(() => {
		fetch("http://localhost:5000/classifications/history?duration=" + durationLine, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setDatapointsLine(data);
			});
	}, [durationLine]);

	useEffect(() => {
		fetch("http://localhost:5000/classifications/history?duration=" + durationColumn, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setDatapointsColumn(data);
			});
	}, [durationColumn]);

	const handleChangeLine = (event: any) => {
		setDurationLine(event.target.value);
	};

	const handleChangeColumn = (event: any) => {
		setDurationColumn(event.target.value);
	};

	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} className={classes.height}>
					<Grid container spacing={2} className={classes.container}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								History
							</Typography>
						</Grid>

						<Grid item xs={12} className={classes.components}>
							<Box mb={0.6} className={classes.box}>
								<FormControl className={classes.dropdown}>
									<InputLabel id="durationLine-controlled-open-select-label">
										<Typography variant="h5" color="textPrimary">
											Distribution over time
										</Typography>
									</InputLabel>
									<Select
										labelId="durationLine-controlled-open-select-label"
										id="durationLine-controlled-open-select"
										value={durationLine}
										onChange={handleChangeLine}
										inputProps={{
											classes: {
												icon: classes.icon,
											},
										}}
									>
										<MenuItem value={7}>7 days</MenuItem>
										<MenuItem value={14}>14 days</MenuItem>
										<MenuItem value={30}>30 days</MenuItem>
									</Select>
								</FormControl>
								<Typography variant="h3" color="textPrimary"></Typography>

								<ContentBox>
									<LineChart hAxisFormat={"dd-MM-YY"} data={datapointsLine} />
								</ContentBox>
							</Box>
						</Grid>

						<Grid item xs={12} md={12} className={classes.components}>
							<FormControl className={classes.dropdown}>
								<InputLabel id="durationColumn-controlled-open-select-label">
									<Typography variant="h5" color="textPrimary">
										Distribution in total
									</Typography>
								</InputLabel>
								<Select
									labelId="durationColumn-controlled-open-select-label"
									id="durationColumn-controlled-open-select"
									value={durationColumn}
									onChange={handleChangeColumn}
									inputProps={{
										classes: {
											icon: classes.icon,
										},
									}}
								>
									<MenuItem value={7}>7 days</MenuItem>
									<MenuItem value={14}>14 days</MenuItem>
									<MenuItem value={30}>30 days</MenuItem>
								</Select>
							</FormControl>

							<ContentBox>
								<ColumnChart data={datapointsColumn} />
							</ContentBox>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};
export default HistoryView;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	box: {
		height: "100%",
	},
	icon: {
		fill: "white",
	},
	dropdown: {
		minWidth: 160,
	},
	container: {
		height: "100%",
		padding: "20px",
		overflow: "auto",
	},
	components: {
		minHeight: "300px",
		height: "40vh",
	},
	height: {
		height: "100%",
	},
});
