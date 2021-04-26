import { Box, Button } from "@material-ui/core";
import { InlineIcon } from "@iconify/react";
import emojiAngry20Regular from "@iconify-icons/fluent/emoji-angry-20-regular";
import emojiSad20Regular from "@iconify-icons/fluent/emoji-sad-20-regular";
import emojiMeh20Regular from "@iconify-icons/fluent/emoji-meh-20-regular";
import emoji20Regular from "@iconify-icons/fluent/emoji-20-regular";
import emojiLaugh20Regular from "@iconify-icons/fluent/emoji-laugh-20-regular";

type statusProps = {
	status: number;
	setStatus?: (number: 0 | 1 | 2 | 3 | 4) => void;
};

export const StatusPopup: React.FC<statusProps> = (props) => {
	return (
		<Box display="flex" p={0.1}>
			<Button
				disableRipple
				aria-label="very bad"
				disabled={props.setStatus ? false : true}
				onClick={() => (props.setStatus ? props.setStatus(0) : {})}
				style={{ backgroundColor: "transparent" }}
			>
				<InlineIcon
					icon={emojiAngry20Regular}
					style={{
						color: props.status === 0 ? "#EDB93C" : "#ccc",
						height: props.setStatus ? "50px" : "30px",
						width: props.setStatus ? "50px" : "30px",
					}}
				/>
			</Button>
			<Button
				disableRipple
				aria-label="bad"
				disabled={props.setStatus ? false : true}
				onClick={() => (props.setStatus ? props.setStatus(1) : {})}
				style={{ backgroundColor: "transparent" }}
			>
				<InlineIcon
					icon={emojiSad20Regular}
					style={{
						color: props.status === 1 ? "#EDB93C" : "#ccc",
						height: props.setStatus ? "50px" : "30px",
						width: props.setStatus ? "50px" : "30px",
					}}
				/>
			</Button>
			<Button
				disableRipple
				aria-label="meh"
				disabled={props.setStatus ? false : true}
				onClick={() => (props.setStatus ? props.setStatus(2) : {})}
				style={{ backgroundColor: "transparent" }}
			>
				<InlineIcon
					icon={emojiMeh20Regular}
					style={{
						color: props.status === 2 ? "#EDB93C" : "#ccc",
						height: props.setStatus ? "50px" : "30px",
						width: props.setStatus ? "50px" : "30px",
					}}
				/>
			</Button>
			<Button
				disableRipple
				aria-label="good"
				disabled={props.setStatus ? false : true}
				onClick={() => (props.setStatus ? props.setStatus(3) : {})}
				style={{ backgroundColor: "transparent" }}
			>
				<InlineIcon
					icon={emoji20Regular}
					style={{
						color: props.status === 3 ? "#EDB93C" : "#ccc",
						height: props.setStatus ? "50px" : "30px",
						width: props.setStatus ? "50px" : "30px",
					}}
				/>
			</Button>
			<Button
				disableRipple
				aria-label="very good"
				disabled={props.setStatus ? false : true}
				onClick={() => (props.setStatus ? props.setStatus(4) : {})}
				style={{ backgroundColor: "transparent" }}
			>
				<InlineIcon
					icon={emojiLaugh20Regular}
					style={{
						color: props.status === 4 ? "#EDB93C" : "#ccc",
						height: props.setStatus ? "50px" : "30px",
						width: props.setStatus ? "50px" : "30px",
					}}
				/>
			</Button>
		</Box>
	);
};
export default StatusPopup;
