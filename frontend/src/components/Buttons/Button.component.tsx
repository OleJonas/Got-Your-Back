/**
 * @module Button
 * @category Components
 */
import { Typography, Fab } from "@material-ui/core";

export type ButtonProps = {
	func?: any;
	disabled?: boolean;
};

/**
 *
 * A base button component for use in several different buttons throughout the application.
 *
 * @param {ButtonProps} props {@link ButtonProps}
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
