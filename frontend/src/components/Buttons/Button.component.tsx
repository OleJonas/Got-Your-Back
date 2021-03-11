import { FC } from "react";
import { Typography, Fab } from "@material-ui/core";

type ButtonProps = {
	func?: any;
	disabled?: boolean;
};

export const Button: FC<ButtonProps> = (props) => {
	return (
		<Fab
			variant="extended"
			color="primary"
			onClick={props.func === undefined ? () => {} : props.func}
			disabled={props.disabled ? true : false}
		>
			<Typography variant="button" color="textPrimary">
				{props.children}
			</Typography>
		</Fab>
	);
};
