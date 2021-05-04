/**
 * @module StatusPopup
 * @category Components
 */
import { useState, useEffect } from "react";
import { Box, Grid, Dialog, DialogContent, Typography, TextField, FormControl } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "../Buttons/Button.component";
import StatusBar from "../../components/StatusBar/StatusBar.component";
import SERVER_PORT from "../../utils/serverUtils";

export type modalProps = {
	open: boolean;
	close: () => void;
};

/**
 *
 * A functional component displaying a modal for reporting how your back feels after ended recording.
 *
 * @param {modalProps} props {@link modalProps}
 */

export const StatusPopup: React.FC<modalProps> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [status, setStatus] = useState<number>(-1);

	useEffect(() => {
		if (props.open === true) {
			setOpen(props.open);
		}
		// eslint-disable-next-line
	}, [props.open]);

	const sendText = () => {
		fetch("http://localhost:" + SERVER_PORT + "/reports", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				status: text.replace(",", "&comma;") + status,
			}),
		});
	};

	const handleSend = () => {
		sendText();
		props.close();
		setOpen(false);
	};

	return (
		<Box>
			<Dialog
				classes={{ paper: classes.paper }}
				aria-labelledby="customized-dialog-title"
				open={open}
				className={classes.root}
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
			>
				<DialogContent className={classes.dialogContent} dividers>
					<Box justifyContent="centre">
						<Typography variant="h1">Report</Typography>
						<Grid container justify="center">
							<Grid item>
								<StatusBar status={status} setStatus={setStatus} />
							</Grid>
						</Grid>

						<FormControl className={classes.textfield}>
							<form noValidate autoComplete="off">
								<TextFieldWithState updateText={setText} />
								<Grid container justify="center" className={classes.btn}>
									<Button disabled={text === "" || status === -1} func={handleSend}>
										Send
									</Button>
								</Grid>
							</form>
						</FormControl>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
};
export default StatusPopup;

type textFieldProps = {
	updateText: (text: string) => void;
};

const StyledTextField = withStyles({
	root: {
		"& .MuiOutlinedInput-root": {
			color: "white",
			"& fieldset": {
				borderColor: "white",
			},
			"&:hover fieldset": {
				borderColor: "white",
			},
		},
	},
})(TextField);

/**
 * @param {textFieldProps} props
 * A styled textfield with a state of written feedback.
 */
const TextFieldWithState: React.FC<textFieldProps> = (props) => {
	return (
		<StyledTextField
			id="outlined-multiline-flexible"
			label="How does your back feel?"
			onChange={(e) => {
				props.updateText(e.target.value);
			}}
			margin="normal"
			variant="outlined"
			inputProps={{ style: { fontFamily: "nunito", color: "white", height: "150px" } }}
			InputLabelProps={{
				shrink: true,
			}}
			rowsMax="6"
			required
			fullWidth
			multiline
		/>
	);
};

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		textAlign: "center",
		borderRadius: "0",
		position: "relative",
	},
	dialogContent: {
		height: "100px",
	},
	paper: {
		height: "500px",
		width: "70%",
	},
	textfield: {
		minWidth: "80%",
		maxWidth: "80%",
		minHeight: "60%",
		maxHeight: "60%",
	},
	btn: {
		margin: "25px 0px",
	},
});
