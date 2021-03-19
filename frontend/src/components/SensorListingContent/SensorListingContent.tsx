import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { Button } from "../Buttons/Button.component";
import {SensorList} from "../SensorList/SensorList"

type SensorListProps = {
	sensorsListed?: any[]
};

export const SensorListingContent = () => {
	const classes = useStyles();

	const [rate, setRate] = useState(5);

	return( 
		<Box>
			
		</Box>
	);
};

const useStyles = makeStyles({});
