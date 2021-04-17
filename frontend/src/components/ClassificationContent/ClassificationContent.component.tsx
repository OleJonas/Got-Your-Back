import { Grid, Box, Typography, makeStyles } from "@material-ui/core";
// Components
import { posture_names } from "../../utils/posture_names";

type ClassificationProps = {
	posture: number;
	samplingRate: number;
	recording: boolean;
};

/**
 *
 * @param props
 * @returns A component containing the classification GUI such as the posture recorded, both as a number and a string.
 */
export const ClassificationContent: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles();

	return (
		<Box className={classes.root}>
			<Grid container className={classes.grid} justify="center" alignItems="center">
				<Grid item xs={12}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Typography variant="subtitle1" color="textPrimary">
							{props.recording ? (props.posture === -1 ? "-" : props.posture) : "-"}
						</Typography>
					</Box>
					<Typography variant="h2" color="textPrimary">
						{props.recording ? posture_names[props.posture] : "Not recording"}
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
