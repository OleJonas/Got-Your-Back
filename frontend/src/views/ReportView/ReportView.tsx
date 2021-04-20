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

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";

export const ReportView = () => {
	const classes = useStyles();

	function createData(date: string, caption: string) {
		return { date, caption};
	}

	const rows = [
		createData("26.03.99", "I dag har jeg ganske vondt faktisk"),
		createData("26.03.99", "I dag har jeg ganske vondt faktisk"),
		createData("26.03.99", "I dag har jeg ganske vondt faktisk"),
		createData("26.03.99", "I dag har jeg ganske vondt faktisk"),
		createData("26.03.99", "I dag har jeg ganske vondt faktisk"),
	];
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
										{rows.map((row) => (
											<TableRow key={row.date}>
												<TableCell scope="row">
													{row.date}
												</TableCell>
												<TableCell align="left" component="th">{row.caption}</TableCell>
												<TableCell align="right">{1}</TableCell>
											</TableRow>
										))}
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
    }
});
