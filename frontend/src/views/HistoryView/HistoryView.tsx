import { useEffect, useState } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import { ContentBox } from "../../components/ContentBox/ContentBox.component";
import { LineChart } from "../../components/LineChart/LineChart.component.jsx";
import { ColumnChart } from "../../components/ColumnChart/ColumnChart.component";

/**
 *
 * @returns The history page showing statistics from the last few days all the way back to months.
 */
export const HistoryView = () => {
	const [durationLine, setDurationLine] = useState<number>(7);
	const [durationColumn, setDurationColumn] = useState<number>(7);
	const classes = useStyles();
	const [datapointsLine, setDatapointsLine] = useState<any>({});
	const [datapointsColumn, setDatapointsColumn] = useState<any>({});

	useEffect(() => {
		fetch("http://localhost:5000/classifications/history?duration=" + durationLine, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
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
					<Grid container spacing={1} className={classes.container}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								History
							</Typography>
						</Grid>

						<Grid item xs={12} className={classes.components}>
							<Box my={1} mx={0.5}>
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
							</Box>
							<ContentBox>
								<LineChart duration={durationLine} data={datapointsLine} />
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={12} className={classes.components}>
							<Box my={1} mx={0.5}>
								<FormControl className={classes.dropdown} style={{ position: "relative", marginTop: "40px" }}>
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
							</Box>

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
		height: "35vh",
	},
	height: {
		height: "100%",
	},
});
