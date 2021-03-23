import { useState } from "react";
import { Grid, Box, makeStyles } from "@material-ui/core";

// Components
import { Button } from "../Buttons/Button.component";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

type ClassificationProps = {
	posture: number;
	samplingRate: number;
	recording: boolean;
};

export const RecordContent: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles();
	const [startRecordRequested, setStartRecordRequested] = useState<any>(false);

	const onStartPressed = () => {
		if (!props.recording) {
			setStartRecordRequested(true);
		}
		//Send request til server
	};

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
				<Grid item xs={12}>
					{props.recording ? <PlayArrowIcon className={classes.recordIcon} /> : <PauseIcon className={classes.recordIcon} />}
				</Grid>
				<Grid item xs={12}>
					<Button func={() => onStartPressed()} disabled={startRecordRequested ? true : false}>
						{startRecordRequested ? "Starting up ..." : props.recording ? "Stop recording" : "Start recording"}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};
export default RecordContent;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	grid: {
		height: "100%",
		textAlign: "center",
	},
	btn: {
		marginTop: "0px",
	},
	recordIcon: {
		color: "white",
		fontSize: "200px",
	},
});
