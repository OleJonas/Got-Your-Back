import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Typography, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'

export const SensorModal: FC = () => {
    const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<Array<JSON>>([]);
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
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                Modal title
                </DialogTitle>
                <DialogContent dividers>
                <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                    in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                </Typography>
                <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                    lacus vel augue laoreet rutrum faucibus dolor auctor.
                </Typography>
                <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                    scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                    auctor fringilla.
                </Typography>
                </DialogContent>
                <DialogActions>
                    <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>Refresh</Button>
                    <Button func={handleClose}>Close</Button>
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
        borderRadius: "5px"
    }
  });