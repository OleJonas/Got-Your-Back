import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, Typography, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'

export const SensorModal: FC = () => {
    const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<any>();
    const [isFetching, setIsFetching] = useState(false);
    const [open, setOpen] = useState(false);

    const scanForSensors = useCallback(async () => {
        if(isFetching) return;
        setIsFetching(true);

        await fetch('http://localhost:5000/found_sensors', {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            }).then(res => res.json()).then(data => {
                console.log(data);
                setSensorsFound(data);
                setIsFetching(false)
                setOpen(true)
            });
    }, [isFetching]);

    const handleClickOpen = () => {
        setOpen(true);
      };
    const handleClose = () => {
    setOpen(false);
    };

    return (
        <Box>
            <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>Scan</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className={classes.root}>
                <DialogTitle id="customized-dialog-title"><Typography variant="h2">Sensors found</Typography></DialogTitle>
                <DialogContent dividers>
                    <Grid container className={classes.sensorGrid}>
                        {sensorsFound ? sensorsFound["sensors"].map((sensor:string, index:number) => (
                        <>
                            <Grid item xs={6}>
                                <Typography variant="body1" color="textSecondary">{sensor}</Typography>   
                            </Grid>
                            <Grid item xs={6}>
                                <button>{index}</button>
                            </Grid>
                        </>
                        )) : <></>}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="center" className={classes.btnGrid}>
                        <Grid item xs={4}>
                            <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>Refresh</Button>
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

function scan(){
    
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        textAlign: "center"
    },
    sensorGrid: {
        backgroundColor: "white",
        minWidth: "400px",
        borderRadius: "5px"
    },
    btnGrid: {
        width: "100%"
    }
  });