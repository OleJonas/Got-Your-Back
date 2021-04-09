import { FC, useState, useEffect } from "react";
import { Box, ButtonBase, Typography, makeStyles } from "@material-ui/core";
import loader from "../../assets/loader_black.svg";

// Components
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

type ButtonProps = {
	type: "connect" | "disconnect";
	func?: any;
	id?: string;
	disabled?: boolean;
	status?: boolean;
	loading?: boolean;
};

/**
 *
 * @param props
 * @returns A button component specifically used for sensor setup - connecting and disconnecting.
 */
export const SensorButton: FC<ButtonProps> = (props) => {
	const classes = useStyles(props);
	const [status, setStatus] = useState<boolean>(false);


	useEffect(() => {
		if (props.status === true) {
			setStatus(true);
		} else {
			setStatus(false);
		}
	}, [props.status]);

	return (
		<Box>
			<ButtonBase
				className={classes.btn}
				id={props.id}
				onClick={props.func === undefined ? () => {} : props.func}
				disabled={props.disabled ? true : false}
			>
				<Typography variant="button" color="textSecondary">
					{props.type === "connect" ? (
						status ? (
							<CheckIcon className={classes.icon} />
						) : props.loading ? (
							<img src={loader} className={classes.loading} alt="Rotating loading icon"></img>
						) : (
							<AddIcon className={classes.icon} />
						)
					) : !status ? (
						<ClearIcon className={classes.icon} />
					) : (
						<AddIcon className={classes.icon} />
					)}
				</Typography>
			</ButtonBase>
		</Box>
	);
};
export default SensorButton;

const useStyles = makeStyles({
	root: {
		width: "10px",
	},
	btn: {
		height: "25px",
		width: "25px",
		borderRadius: "5px",
		backgroundColor: (props: ButtonProps) => (props.disabled ? "#CCC" : "#EDB93C") as string,
	},
	icon: {
		marginTop: "10px",
	},
	"@keyframes rotate": {
		from: {
			transform: "rotate(0)",
		},
		to: {
			transform: "rotate(360deg)",
		},
	},
	loading: {
		animation: "1s linear infinite $rotate",
		width: "40px",
		height: "40px",
		marginTop: "10.5px",
	},
});
