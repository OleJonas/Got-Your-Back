import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";

// Components
import { Button } from "../Buttons/Button.component";
import { posture_names } from "../../utils/posture_names";

type ClassificationProps = {
	posture: number;
	samplingRate: number;
	recording: boolean;
};

export const ClassificationBox: React.FC<ClassificationProps> = (props) => {
	const classes = useStyles();
	const [startRecordRequested, setStartRecordRequested] = useState<any>(false);

	const onStartPressed = () => {
		setStartRecordRequested(true);

		//Send request til server
	};

	return (
		<Box className={classes.root}>
			<Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
				<Grid item xs={12}>
					<Button func={() => onStartPressed()} disabled={startRecordRequested === true ? true : false}>
						{startRecordRequested === true ? "Starting up ..." : props.recording === true ? "Stop recording" : "Start recording"}
					</Button>
				</Grid>

				<Grid item xs={7}>
					<Typography variant="subtitle1" color="textPrimary">
						{props.posture}
					</Typography>
					<Typography variant="h2" color="textPrimary">
						{posture_names[props.posture]}
					</Typography>
				</Grid>

				<Grid item xs={5}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Typography variant="subtitle2" color="textPrimary">
							{props.samplingRate}
						</Typography>
						<Box ml={1}>
							<Typography variant="h2" color="textPrimary">
								{"Hz"}
							</Typography>
						</Box>
					</Box>
					<Button>Change</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

const useStyles = makeStyles({
	root: {
		height: "100%",
	},
	grid: {
		height: "100%",
		textAlign: "center",
	},
	btn: {
		margin: "auto",
	},
});
