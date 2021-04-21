import { FC, useState, useEffect } from "react";
import { Box, Grid, Dialog, DialogContent, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
					<Box className={classes.sensorBox}>
						<Box>
							<Grid container className={classes.columns} justify="flex-start">
								<Grid item xs={12}>
									<Grid container className={classes.grid} justify="flex-start">
										<Typography variant="h6">How does your back feel?</Typography>
									</Grid>
								</Grid>
							</Grid>

							<form className={classes.root} noValidate autoComplete="off">
								<TextFieldWithState updateText={setText} />
							</form>
						</Box>
					</Box>
					<Grid container justify="center" className={classes.btnGrid}>
						<Grid item xs={12}>
							<Button disabled={text === ""} func={handleClose}>
								Send
							</Button>
						</Grid>
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

const TextFieldWithState: FC<textFieldProps> = (props) => {
	return (
		<TextField
			id="outlined-multiline-flexible"
			label="Write text here"
			multiline
			onChange={(e) => {
				props.updateText(e.target.value);
			}}
			margin="normal"
			variant="outlined"
			fullWidth
		/>
	);
};

const useStyles = makeStyles({
	root: {
		background: "rgba(0,0,0,0.5)",
		textAlign: "center",
		borderRadius: "0",
	},
	dialogContent: {
		height: "100px",
	},
	grid: {
		alignItems: "center",
		paddingLeft: "30px",
	},
	columns: {
		maxWidth: "100%",
		justifyContent: "space-between",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "50px",
		backgroundColor: "white",
		borderBottom: "1px solid black",
	},
	title: {
		marginTop: "20px",
	},
	paper: {
		height: "calc(30% + 100px)",
		width: "70%",
	},
	sensorBox: {
		height: "60%",
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "95%",
		margin: "auto",
	},
	btnGrid: {
		marginTop: "20px",
		marginBottom: "15px",
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
	},
});
