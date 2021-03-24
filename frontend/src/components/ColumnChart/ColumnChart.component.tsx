import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import { posture_names } from "../../utils/posture_names";
import { FC } from "react";

type ColumnChartProps = {
	data: JSON;
	hAxisFormat?: "HH:mm:ss" | "HH:mm" | "dd.mm";
	actions: []; //["dragToPan", "dragToZoom", "rightClickToReset"]
};

export const ColumnChart: FC<ColumnChartProps> = (props) => {
	const classes = useStyles();
	let postures = ["Upright", "Forward", "Forward right", "Right", "Backward right", "Backward", "Backward left", "Left", "Forward left"];
	const processedData = () => {
		const predictions = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		predictions.forEach((pred) => (posture_occurences[pred] += 1));
		let chartData = [];
		chartData.push(["posture", "amount"]);
		for (let i = 0; i < posture_occurences.length; i += 1) {
			let tempArr = [postures[i], posture_occurences[i]];
			chartData.push(tempArr);
		}
		console.log(chartData);
		return chartData;
	};

	return (
		<Chart
			width={"100%"}
			height={"100%"}
			chartType="ColumnChart"
			loader={
				<Typography variant="body1" color="primary">
					Loading Chart
				</Typography>
			}
			data={processedData()}
			options={{
				legend: "none",
				chartArea: {
					top: 50,
					left: 50,
					bottom: 50,
					right: 50,
					width: "100%",
					height: "100%",
				},
				vAxis: {
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "#5e5e5e" },
				},
				hAxis: {
					title: "Timestamps",
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "transparent" },
				},
				backgroundColor: "transparent",
				tooltip: { showColorCode: true },
				colors: ["#EDB93C"],
			}}
			rootProps={{ "data-testid": "1" }}
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
