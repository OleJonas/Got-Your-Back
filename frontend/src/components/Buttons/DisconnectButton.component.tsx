import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FC, useState, useEffect } from "react";
import { Check } from "@material-ui/icons";
import { Add } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { ButtonBase } from "@material-ui/core";

export type ButtonProps = {
	func?: any;
	id?: string;
	disabled?: boolean;
	status?: boolean;
};

export const DisconnectButton: FC<ButtonProps> = (props) => {
	const [status, setStatus] = useState<boolean>(false);

	const useStyles = makeStyles({
		root: {
			maxWidth: "10px",
		},
		btn: {
			height: "30px",
			width: "30px",
			backgroundColor: "#EDB93C",
		},
	});

	useEffect(() => {
		if (props.status === true) {
			setStatus(true);
		} else {
			setStatus(false);
		}
	}, [props.status]);

	const classes = useStyles();

	return (
		<Box>
			<ButtonBase
				className={classes.btn}
				id={props.id}
				onClick={props.func === undefined ? () => {} : props.func}
				disabled={props.disabled ? true : false}
			>
				<Typography variant="button" color="textSecondary">
					{status ? "+" : "X"}
				</Typography>
			</ButtonBase>
		</Box>
	);
};
