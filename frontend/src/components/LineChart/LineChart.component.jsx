import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import { posture_names } from "../../utils/posture_names";

// eslint-disable-next-line
type LineChartProps = {
	data: JSON,
	hAxisFormat: "HH:mm:ss" | "HH:mm" | "dd.mm",
	actions: [], //["dragToPan", "dragToZoom", "rightClickToReset"]
};

export const LineChart = (props) => {
	const classes = useStyles;

	const processedData = () => {
		const timestamps = Object.keys(props.data);
		const predictions = Object.values(props.data);
		const chartData = [
			[
				{ type: "date", label: "Timestamp" },
				{ type: "number", label: "Value" },
			],
		];
		for (let i = 0; i < timestamps.length; i += 1) {
			chartData.push([new Date(timestamps[i].replace(" ", "T")), predictions[i]]);
		}
		return chartData;
	};

	return (
		<Chart
			width={"100%"}
			height={"100%"}
			chartType="LineChart"
			loader={
				<Typography variant="body1" color="primary">
					Loading Chart
				</Typography>
			}
			data={processedData()}
			options={{
				chartArea: {
					right: 40,
					top: 50,
					bottom: 50,
					left: 110,
				},
				hAxis: {
					title: "Timestamps",
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "transparent" },
					format: props.hAxisFormat ? props.hAxisFormat : "YY-MM-dd HH:mm",
				},
				vAxis: {
					ticks: [
						{ v: 0, f: posture_names[0] },
						{ v: 1, f: posture_names[1] },
						{ v: 2, f: posture_names[2] },
						{ v: 3, f: posture_names[3] },
						{ v: 4, f: posture_names[4] },
						{ v: 5, f: posture_names[5] },
						{ v: 6, f: posture_names[6] },
						{ v: 7, f: posture_names[7] },
						{ v: 8, f: posture_names[8] },
					],
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "#5e5e5e" },
				},
				explorer: {
					actions: props.actions ? props.actions : ["dragToPan", "rightClickToReset"],
				},
				backgroundColor: "transparent",
				colors: ["#EDB93C"],
				legend: { position: "none" },
			}}
			rootProps={{ "data-testid": "1" }}
			className={classes.root}
		/>
	);
};
export default LineChart;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		height: "90%",
		borderRadius: "5px",
	},
});
