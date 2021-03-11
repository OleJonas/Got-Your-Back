import { makeStyles, Typography } from "@material-ui/core";
import { Chart } from "react-google-charts";

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
        hAxis: {
          title: "Timestamps",
          textStyle: { color: "#FFF" },
          titleTextStyle: { color: "#FFF" },
          gridlines: { color: "transparent" },
        },
        vAxis: {
          title: "Positions",
          minValue: 0,
          maxValue: 8,
          textStyle: { color: "#FFF" },
          titleTextStyle: { color: "#FFF" },
        },
        backgroundColor: "transparent",
        colors: ["#EDB93C"],
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
