import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import { SensorModal } from "../../components/SensorModal/SensorModal.component";
import { SensorList } from "../SensorList/SensorList"

export const SensorListingContent = () => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [rate, setRate] = useState(5);
	const [sensors, setSensors] = useState();

	const openModal = () => {
		if (open) setOpen(false);
		else setOpen(true);
	};

	return (
		<Box>
			{sensors? <SensorList connected={true} color="blue" sensors={sensors} /> : <></>}
			<Button func={() => {openModal()}}> Scan{" "} </Button>
			<SensorModal open={open} func={setSensors}></SensorModal>
		</Box>
	);
};

const useStyles = makeStyles({});
