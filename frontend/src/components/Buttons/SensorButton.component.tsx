/**
 * @module SensorButton
 * @category Components
 */
import { useState, useEffect } from "react";
import { Box, ButtonBase, Typography, makeStyles, Tooltip } from "@material-ui/core";
import loader from "../../assets/loader_white.svg";
import sensorPlacement from "../../utils/sensorPlacement";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

export type sensorButtonProps = {
	type: "connect" | "disconnect";
	func?: any;
	sensorid: number;
	disabled?: boolean;
	status?: boolean;
	loading?: boolean;
};

/**
 *
 * A button component specifically used for sensor setup - connecting and disconnecting.
 *
 * @param {sensorButtonProps} props {@link sensorButtonProps}
 */
export const SensorButton: React.FC<sensorButtonProps> = (props) => {
	const classes = useStyles(props);
	const [status, setStatus] = useState<boolean>(false);
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	useEffect(() => {
		if (props.status === true) {
			setStatus(true);
			if (props.type === "connect") handleTooltipOpen();
		} else {
			setStatus(false);
			if (props.type === "connect") handleTooltipClose();
		}
		//eslint-disable-next-line
	}, [props.status]);

	const handleTooltipOpen = () => {
		setShowTooltip(true);
	};

	const handleTooltipClose = () => {
		setShowTooltip(false);
	};

	return (
		<Box>
			<Tooltip
				open={showTooltip}
				disableFocusListener
				disableHoverListener
				disableTouchListener
				title={
					<Typography variant="body1" color="textPrimary">
						{sensorPlacement[props.sensorid.toString()]}
					</Typography>
				}
				placement="right"
				arrow
			>
				<ButtonBase
					className={classes.btn}
					onClick={props.func === undefined ? () => {} : props.func}
					disabled={props.disabled ? true : false}
					focusRipple
				>
					<Typography variant="button" color="textPrimary">
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
			</Tooltip>
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
		backgroundColor: (props: sensorButtonProps) => (props.disabled ? "rgba(60, 60, 60, 0.5)" : "#EDB93C") as string,
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
