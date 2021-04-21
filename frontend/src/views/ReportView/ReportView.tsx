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
} from "@material-ui/core";
import { useCallback, useEffect, useMemo, useState } from "react";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";

type reportData = {
	date: string;
	caption: string;
};

export const ReportView = () => {
	const classes = useStyles();
	const [selectedDate, setSelectedDate] = useState([2021, 4]);
	const [data, setData] = useState<reportData[]>();

	useEffect(() => {
		fetch("http://localhost:5000/reports?year=" + selectedDate[0] + "&month=" + selectedDate[1], {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				let rows: reportData[] = [];
				data["data"].map((row: string[]) => rows.push(createData(row[0], row[1])));
				setData(rows);
			})
			.catch(function (error) {
				console.log(error);
			});
		//eslint-disable-next-line
	}, [selectedDate]);

	function createData(date: string, caption: string) {
		const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
		let dateFormatted = new Date(date.replace(" ", "T")).toLocaleDateString("nb-NO");
		return { date: dateFormatted, caption };
	}

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
						<Grid container item xs={11} justify="center">
							<TableContainer component={Paper} className={classes.tableContainer}>
								<Table className={classes.table} aria-label="caption table">
									<caption>Table showing reports for each record session.</caption>
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell align="left">Caption</TableCell>
											<TableCell align="right">Distribution</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data ? (
											data.map((row) => (
												<TableRow key={row.date}>
													<TableCell scope="row">{row.date}</TableCell>
													<TableCell align="left" component="th">
														{row.caption.replace("&comma;", ",")}
													</TableCell>
													<TableCell align="right">{1}</TableCell>
												</TableRow>
											))
										) : (
											<Box m={2}>
												<Typography variant="caption" color="textPrimary">
													No reported data yet ...
												</Typography>
											</Box>
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
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
		padding: "20px 40px",
	},
});
