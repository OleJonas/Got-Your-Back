import { Box, makeStyles } from "@material-ui/core";

/**
 * 
 * @param props 
 * @returns A component acting as a simple container (box) for different data and graphs.
 */
export const ContentBox: React.FC = (props) => {
	const classes = useStyles();
	return <Box className={classes.root}>{props.children}</Box>;
};
export default ContentBox;

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		height: "90%",
		borderRadius: "5px",
	},
});
