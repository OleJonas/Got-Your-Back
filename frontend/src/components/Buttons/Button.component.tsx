import { FC } from "react";
import { Typography, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export type ButtonProps = {
	func?: any;
	id?: string;
	disabled?: boolean;
	width?: string;
	radius?: string;
	height?: string;
};

export const Button: FC<ButtonProps> = (props) => {
	const useStyles = makeStyles({
		btn: {
			width: props.width,
			borderRadius: props.radius,
			height: props.height,
		},
	});

	const classes = useStyles();

	return (
		<Fab
			variant="extended"
			color="primary"
			id={props.id}
			className={classes.btn}
			onClick={props.func === undefined ? () => {} : props.func}
			disabled={props.disabled ? true : false}
		>
			<Typography variant="button" color="textPrimary">
				{props.children}
			</Typography>
		</Fab>
	);
};
