import { Grid, Box, makeStyles, Typography } from "@material-ui/core";

// Components
import { NavBar } from "../../components/NavBar/NavBar.component";
import TeamPortrait from "../../assets/Portrait1.jpg";

export const AboutView = () => {
	const classes = useStyles();
	return (
		<>
			<Grid container justify="center" className={classes.root}>
				<Grid item xs={2} md={1}>
					<NavBar />
				</Grid>
				<Grid item xs={10} md={11} className={classes.container}>
					<Box m={2}>
						<Grid container justify="center" spacing={4}>
							<Grid item xs={12}>
								<Typography variant="h1" color="textPrimary">
									About
								</Typography>
							</Grid>

							<Grid item xs={8} lg={6} className={classes.components}>
								<Box>
									<img src={TeamPortrait} className={classes.img} alt="Portrait" />
								</Box>
								<Box mt={3} textAlign="center">
									<Typography variant="h2" color="textPrimary">
										The story behind GYB
									</Typography>
								</Box>
								<Box mt={2}>
									<Typography variant="body1" color="textPrimary">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
										aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
										occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</Box>
								<Box mt={1} textAlign="right">
									<Typography variant="overline" color="textPrimary">
										- Sylfrekke Martin, chad Jonas & derp Simon
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</>
	);
};

const useStyles = makeStyles({
	root: {
		height: "100vh",
	},
	container: {
		height: "100%",
		overflow: "auto",
	},
	components: {
		minHeight: "40vh",
		borderRadius: "25px",
	},
	img: {
		width: "100%",
	},
});
