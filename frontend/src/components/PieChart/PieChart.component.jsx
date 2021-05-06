/**
 * @module PieChart
 * @category Components
 */
import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import postureNames from "../../utils/postureNames";

/**
 *
 * A customized piechart from google-react-charts
 *
 * @param props props
 */
export const PieChart = (props) => {
	const classes = useStyles;

	const processedData = () => {
		const classifications = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		classifications.forEach((classification) => (posture_occurences[classification] += 1));
		let chartData = [["Posture", "Total amount of predicions"]];
		for (let i = 0; i < posture_occurences.length; i += 1) {
			chartData.push([postureNames[i], posture_occurences[i]]);
		}
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
				pieSliceBorderColor: "transparent",
				chartArea: {
					top: 20,
					left: 20,
					bottom: 20,
					width: "100%",
					height: "100%",
				},
				tooltip: { showColorCode: true },
				colors: ["#EDB93C", "#ad519e", "5662AC", "#2d5aad", "#2dabad", "#2dad73", "#b30707", "#dc3912", "#d1660f"],
				legend: {
					textStyle: { color: "#FFF" },
					alignment: "center",
				},
			}}
			rootProps={{ "data-testid": "1" }}
			className={classes.root}
		/>
	);
};
export default PieChart;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		height: "90%",
		borderRadius: "5px",
	},
});
