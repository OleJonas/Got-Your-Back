import { Typography, Fab } from "@material-ui/core";

type ButtonProps = {
	func?: any;
	disabled?: boolean;
};

/**
 * @param props
 * A base button component for use in several different buttons throughout the application
 */
export const Button: React.FC<ButtonProps> = (props) => {
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
export default Button;
