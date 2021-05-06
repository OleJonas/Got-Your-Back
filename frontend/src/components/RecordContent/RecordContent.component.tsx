/**
 * @module RecordContent
 * @category Components
 */
import { useState } from "react";
import { Grid, Box, makeStyles, Typography, IconButton } from "@material-ui/core";
import loader from "../../assets/loader_white.svg";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StatusPopup from "../StatusPopup/StatusPopup.component";
import SERVER_PORT from "../../utils/serverUtils";

export type classificationProps = {
	posture: number;
	hasSensors: boolean;
	isRecording: boolean;
	setIsRecording: (bool: boolean) => void;
	buttonPressed: boolean;
	setButtonPressed: (bool: boolean) => void;
};

/**
 *
 * A GUI interface that lets the user start and stop recording and classification of data. This is contained inside a material-ui Box.
 *
 * @param {classificationProps} props {@link classificationProps}
 */
export const RecordContent: React.FC<classificationProps> = (props) => {
	const classes = useStyles(props);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	/**
	 * Function that uses the API-calls to start and stop classification.
	 */
	const onButtonPressed = () => {
		props.setButtonPressed(true);
		if (!props.isRecording) {
			fetch("http://localhost:" + SERVER_PORT + "/classify/start")
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						props.setIsRecording(true);
					}
				});
		} else {
			fetch("http://localhost:" + SERVER_PORT + "/classify/stop")
				.then((response) => response.json())
				.then((data) => {
					if (!data) {
						props.setIsRecording(false);
					}
				});
			setModalOpen(true);
		}
	};

	const close = () => {
		setModalOpen(false);
	};

	return (
		<Box className={classes.root}>
			<Grid container className={classes.grid} justify="center" alignItems="center">
				<Grid item xs={12}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<IconButton onClick={onButtonPressed} className={classes.btn} disabled={!props.hasSensors || props.buttonPressed}>
							{props.buttonPressed === true ? (
								<img src={loader} className={classes.loading} alt="Rotating loading icon" />
							) : !props.isRecording ? (
								<PlayArrowIcon className={classes.recordIcon} />
							) : (
								<PauseIcon className={classes.recordIcon} />
							)}
						</IconButton>
					</Box>
					<Typography variant="h2" color="textPrimary">
						{props.hasSensors ? (props.isRecording ? "Recording" : "Paused") : "Missing sensors"}
					</Typography>
					{modalOpen ? <StatusPopup close={close} open={modalOpen}></StatusPopup> : <></>}
				</Grid>
			</Grid>
		</Box>
	);
};
export default RecordContent;

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	grid: {
		height: "100%",
		textAlign: "center",
	},
	btn: {
		backgroundColor: (props: classificationProps) => (!props.hasSensors ? "rgba(60, 60, 60, 0.5)" : theme.palette.primary.main) as string,
		margin: "20px",
		"&:hover": {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	recordIcon: {
		color: (props: classificationProps) => (!props.hasSensors ? "#aaa" : "#fff") as string,
		fontSize: "100px",
	},
	"@keyframes rotate": {
		from: {
			transform: "rotate(0)",
		},
		to: {
			transform: "rotate(360deg)",
		},
	},
	loading: {
		animation: "1s linear infinite $rotate",
		width: "100px",
		height: "100px",
	},
}));
