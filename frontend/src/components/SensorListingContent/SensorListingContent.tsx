import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorModal } from "../../components/SensorModal/SensorModal.component";

export const SensorListingContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [rate, setRate] = useState(5);

	const openModal = () => {
		if (open) setOpen(false);
		else setOpen(true);
	};

	return (
		<Box>
			<Button
				func={() => {
					openModal();
				}}
			>
				Scan{" "}
			</Button>
			<SensorModal open={open}></SensorModal>
		</Box>
	);
};

const useStyles = makeStyles({});
