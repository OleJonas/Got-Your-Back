import { FC } from "react";
import { Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import { posture_names } from "../../utils/posture_names";

type ColumnChartProps = {
	data: JSON;
	hAxisFormat?: "HH:mm:ss" | "HH:mm" | "dd.mm";
	actions: []; //["dragToPan", "dragToZoom", "rightClickToReset"]
};

export const ColumnChart: FC<ColumnChartProps> = (props) => {
	let postures = ["Upright", "Forward", "Forward right", "Right", "Backward right", "Backward", "Backward left", "Left", "Forward left"];
	const processedData = () => {
		const classifications = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		classifications.forEach((classification) => (posture_occurences[classification] += 1));
		let chartData = [["Posture", "Amount"]];
		for (let i = 0; i < posture_occurences.length; i += 1) {
			chartData.push([postures[i], posture_occurences[i]]);
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
