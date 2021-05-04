/**
 * @module ReportView
 * @category Views
 */
import { useEffect, useState } from "react";
import {
	Grid,
	Box,
	makeStyles,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar.component";
import Button from "../../components/Buttons/Button.component";
import StatusGraphPopup from "../../components/StatusGraphPopup/StatusGraphPopup.component";
import StatusBar from "../../components/StatusBar/StatusBar.component";
import monthName from "../../utils/dateUtils";
import SERVER_PORT from "../../utils/serverUtils";

type reportData = {
	date: string;
	caption: [string[]];
};

/**
 * This view visualize your reports per month. For every recording you stop, a new feedback/report has to be written. This will show up in this view.
 */
export const ReportView = () => {
	const classes = useStyles();
	const [data, setData] = useState<reportData[]>([]);
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(today.getFullYear() + "," + ("0" + (today.getMonth() + 1)).slice(-2));
	const [availableDates, setAvailableDates] = useState<string[]>();
	const [clickedDate, setClickedDate] = useState<string>();
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	/**
	 * useEffect that fetches available months for dropdown on render.
	 */
	useEffect(() => {
		fetch("http://localhost:" + SERVER_PORT + "/reports/available", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				let res: any[] = [
					<MenuItem key={today.getMonth()} value={today.getFullYear() + "," + ("0" + (today.getMonth() + 1)).slice(-2)}>
						{monthName[("0" + (today.getMonth() + 1)).slice(-2)] + ". " + today.getFullYear()}
					</MenuItem>,
				];
				data["data"].forEach((row: string) => {
					let splitDate: string[] = row.split("-");
					if (splitDate[0] === "" + today.getFullYear() && splitDate[1] === ("0" + (today.getMonth() + 1)).slice(-2)) return;
					res.push(
						<MenuItem key={splitDate[1]} value={splitDate[0] + "," + splitDate[1]}>
							{monthName[splitDate[1]] + ". " + splitDate[0]}
						</MenuItem>
					);
				});
				setAvailableDates(res);
			})
			.catch(function (error) {});
		//eslint-disable-next-line
	}, []);

	/**
	 * useEffect that fetches reports when a new month is selected.
	 */
	useEffect(() => {
		const year = selectedDate.split(",")[0];
		const month = selectedDate.split(",")[1];
		fetch("http://localhost:" + SERVER_PORT + "/reports?year=" + year + "&month=" + month, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				let rows: reportData[] = [];
				data["data"].map((row: any) => rows.push(createData(row[0], row[1])));
				setData(rows);
			})
			.catch(function (error) {
				setData([]);
			});
		//eslint-disable-next-line
	}, [selectedDate]);

	/**
	 * @param {string} date
	 * @param {caption} caption
	 * Method for creating an object of reportdata, in which goes into a row in table.
	 */
	function createData(date: string, caption: any) {
		// const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
		let dateFormatted = new Date(date.replace(" ", "T")).toLocaleDateString("nb-NO");
		return { date: dateFormatted, caption };
	}

	/**
	 * @param {event} event event from dropdown select.
	 * Method for setting selected date based on select.
	 */
	const handleChangeDate = (event: any) => {
		setSelectedDate(event.target.value);
	};

	/**
	 * Method for closing modal
	 */
	const close = () => {
		setModalOpen(false);
	};

	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} className={classes.container}>
					<Grid container justify="center" spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								Reports
							</Typography>
						</Grid>
						<Grid container item xs={11} justify="flex-start">
							<Box my={1} mx={0.5}>
								<FormControl className={classes.dropdown}>
									<InputLabel id="durationLine-controlled-open-select-label">
										<Typography variant="h5" color="textPrimary">
											Date
										</Typography>
									</InputLabel>
									<Select
										labelId="durationLine-controlled-open-select-label"
										id="durationLine-controlled-open-select"
										value={selectedDate}
										// defaultValue={["" + today.getFullYear(), ("0" + (today.getMonth() + 1)).slice(-2)]}
										onChange={handleChangeDate}
										inputProps={{
											classes: {
												icon: classes.icon,
											},
										}}
									>
										{availableDates}
									</Select>
								</FormControl>
							</Box>
							<TableContainer component={Paper} className={classes.tableContainer}>
								<Table className={classes.table} aria-label="caption table">
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell align="left">Caption</TableCell>
											<TableCell align="center">See distribution</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.length === 0 ? (
											<Box m={2}>
												<Typography variant="caption" color="textPrimary">
													No reported data yet ...
												</Typography>
											</Box>
										) : (
											data.map((row) => (
												<TableRow key={row.date}>
													<TableCell
														scope="row" //style={{ verticalAlign: "top" }}
													>
														{row.date}
													</TableCell>
													<TableCell align="left">
														{row.caption.map((element: string[]) => (
															<>
																<Box display="flex" alignItems="center" flexWrap="wrap">
																	<Typography variant="body1" color="textPrimary" style={{ marginRight: "8px" }}>
																		{("0" + new Date(element[0].replace(" ", "T")).getHours()).slice(-2) +
																			":" +
																			("0" + new Date(element[0].replace(" ", "T")).getMinutes()).slice(-2)}
																	</Typography>
																	<Typography variant="body2" color="textPrimary" className={classes.text}>
																		{element[1].replace("&comma;", ",").slice(0, -1)}
																	</Typography>
																	<StatusBar status={parseInt(element[1].slice(-1))} />
																</Box>
															</>
														))}
													</TableCell>
													<TableCell align="center">
														<Button
															func={() => {
																setClickedDate(row.date);
																setModalOpen(true);
															}}
														>
															Graph
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
					{modalOpen ? (
						<StatusGraphPopup
							close={close}
							open={modalOpen}
							year={clickedDate!.split(".")[2]}
							month={clickedDate!.split(".")[1]}
							day={clickedDate!.split(".")[0]}
						/>
					) : (
						<></>
					)}
				</Grid>
			</Grid>
		</>
	);
};
export default ReportView;

const useStyles = makeStyles({
	root: {
		height: "100vh",
	},
	container: {
		height: "100%",
		padding: "20px",
		overflow: "auto",
	},
	table: {
		width: "100%",
	},
	tableContainer: {
		padding: "20px 40px 40px 40px",
	},
	icon: {
		fill: "white",
	},
	dropdown: {
		minWidth: 110,
	},
	text: {
		flexGrow: 1,
	},
});
