import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorModal } from "../SensorModal/SensorModal.component";

export const SensorListingContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [rate, setRate] = useState(5);

	const openModal = () => {
		console.log(open);
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false)
	}

	return (
		<Box>
			<Button func={openModal}>Scan </Button>
			<SensorModal close={closeModal} open={open}></SensorModal>
		</Box>
	);
};

const useStyles = makeStyles({});
