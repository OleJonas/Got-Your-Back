import { FC, useState, useEffect } from "react";
import { Box, Dialog, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import LineChart from "../LineChart/LineChart.component";

type modalProps = {
	year: string;
	month: string;
	day: string;
	open: boolean;
	close: () => void;
};

export const StatusGraphPopup: FC<modalProps> = (props) => {
	const classes = useStyles();
	const [datapoints, setDatapoints] = useState<any>({});

	useEffect(() => {
		fetch("http://localhost:5000/classifications/reports?year=" + props.year + "&month=" + props.month + "&day=" + props.day, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setDatapoints(data);
			})
			.catch(function (error) {});
		//eslint-disable-next-line
	}, []);

	const handleClose = () => {
		props.close();
	};

	return (
		<Box>
			<Dialog
				classes={{ paper: classes.paper }}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={props.open}
				className={classes.root}
			>
				<DialogContent className={classes.dialogContent} dividers>
					<LineChart
						duration={1}
						data={datapoints}
						year={props.year}
						month={parseInt(props.month) - 1}
						day={props.day}
						actions={["dragToZoom", "rightClickToReset"]}
					/>
				</DialogContent>
			</Dialog>
		</Box>
	);
};
export default StatusGraphPopup;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		textAlign: "center",
		borderRadius: "0",
	},
	dialogContent: {
		height: "100px",
	},
	paper: {
		height: "440px",
		width: "90%",
	},
});
