import { makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { posture_names } from "../../utils/posture_names";

// type LineChartProps, = {
// 	data: JSON,
// 	hAxisFormat?: "HH:mm:ss" | "HH:mm" | "dd.mm",
// 	actions?: [], //["dragToPan", "dragToZoom", "rightClickToReset"]
// 	type?: "1 day" | "7 days" | "14 days" | "30 days",
// };

/**
 *
 * @param {*} props
 * @returns A LineChart that updates with new classification data received.
 */
export const LineChart = (props) => {
	const classes = useStyles;
	const [minTime, setMinTime] = useState(new Date());
	const [maxTime, setMaxTime] = useState(new Date());

	useEffect(() => {
		let minDate = new Date();
		let maxDate = new Date();

		if (props.duration === 1) {
			setMinTime(new Date(minDate.setHours(minDate.getHours() - 1)));
			setMaxTime(maxDate);
		} else {
			setMinTime(new Date(minDate.setDate(minDate.getDate() - (props.duration + 1))));
			setMaxTime(new Date(maxDate.setDate(maxDate.getDate() - 1)));
		}
	}, [props.data]);

	/**
	 *
	 * @returns The data to be used in the rendering of the component. The data is structured as an array of tuples each containing the time of the classification and the classification itself.
	 */
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
					format: props.duration > 1 ? "YYYY-MM-dd" : "HH:mm",
					viewWindow: {
						min: minTime,
						max: maxTime,
					},
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
