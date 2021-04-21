import { FC, useState, useEffect } from "react";
import { Box, Grid, Dialog, DialogContent, Typography, TextField, FormControl } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// Components
import { Button } from "../Buttons/Button.component";

type modalProps = {
	open: boolean;
	close: () => void;
};

export const StatusPopup: FC<modalProps> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");

	useEffect(() => {
		if (props.open === true) {
			setOpen(props.open);
		}
		// eslint-disable-next-line
	}, [props.open]);

	const sendText = () => {
		fetch("http://localhost:5000/reports", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				status: text.replace(",", "&comma;"),
			}),
		});
	};

	const handleClose = () => {
		sendText();
		props.close();
		setOpen(false);
	};

	return (
		<Box>
			<Dialog
				classes={{ paper: classes.paper }}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				className={classes.root}
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
			>
				<DialogContent className={classes.dialogContent} dividers>
					<Box justifyContent="centre">
						<Typography variant="h1">Report</Typography>
						<FormControl className={classes.textfield}>
							<form noValidate autoComplete="off">
								<TextFieldWithState updateText={setText} />
							</form>
						</FormControl>
					</Box>
					<Grid container justify="center" className={classes.btn}>
						<Button disabled={text === ""} func={handleClose}>
							Send
						</Button>
					</Grid>
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
		// "& label.Mui-focused": {
		// 	color: "white",
		// },
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

const TextFieldWithState: FC<textFieldProps> = (props) => {
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
			rowsMax="8"
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
		height: "440px",
		width: "70%",
	},
	textfield: {
		minWidth: "80%",
		maxWidth: "80%",
		minHeight: "60%",
		maxHeight: "60%",
	},
	btn: {
		margin: "30px 0px",
	},
});
