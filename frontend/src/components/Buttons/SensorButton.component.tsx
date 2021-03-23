import { FC, useState, useEffect } from "react";
import { Box, ButtonBase, Typography, makeStyles } from "@material-ui/core";

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
};

export const SensorButton: FC<ButtonProps> = (props) => {
	const classes = useStyles();
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
		backgroundColor: "#EDB93C",
	},
	icon: {
		marginTop: "10px",
	},
});
