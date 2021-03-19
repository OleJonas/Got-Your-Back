import { useEffect, useState } from "react";
import { Grid, Box, makeStyles, Typography } from "@material-ui/core";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import { ContentBox } from "../../components/ContentBox/ContentBox.component";
import { LineChart } from "../../components/LineChart/LineChart.component.jsx";
import { PieChart } from "../../components/PieChart/PieChart.component.jsx";

export const HistoryView = () => {
	const classes = useStyles();
	const [datapoints, setDatapoints] = useState<any>({
		"1998-09-10 08:25:50": "1",
	});

	useEffect(() => {
		fetch("http://localhost:5000/all_predictions", {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setDatapoints(data);
			});
	}, []);

	/*
	useEffect(() => {
		setInterval(() => {
			fetch("http://localhost:5000/prediction", {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					let key = Object.keys(data)[0];
					let val = Object.values(data)[0];
					let tmp = datapoints;
					tmp[key] = val;
					setDatapoints(tmp);
				});
		}, 3000);
	}, []);
    */

	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} className={classes.height}>
					<Grid container spacing={2} className={classes.grid}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								History
							</Typography>
						</Grid>

						<Grid item xs={12} className={classes.components}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									This week
								</Typography>
							</Box>
							<ContentBox>
								<LineChart data={datapoints} />
							</ContentBox>
						</Grid>

						<Grid item xs={12} md={7} className={classes.components}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Most common posture today
								</Typography>
							</Box>
							<ContentBox />
						</Grid>

						<Grid item xs={12} md={5} className={classes.components}>
							<Box mb={0.6}>
								<Typography variant="h3" color="textPrimary">
									Distribution last 30 days
								</Typography>
							</Box>
							<ContentBox>
								<PieChart data={datapoints} />
							</ContentBox>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	grid: {
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
