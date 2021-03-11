import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, Typography, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'
import { SensorListing } from "../SensorListing/SensorListing"
import { AnyAaaaRecord } from 'node:dns';

export const SensorModal: FC = () => {
    const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<any>();
    const [isFetching, setIsFetching] = useState(false);
    const [open, setOpen] = useState(false);

    const scanForSensors = useCallback(async () => {
        if(isFetching) return;
        setIsFetching(true);

        await fetch('http://localhost:5000/setup/scan', {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            }).then(res => res.json()).then(data => {
                console.log(data);
                setSensorsFound(data);
                console.log(typeof sensorsFound)
                setIsFetching(false)
                setOpen(true)
            });
    }, [isFetching]);


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>Scan</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className={classes.root}>
                <DialogTitle id="customized-dialog-title"><Typography variant="h2">Sensors found</Typography></DialogTitle>
                <DialogContent dividers>
                    <Box className="sensorBox">
                        {sensorsFound ? sensorsFound["sensors"].map((sensor:string) => (
                            <SensorListing name={sensor} />
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
        borderRadius: "5px",
        backgroundColor: "white"
    },
    btnGrid: {
        width: "100%"
    }
  });