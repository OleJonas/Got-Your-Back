/**
 * @module LineChart
 * @category Components
 */
import { makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import postureNames from "../../utils/postureNames";

/**
 *
 * A LineChart that updates with new classification data received.
 *
 * @param props props
 */
export const LineChart = (props) => {
	const classes = useStyles;
	const [minTime, setMinTime] = useState(new Date());
	const [maxTime, setMaxTime] = useState(new Date());

	/**
	 * useEffect hook for setting the right interval along the x-axis.
	 * props.duration: 0 means its for HomeView, 1 means its for ReportView
		else its for historyview.
	 */
	useEffect(() => {
		let minDate = new Date();
		let maxDate = new Date();
		if (props.duration === 0) {
			setMinTime(new Date(minDate.setHours(minDate.getHours() - 1)));
			setMaxTime(maxDate);
		} else if (props.duration === 1) {
			setMinTime(new Date(props.year, props.month, props.day, 0, 0, 0, 0));
			setMaxTime(new Date(props.year, props.month, props.day, 24, 0, 0, 0));
		} else {
			setMinTime(new Date(minDate.setDate(minDate.getDate() - (props.duration + 1))));
			setMaxTime(new Date(maxDate.setDate(maxDate.getDate() - 1)));
		}
		//eslint-disable-next-line
	}, [props.data]);

	/**
	 *
	 * @param isHistoryView Boolean saying if its meant for HistoryView or not.
	 * @param timestamp Timestamp on format "dd-mm.YYYY"
	 * @param classification Classification as int
	 * @returns HTML string for react-google-chart tooltip
	 */
	const createTooltip = (isHistoryView, timestamp, classification) => {
		const date = new Date(timestamp.replace(" ", "T"));
		let firstRow = '<p style="font-family:nunito;padding:0 10px;color:black">';
		if (isHistoryView) {
			firstRow +=
				"<b>" +
				new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date) +
				" " +
				date.getDate() +
				". " +
				new Intl.DateTimeFormat("en-US", { month: "short" }).format(date) +
				" " +
				date.getFullYear() +
				"</b>";
		} else {
			const hoursTwoDigitFormat = ("0" + date.getHours()).slice(-2);
			const minutesTwoDigitFormat = ("0" + date.getMinutes()).slice(-2);
			const secondsTwoDigitFormat = ("0" + date.getSeconds()).slice(-2);
			firstRow += "<b>" + hoursTwoDigitFormat + ":" + minutesTwoDigitFormat + ":" + secondsTwoDigitFormat + "</b>";
		}
		let secondRow = postureNames[classification];
		return firstRow + "<br/>" + secondRow + "</p>";
	};

	/**
	 *
	 * @returns The data to be used in the rendering of the component. The data is structured as an array of tuples each containing the time of the classification and the classification itself.
	 */
	const processedData = () => {
		const timestamps = Object.keys(props.data);
		const classifications = Object.values(props.data);
		const chartData = [
			[
				{ type: "date", label: "Timestamp" },
				{ type: "number", label: "Value" },
				{ type: "string", role: "tooltip", p: { html: true } },
			],
		];
		for (let i = 0; i < timestamps.length; i += 1) {
			chartData.push([
				new Date(timestamps[i].replace(" ", "T")),
				classifications[i],
				createTooltip(props.duration > 1, timestamps[i], classifications[i]),
			]);
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
				pointSize: 5,
				hAxis: {
					title: "Timestamps",
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "transparent" },
					format: props.duration > 1 ? "MMM dd" : "HH:mm",
					viewWindow: {
						min: minTime,
						max: maxTime,
					},
				},
				vAxis: {
					ticks: [
						{ v: 0, f: postureNames[0] },
						{ v: 1, f: postureNames[1] },
						{ v: 2, f: postureNames[2] },
						{ v: 3, f: postureNames[3] },
						{ v: 4, f: postureNames[4] },
						{ v: 5, f: postureNames[5] },
						{ v: 6, f: postureNames[6] },
						{ v: 7, f: postureNames[7] },
						{ v: 8, f: postureNames[8] },
					],
					textStyle: { color: "#FFF" },
					titleTextStyle: { color: "#FFF" },
					gridlines: { color: "#5e5e5e" },
				},
				crosshair: { orientation: "vertical", trigger: "focus" },
				explorer: {
					actions: props.actions ? props.actions : ["dragToPan", "rightClickToReset"],
				},
				backgroundColor: "transparent",
				colors: ["#EDB93C"],
				legend: { position: "none" },
				tooltip: { isHtml: true },
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
