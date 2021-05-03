import { Grid, Box, Typography, makeStyles } from "@material-ui/core";
import postureNames from "../../utils/postureNames";

type ClassificationProps = {
	posture: number;
	samplingRate: number;
	recording: boolean;
};

/**
 * @param {ClassificationProps} props
 * A component containing the classification GUI such as the posture recorded, both as a number and a string.
 */
export const ClassificationContent: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles();

	return (
		<Box className={classes.root}>
			<Grid container className={classes.grid} justify="center" alignItems="center">
				<Grid item xs={12}>
					<Typography variant="h2" color="textPrimary">
						{props.recording ? postureNames[props.posture] : "Not recording"}
					</Typography>
				</Grid>
			</Grid>
		</Box>
	);
};
export default ClassificationContent;

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	grid: {
		height: "100%",
		textAlign: "center",
	},
});
