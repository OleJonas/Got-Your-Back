import { Grid, Box, makeStyles, Typography, IconButton } from "@material-ui/core";
import loader from "../../assets/loader_white.svg";

// Components
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

type ClassificationProps = {
	posture: number;
	hasSensors: boolean;
	isRecording: boolean;
	setIsRecording: (bool: boolean) => void;
	buttonPressed: boolean;
	setButtonPressed: (bool: boolean) => void;
};

/**
 *
 * @param props
 * @returns A GUI interface that lets the user start and stop recording and classification of data. This is contained inside a material-ui Box.
 */
export const RecordContent: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles(props);

	/**
	 * @remarks
	 * Function that uses the API-calls to start and stop classification.
	 */
	const onButtonPressed = () => {
		props.setButtonPressed(true);
		if (!props.isRecording) {
			fetch("http://localhost:5000/classify/start")
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						props.setIsRecording(true);
					}
				});
		} else {
			fetch("http://localhost:5000/classify/stop")
				.then((response) => response.json())
				.then((data) => {
					console.log("data:" + data);
					if (!data) {
						props.setIsRecording(false);
					}
				});
		}
	};

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
				<Grid item xs={12}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<IconButton onClick={onButtonPressed} className={classes.btn} disabled={!props.hasSensors}>
							{console.log(props.buttonPressed)}
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
		backgroundColor: (props: ClassificationProps) => (!props.hasSensors ? "rgba(60, 60, 60, 0.5)" : theme.palette.primary.main) as string,
		margin: "20px",
		"&:hover": {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	recordIcon: {
		color: (props: ClassificationProps) => (!props.hasSensors ? "#aaa" : "#fff") as string,
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
