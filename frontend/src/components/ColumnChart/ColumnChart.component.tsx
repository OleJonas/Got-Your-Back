/**
 * @module ColumnChart
 * @category Components
 */
import { Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import postureNames from "../../utils/postureNames";

export type columnChartProps = {
	data: JSON;
	hAxisFormat?: "HH:mm:ss" | "HH:mm" | "dd.mm";
	actions?: []; //["dragToPan", "dragToZoom", "rightClickToReset"]
};

/**
 *
 * A column chart presenting the classification data over a set period of time.
 *
 * @param {columnChartProps} props {@link columnChartProps}
 */
export const ColumnChart: React.FC<columnChartProps> = (props) => {
	/**
	 * @returns An array containing the amount of times each posture is observed in the classification data.
	 */
	const processedData = () => {
		const classifications = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		classifications.forEach((classification) => (posture_occurences[classification] += 1));
		let chartData = [];
		chartData.push(["Postures", "Occurences"]);
		for (let i = 0; i < posture_occurences.length; i += 1) {
			chartData.push([postureNames[i], posture_occurences[i]]);
		}
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
					minorGridlines: { color: "#5e5e5e" },
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					viewWindow: {
						min: 0,
					},
					format: "#",
					gridlines: { color: "#5e5e5e" },
					baselineColor: "#5e5e5e",
				},
				hAxis: {
					minorGridlines: { color: "#5e5e5e" },
					baselineColor: "#5e5e5e",
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
export default ColumnChart;
