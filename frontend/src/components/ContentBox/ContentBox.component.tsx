import * as React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const ContentBox: React.FC = (props) => {
	const classes = useStyles();
	return <Box className={classes.root}>{props.children}</Box>;
};

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		height: "90%",
		borderRadius: "5px",
	},
});
