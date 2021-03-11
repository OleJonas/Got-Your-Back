import { FC, useState, useEffect, useCallback } from "react";
import {
	Box,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import { Button } from '../Button/Button.component'
import { SensorListing } from "../SensorListing/SensorListing"
import { AnyAaaaRecord } from 'node:dns';

export const SensorModal: FC = () => {
	const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<any>();
    const [connectedSensors, setConnectedSensors] = useState<any>();
    const [isFetching, setIsFetching] = useState(false);
    const [open, setOpen] = useState(false);

	const scanForSensors = useCallback(async () => {
		if (isFetching) return;
		setIsFetching(true);

        await fetch('http://localhost:5000/setup/scan', {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            }).then(res => res.json()).then(data => {
                console.log(data);
                if(data.length > 0) setSensorsFound(data);
                console.log(typeof sensorsFound)
                setIsFetching(false)
                setOpen(true)
            });
    }, [isFetching]);

    const handleClose = () => {
        let connected:any = [];
        console.log(sensorsFound)
        if(sensorsFound){
            for(let i=0; i < sensorsFound["sensors"].length; i++){
                console.log(sensorsFound["sensors"][i].props.connected);
                if(sensorsFound["sensors"][i].props.connected) connected.push(sensorsFound["sensors"][i]);
            }
            setConnectedSensors(connected)
            console.log(connectedSensors)
        }
        setOpen(false);
    };

    return (
        <Box>
            {connectedSensors ? connectedSensors["sensors"].map((sensor:string, index:number) => (
                            <SensorListing index={index} name={sensor} />
                        )) : <></>}
            <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>Scan</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className={classes.root}>
                <DialogTitle id="customized-dialog-title"><Typography variant="h2">Sensors found</Typography></DialogTitle>
                <DialogContent dividers>
                    <Box className={classes.sensorBox}>
                        {sensorsFound ? sensorsFound["sensors"].map((sensor:string, index:number) => (
                            <SensorListing index={index} name={sensor} />
                        )) : <></>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="center" className={classes.btnGrid}>
                        <Grid item xs={4}>
                            <Button disabled={isFetching} func={scanForSensors}>Refresh</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button func={handleClose}>Close</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        textAlign: "center"
    },
    sensorBox: {
        minWidth: "400px",
        backgroundColor: "white",
        borderRadius: "5px"
    },
    btnGrid: {
        width: "100%"
    }
  });
