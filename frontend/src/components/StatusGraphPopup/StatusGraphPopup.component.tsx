/**
 * @module StatusGraphPopup
 * @category Components
 */
import { useState, useEffect } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LineChart from "../LineChart/LineChart.component";
import SERVER_PORT from "../../utils/serverUtils";
import CloseIcon from "@material-ui/icons/Close";

export type modalProps = {
	year: string;
	month: string;
	day: string;
	open: boolean;
	close: () => void;
};

/**
 *
 * A functional component displaying a modal with classification graph on report day given.
 *
 * @param {modalProps} props {@link modalProps}
 */

export const StatusGraphPopup: React.FC<modalProps> = (props) => {
	const classes = useStyles();
	const [datapoints, setDatapoints] = useState<any>({});

	useEffect(() => {
		fetch(
			"http://localhost:" + SERVER_PORT + "/classifications/reports?year=" + props.year + "&month=" + props.month + "&day=" + props.day,
			{
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}
		)
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
				<DialogTitle id="id">
					<Box display="flex" alignItems="center">
						<Box flexGrow={1}>
							<Typography variant="h2" color="textPrimary">
								{props.day +
									". " +
									new Intl.DateTimeFormat("en-US", { month: "short" }).format(
										new Date(parseInt(props.year), parseInt(props.month) - 1, parseInt(props.day))
									) +
									" " +
									props.year}
							</Typography>
						</Box>
						<Box>
							<IconButton onClick={handleClose}>
								<CloseIcon style={{ color: "white" }} />
							</IconButton>
						</Box>
					</Box>
				</DialogTitle>
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
