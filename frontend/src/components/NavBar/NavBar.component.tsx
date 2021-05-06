/**
 * @module NavBar
 * @category Components
 */
import { Grid, Box, Typography, Link, makeStyles } from "@material-ui/core";
import Logo from "../../assets/Logo.svg";

/**
 * A vertical navbar used in every view of the application.
 */
export const NavBar: React.FC = () => {
	const classes = useStyles();
	return (
		<Box className={classes.root}>
			<Grid container justify="center" className="grid">
				<Grid item xs={10}>
					<Link href="#/">
						<Box mt={1}>
							<img src={Logo} alt="logo" />
						</Box>
					</Link>
				</Grid>

				<Grid item xs={10}>
					<Link href="#/">
						<Box m={1.2}>
							<Typography variant="caption" color={window.location.href.split("/#")[1] === "/" ? "primary" : "textPrimary"}>
								Home
							</Typography>
						</Box>
					</Link>
				</Grid>
				<Grid item xs={10}>
					<Link href="#/history">
						<Box m={1.2}>
							<Typography variant="caption" color={window.location.href.split("/#")[1] === "/history" ? "primary" : "textPrimary"}>
								History
							</Typography>
						</Box>
					</Link>
				</Grid>
				<Grid item xs={10}>
					<Link href="#/report">
						<Box m={1.2}>
							<Typography variant="caption" color={window.location.href.split("/#")[1] === "/report" ? "primary" : "textPrimary"}>
								Reports
							</Typography>
						</Box>
					</Link>
				</Grid>
				<Grid item xs={10}>
					<Link href="#/help">
						<Box m={1.2}>
							<Typography variant="caption" color={window.location.href.split("/#")[1] === "/help" ? "primary" : "textPrimary"}>
								Help
							</Typography>
						</Box>
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
};
export default NavBar;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		minHeight: "100%",
		textAlign: "center",
	},
});
