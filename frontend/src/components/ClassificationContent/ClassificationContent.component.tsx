/**
 * @module ClassificationContent
 * @category Components
 */
import { Grid, Box, Typography, makeStyles } from "@material-ui/core";
import postureNames from "../../utils/postureNames";

export type classificationProps = {
	posture: number;
	samplingRate: number;
	recording: boolean;
};

/**
 * 
 * A component containing the classification GUI such as the posture recorded, both as a number and a string.
 * 
 * @param {classificationProps} props {@link classificationProps}
*/
export const ClassificationContent: React.FC<classificationProps> = (props) => {
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
