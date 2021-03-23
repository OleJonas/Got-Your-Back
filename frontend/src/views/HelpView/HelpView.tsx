import { Grid, Box, makeStyles, Typography, AccordionSummary, Accordion, AccordionDetails } from "@material-ui/core";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to connect to sensors">
											<Typography variant="h4" color="textPrimary">
												How to connect to sensors
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													{" "}
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
													magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
													consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
													Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to start collection">
											<Typography variant="h4" color="textPrimary">
												How to start collection
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													{" "}
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
													magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
													consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
													Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />} aria-controls="How to stop collection">
											<Typography variant="h4" color="textPrimary">
												How to stop collection
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													{" "}
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
													magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
													consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
													Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
												</Typography>
											</Box>
										</AccordionDetails>
									</Accordion>
								</Box>

								<Box m={2}>
									<Accordion>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
											aria-controls="How to navigate in diagrams"
										>
											<Typography variant="h4" color="textPrimary">
												How to connect to sensors
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													{" "}
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
													magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
													consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
													Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
											<Typography variant="h4" color="textPrimary">
												How the classifications are done
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Box>
												<Typography variant="body1" color="textPrimary">
													{" "}
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
													magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
													consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
													Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
});
