/**
 * @module StatusBar
 * @category Components
 */
import { Box, Button } from "@material-ui/core";
import { InlineIcon } from "@iconify/react";
import emojiAngry20Regular from "@iconify-icons/fluent/emoji-angry-20-regular";
import emojiSad20Regular from "@iconify-icons/fluent/emoji-sad-20-regular";
import emojiMeh20Regular from "@iconify-icons/fluent/emoji-meh-20-regular";
import emoji20Regular from "@iconify-icons/fluent/emoji-20-regular";
import emojiLaugh20Regular from "@iconify-icons/fluent/emoji-laugh-20-regular";

export type statusProps = {
	status: number;
	setStatus?: (number: number) => void;
};

/**
 *
 * A functional component displaying status emoticons.
 *
 * @param {statusProps} props {@link statusProps}
 */
export const StatusBar: React.FC<statusProps> = (props) => {
	const icons = [emojiAngry20Regular, emojiSad20Regular, emojiMeh20Regular, emoji20Regular, emojiLaugh20Regular];
	return (
		<Box display="flex" p={0.1}>
			{icons.map((icon, index: number) => (
				<Button
					disabled={props.setStatus ? false : true}
					onClick={() => (props.setStatus ? props.setStatus(index) : {})}
					style={{ backgroundColor: "transparent" }}
				>
					<InlineIcon
						icon={icon}
						style={{
							color: props.status === index ? "#EDB93C" : "#ccc",
							height: props.setStatus ? "50px" : "30px",
							width: props.setStatus ? "50px" : "30px",
						}}
					/>
				</Button>
			))}
		</Box>
	);
};
export default StatusBar;
