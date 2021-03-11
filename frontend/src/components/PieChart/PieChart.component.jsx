import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";
import { posture_names } from "../../utils/posture_names";

export const PieChart = (props) => {
	const classes = useStyles;

	const processedData = () => {
		const predictions = Object.values(props.data);
		let posture_occurences = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		predictions.forEach((pred) => (posture_occurences[pred] += 1));
		let chartData = [["Posture", "Total amount of predicions"]];
		for (let i = 0; i < posture_occurences.length; i += 1) {
			chartData.push([posture_names[i], posture_occurences[i]]);
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
				chartArea: {
					top: 20,
					left: 20,
					bottom: 20,
					width: "100%",
					height: "100%",
				},
				colors: ["#EDB93C", "#ad519e", "5662AC", "#2d5aad", "#2dabad", "#2dad73", "#b30707", "#dc3912", "#d1660f"],
				legend: {
                    position: "center",
					textStyle: { color: "#FFF" },
				}
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
