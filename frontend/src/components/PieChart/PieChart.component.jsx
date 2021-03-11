import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";

export const PieChart = (props) => {
	const classes = useStyles;

	const processedData = () => {
		const predictions = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		let posture_names = {
			0: "Straight",
			1: "Forward",
			2: "Forward-right",
			3: "Right",
			4: "Backward-right",
			5: "Backward",
			6: "Backward-left",
			7: "Left",
			8: "Forward-left",
		};

		predictions.forEach((pred) => (posture_occurences[pred] += 1));

		let chartData = [["Posture", "Total amount of predicions"]];
		for (let i = 0; i < posture_occurences.length; i += 1) {
			chartData.push([posture_names[i], posture_occurences[i]]);
		}
		console.log(chartData);
		return chartData;
	};

	return (
		<Chart
			width={"100%"}
			height={"100%"}
			chartType="PieChart"
			loader={
				<Typography variant="body1" color="primary">
					Loading Chart
				</Typography>
			}
			data={processedData()}
			options={{
				backgroundColor: "transparent",
				chartArea: { 
                    left: 10, 
                    top: 20, 
                    width: "100%", 
                    height: "100%" },
				colors: ["#EDB93C", "5662AC", "79BA5A", "#348A99"],
				legend: {
					textStyle: { color: "#FFF" },
				},
			}}
			rootProps={{ "data-testid": "1" }}
			className={classes.root}
		/>
	);
};

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		height: "90%",
		borderRadius: "5px",
	},
});
