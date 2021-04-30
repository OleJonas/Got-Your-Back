import { useState } from "react";
import { Box, IconButton, Tooltip, ClickAwayListener, Typography } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

type InfoTooltipProps = {
	text: string;
	color?: string;
};

/**
 *
 * @param props
 * @returns A tooltip component in which adds an information-icon and shows a tooltip when clicked on.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = (props) => {
	const [showTooltip, setShowTooltip] = useState<boolean>(false);

	const handleTooltipOpen = () => {
		setShowTooltip(true);
	};
	const handleTooltipClose = () => {
		setShowTooltip(false);
	};

	return (
		<ClickAwayListener onClickAway={handleTooltipClose}>
			<Box ml={0.5}>
				<Tooltip
					open={showTooltip}
					disableFocusListener
					disableHoverListener
					disableTouchListener
					title={
						<Typography variant="body1" color="textPrimary">
							{props.text}
						</Typography>
					}
					placement="bottom"
					arrow
				>
					<IconButton
						onClick={handleTooltipOpen}
						onBlur={handleTooltipClose}
						size="small"
						style={{ color: props.color ? props.color : "rgba(255,255,255,0.8)" }}
					>
						<InfoOutlinedIcon fontSize="inherit" />
					</IconButton>
				</Tooltip>
			</Box>
		</ClickAwayListener>
	);
};
export default InfoTooltip;
