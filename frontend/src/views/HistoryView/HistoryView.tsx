/**
 * @module HistoryView
 * @category Views
 */
import { useEffect, useState } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import NavBar from "../../components/NavBar/NavBar.component";
import ContentBox from "../../components/ContentBox/ContentBox.component";
import LineChart from "../../components/LineChart/LineChart.component.jsx";
import ColumnChart from "../../components/ColumnChart/ColumnChart.component";
import SERVER_PORT from "../../utils/serverUtils";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.component";

/**
 * The history page showing statistics from the last few days all the way back to months.
 */
export const HistoryView = () => {
	const [durationLine, setDurationLine] = useState<number>(7);
	const [durationColumn, setDurationColumn] = useState<number>(7);
	const classes = useStyles();
	const [datapointsLine, setDatapointsLine] = useState<any>({});
	const [datapointsColumn, setDatapointsColumn] = useState<any>({});

	/**
	 * Fetches classifications for a given duration (X number of days back in time) for the line chart
	 */
	useEffect(() => {
		fetch("http://localhost:" + SERVER_PORT + "/classifications/history?duration=" + durationLine, {
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

	/**
	 * Fetches classifications for a given duration (X number of days back in time) for the column chart
	 */
	useEffect(() => {
		fetch("http://localhost:" + SERVER_PORT + "/classifications/history?duration=" + durationColumn, {
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

	/**
	 *
	 * @param event
	 * Sets duration (# of days back in time) for line chart
	 */
	const handleChangeLine = (event: any) => {
		setDurationLine(event.target.value);
	};

	/**
	 *
	 * @param event
	 * Sets duration (# of days back in time) for column chart
	 */
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
					<Grid container alignItems="flex-start" className={classes.container}>
						<Grid item xs={12} className={classes.title}>
							<Box>
								<Typography variant="h1" color="textPrimary">
									History
								</Typography>
							</Box>
						</Grid>

						<Grid item xs={12}>
							<Box className={classes.components}>
								<Box p={1}>
									<FormControl className={classes.dropdown}>
										<InputLabel id="durationLine-controlled-open-select-label">
											<Box display="flex" alignItems="center">
												<Typography variant="h5" color="textPrimary">
													Distribution over time
												</Typography>
												<InfoTooltip text={"Most occurent position for each day in selected interval."} />
											</Box>
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
								<ContentBox className={classes.components}>
									{console.log(datapointsLine)}
									<LineChart duration={durationLine} data={datapointsLine} />
								</ContentBox>
							</Box>
						</Grid>

						<Grid item xs={12} md={12}>
							<Box mt={10} className={classes.components}>
								<Box p={1}>
									<FormControl className={classes.dropdown}>
										<InputLabel id="durationColumn-controlled-open-select-label">
											<Box display="flex" alignItems="center">
												<Typography variant="h5" color="textPrimary">
													Distribution in total
												</Typography>
												<InfoTooltip text={"Total distribution of positions in given interval."} />
											</Box>
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
								<Box pb={5}>
									<ContentBox className={classes.components}>
										<ColumnChart data={datapointsColumn} />
									</ContentBox>
								</Box>
							</Box>
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
		position: "relative",
		marginTop: "40px",
		minWidth: 180,
	},
	container: {
		height: "100%",
		padding: "20px",
		overflow: "auto",
	},
	components: {
		minHeight: "300px",
		height: "30vh",
	},
	height: {
		height: "100%",
	},
	title: {
		maxHeight: "50px",
	},
});
