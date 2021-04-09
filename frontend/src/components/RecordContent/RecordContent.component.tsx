import { useEffect, useState } from "react";
import { Grid, Box, makeStyles } from "@material-ui/core";

// Components
import { Button } from "../Buttons/Button.component";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

type ClassificationProps = {
	posture: number;
	hasSensors: boolean;
	isRecording: boolean;
	setIsRecording: (bool: boolean) => void;
};

/**
 *
 * @param props
 * @returns A GUI interface that lets the user start and stop recording and classification of data. This is contained inside a material-ui Box.
 */
export const RecordContent: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles();
	const [buttonPressed, setButtonPressed] = useState<Boolean>(false);

	/**
	 * @remarks
	 * Function that uses the API-calls to start and stop classification.
	 */
	const onButtonPressed = () => {
		setButtonPressed(true);
		if (!props.isRecording) {
			fetch("http://localhost:5000/classify/start")
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						props.setIsRecording(true);
					}
				})
				.then(() => {
					setButtonPressed(false);
				});
		} else {
			fetch("http://localhost:5000/classify/stop")
				.then((response) => response.json())
				.then((data) => {
					if (!data) {
						props.setIsRecording(false);
					}
				})
				.then(() => {
					setButtonPressed(false);
				});
		}
	};

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
				<Grid item xs={12}>
					{props.isRecording ? <PlayArrowIcon className={classes.recordIcon} /> : <PauseIcon className={classes.recordIcon} />}
				</Grid>
				<Grid item xs={12} className={classes.btn}>
					<Button func={() => onButtonPressed()} disabled={buttonPressed || !props.hasSensors ? true : false}>
						{props.hasSensors
							? buttonPressed
								? props.isRecording
									? "Closing down ..."
									: "Starting up ..."
								: props.isRecording
								? "Pause Recording"
								: "Start Recording"
							: "Missing sensors"}
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
