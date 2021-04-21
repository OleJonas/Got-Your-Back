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
import React, { useEffect, useState } from "react";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";

type reportData = {
	date: string;
	caption: string;
};



function formatMonthYear(year: number, month: number){
	return 
}

export const ReportView = () => {
	const classes = useStyles();
	const [data, setData] = useState<reportData[]>();
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(["" + today.getFullYear(), ("0" + (today.getMonth() + 1)).slice(-2)]);
	const [availableDates, setAvailableDates] = useState<object[]>();

	console.log(selectedDate);

	useEffect(() => {
		fetch("http://localhost:5000/reports/available", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				let res: any[] = [];
				data["data"].map((row: string) => {
					let splitDate: string[] = row.split("-");
					res.push(<MenuItem value={[splitDate[0], splitDate[1]]}>{splitDate[1] + "." + splitDate[0]}</MenuItem>);
				});
				console.log(res);
				setAvailableDates(res);
			})
			.catch(function (error) {});
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		fetch("http://localhost:5000/reports?year=" + selectedDate[0] + "&month=" + selectedDate[1], {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				let rows: reportData[] = [];
				data["data"].map((row: string[]) => rows.push(createData(row[0], row[1])));
				setData(rows);
			})
			.catch(function (error) {});
		//eslint-disable-next-line
	}, [selectedDate]);

	function createData(date: string, caption: string) {
		const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
		let dateFormatted = new Date(date.replace(" ", "T")).toLocaleDateString("nb-NO");
		return { date: dateFormatted, caption };
	}

	const handleChangeDate = (event: any) => {
		setSelectedDate(event.target.value);
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
		padding: "20px 40px 40px 40px",
	},
	icon: {
		fill: "white",
	},
	dropdown: {
		minWidth: 100,
	},
});
