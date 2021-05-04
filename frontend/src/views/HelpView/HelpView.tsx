/**
 * @module HelpView
 * @category Views
 */
import { Grid, Box, makeStyles, Typography, AccordionSummary, Accordion, AccordionDetails } from "@material-ui/core";
import { NavBar } from "../../components/NavBar/NavBar.component";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SensorPlacement from "../../assets/Sensor_placement_numerated.svg";

/**
 * This view contains collapsibles with information for helping users out with questions such as where to place sensors and how to connect to sensors etc.
 */
export const HelpView = () => {
	const classes = useStyles();
	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} className={classes.container}>
					<Grid container justify="center" spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h1" color="textPrimary">
								Help
							</Typography>
						</Grid>
						<Grid container item xs={12} justify="center">
							<Grid item xs={11}>
								<Box m={2}>
									<Accordion defaultExpanded={true}>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to connect to sensors">
											<Typography variant="h3" color="textPrimary">
												Sensor placement
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<img src={SensorPlacement} className={classes.svg} alt="Sensor placement" />
												<Typography variant="body1" color="textPrimary">
													The machine learning algorithm used for classification supports one, two and three sensors. Examine the
													illustrations above for instructions on where to place the sensors. It is important that all sensors are placed
													with the text LP-RESEARCH the right way up. Use tape suitable for human skin to ensure that the sensors are held
													in place.
												</Typography>
												<Box mt={1}>
													<Typography variant="h6" color="textPrimary">
														Sensor 1
													</Typography>
													<Typography variant="body1" color="textPrimary">
														The first sensor is to to be placed on the lower neck. When you tilt your head forwards, there should be a bone
														sticking out. Place the sensor here.
													</Typography>
												</Box>
												<Box mt={1}>
													<Typography variant="h6" color="textPrimary">
														Sensor 2
													</Typography>
													<Typography variant="body1" color="textPrimary">
														The second sensor is to be placed on the lower back, in the middle of the lumbar spine.
													</Typography>
												</Box>
												<Box mt={1}>
													<Typography variant="h6" color="textPrimary">
														Sensor 3
													</Typography>
													<Typography variant="body1" color="textPrimary">
														The third sensor is to be placed on the right shoulder where the surface is flat.
													</Typography>
												</Box>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to connect to sensors">
											<Typography variant="h3" color="textPrimary">
												Sitting postures explained
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													This application distinguishes between nine different sitting postures.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Straight</b>} is when you are sitting comfortably straight in your chair.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Forward</b>} is when you are leaning forward.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Forward-right</b>} is when you are leaning forward and to the right.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Right</b>} is when you are leaning to the right.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Backward-right</b>} is when you are leaning backwards and to the right.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Backward</b>} is when you are leaning straight backwards.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Backward-left</b>} is when you are leaning backwards and to the right.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Left</b>} is when you are leaning to the left.
												</Typography>
												<Typography variant="body1" color="textPrimary">
													{<b>Forward-left</b>} is when you are leaning forward and to the left.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to connect to sensors">
											<Typography variant="h3" color="textPrimary">
												Connecting to the sensors
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													To connect to the sensors, go to the "Home" section of the application and click the scan button. This will open
													up a pop-up that will list out all the sensors available to connect to. To connect, click the + sign adjacent to
													the sensor you wish to connect. After connecting, each sensor will be given their own id and a placement. This
													placement tells you where on the body to put the sensor.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to stop collection">
											<Typography variant="h3" color="textPrimary">
												Disconnecting from sensors
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													To disconnect from a sensor, navigate to the "Home" section of the application and find the "Connected sensors"
													module. Here you will see a listing of all currently connected sensors. To disconnect from one, click the yellow
													button with an x in it. Disconnecting sensors while classifying should not be done as this affects the data sent
													to the model, and the button is therefore disabled during live classification.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to start collection">
											<Typography variant="h3" color="textPrimary">
												How to start collection
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													To start collecting data and classifying postures, navigate to the "Home" section of the application and click the
													play button. This will start collecting data from all connected sensors and present the models classifications on
													these data. To stop collecting data, click the same button you clicked to start collecting data that is now
													showing a pause sign.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
											aria-controls="How the classifications are done"
										>
											<Typography variant="h3" color="textPrimary">
												How the classifications are done
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													The classifications are performed by a machine learning model trained on a large dataset of different people in
													the 9 postures available for classification. Currently we are using an RFC model, but we are experimenting with
													several others such as ANN and CNN.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};
export default HelpView;

const useStyles = makeStyles({
	root: {
		height: "100vh",
	},
	container: {
		height: "100%",
		padding: "20px",
		overflow: "auto",
	},
	svg: {
		width: "60%",
		margin: "20px 20%",
	},
});
