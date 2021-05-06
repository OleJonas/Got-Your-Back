/**
 * @module HomeShade
 * @category Components
 */
import { useState } from "react";
import { Box, Grid, IconButton, makeStyles } from "@material-ui/core";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Logo from "../../assets/Logo.svg";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

/**
 * A foreground that is pulled back when clicking any button. This serves as the "landing page".
 */
export const HomeShade: React.FC = () => {
	const classes = useStyles();
	const [isVisible, setIsVisible] = useState(true);

	return (
		<Box className={`${classes.root} ${isVisible ? "" : classes.out}`} onClick={() => setIsVisible(false)}>
			<KeyboardEventHandler handleKeys={["enter", "space"]} onKeyEvent={() => setIsVisible(false)} />
			<Grid container justify="center" className={classes.container}>
				<Grid item xs={10} className={classes.gridLogo}>
					<img src={Logo} alt="logo" className={classes.logo} />
				</Grid>
				<Grid item xs={10} className={classes.gridIcon}>
					<IconButton aria-label="Go to home" onClick={() => setIsVisible(false)}>
						<ExpandMoreIcon className={classes.icon} />
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};
export default HomeShade;

const useStyles = makeStyles({
	root: {
		position: "fixed",
		background: "linear-gradient(90deg, #0f3762 0%, rgba(64, 98, 128, 0.9) 100%),#1c355b",
		height: "100vh",
		width: "100vw",
		zIndex: 1,
	},
	container: {
		position: "relative",
		height: "100%",
		width: "100%",
		textAlign: "center",
	},
	gridLogo: {
		width: "70%",
		height: "70%",
	},
	logo: {
		height: "100%",
		width: "100%",
	},
	gridIcon: {
		width: "20%",
		height: "20%",
	},
	icon: {
		height: "5rem",
		width: "5rem",
		color: "white",
	},
	"@keyframes out": {
		"0%": {
			transform: "translate(0, 0)",
		},
		"100%": {
			transform: "translate(0, -250vh)",
		},
	},
	out: {
		animation: "$out 2.5s",
		animationDirection: "alternate",
		animationFillMode: "forwards",
	},
});
