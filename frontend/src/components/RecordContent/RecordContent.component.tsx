import { useEffect, useState } from "react";
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
	const [isRecording, setIsRecording] = useState<Boolean>(props.recording);
	const [buttonPressed, setButtonPressed] = useState<Boolean>(false);

	const onButtonPressed = () => {
		setButtonPressed(true);
		if (!isRecording) {
			fetch("http://localhost:5000/classify/start")
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						setIsRecording(true);
						setButtonPressed(false);
					}
				});
		} else {
			fetch("http://localhost:5000/classify/stop")
				.then((response) => response.json())
				.then((data) => {
					if (!data) {
						setIsRecording(false);
						setButtonPressed(false);
					}
				});
		}
	};

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
				<Grid item xs={12}>
					{isRecording ? <PlayArrowIcon className={classes.recordIcon} /> : <PauseIcon className={classes.recordIcon} />}
				</Grid>
				<Grid item xs={12} className={classes.btn}>
					<Button func={() => onButtonPressed()} disabled={buttonPressed ? true : false}>
						{buttonPressed ? (isRecording ? "Closing down ..." : "Starting up ...") : isRecording ? "Pause Recording" : "Start Recording"}
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
		marginTop: "-40px",
	},
	recordIcon: {
		color: "white",
		fontSize: "200px",
	},
});
