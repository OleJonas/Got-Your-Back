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
import { Button } from "../Buttons/Button.component";
import { SensorListing } from "../SensorListing/SensorListing";
import { AnyAaaaRecord } from "node:dns";

export const SensorModal: FC = () => {
  const classes = useStyles();

  const [sensorsFound, setSensorsFound] = useState<any>();
  const [connectedSensors, setConnectedSensors] = useState<any>();
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const scanForSensors = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);

    await fetch("http://localhost:5000/setup/scan", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSensorsFound(data);
        console.log(typeof sensorsFound);
        setIsFetching(false);
        setOpen(true);
      });
  }, [isFetching]);

  const handleClose = () => {
    let connected: any = [];
    console.log(sensorsFound);
    if (sensorsFound) {
      for (let i = 0; i < sensorsFound["sensors"].length; i++) {
        console.log(sensorsFound["sensors"][i].props.connected);
        if (sensorsFound["sensors"][i].props.connected)
          connected.push(sensorsFound["sensors"][i]);
      }
      setConnectedSensors(connected);
      console.log(connectedSensors);
    }
    setOpen(false);
  };

  return (
    <Box>
      {connectedSensors ? (
        connectedSensors["sensors"].map((sensor: string, index: number) => (
          <SensorListing index={index} name={sensor} />
        ))
      ) : (
        <></>
      )}
      <Button id="ScanButton" disabled={isFetching} func={scanForSensors}>
        Scan
      </Button>
      <Dialog
        classes={{ paper: classes.paper }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={classes.root}
      >
        <DialogTitle className={classes.title} id="customized-dialog-title">
          <Typography variant="h2">Sensors found</Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent} dividers>
          <Box className={classes.sensorBox}>
            <Grid className={classes.columns} container lg={12}>
              <Grid
                container
                className={classes.grid}
                justify="center"
                item
                lg={5}
              >
                <Typography variant="h6">Sensor name</Typography>
              </Grid>
              <Grid
                container
                className={classes.grid}
                justify="center"
                item
                lg={2}
              >
                <Typography variant="h6">Id</Typography>
              </Grid>
              <Grid
                container
                className={classes.grid}
                justify="center"
                item
                lg={2}
              >
                <Typography variant="h6">Battery</Typography>
              </Grid>
              <Grid
                container
                className={classes.grid}
                justify="center"
                item
                lg={3}
              >
                <Typography variant="h6"></Typography>
              </Grid>
            </Grid>

            {sensorsFound ? (
              sensorsFound["sensors"].map((sensor: string, index: number) => (
                <SensorListing index={index} name={sensor} />
              ))
            ) : (
              <></>
            )}
          </Box>

          <Grid container justify="center" className={classes.btnGrid}>
            <Grid item xs={6}>
              <Button width="180px" disabled={isFetching} func={scanForSensors}>
                Refresh
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button width="180px" func={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const useStyles = makeStyles({
  root: {
    background: "rgba(0,0,0,0.5)",
    textAlign: "center",
    borderRadius: "0",
  },

  dialogContent: {
    height: "1000px",
  },

  grid: {
    justify: "center",
    alignItems: "center",
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
    marginTop: "30px",
  },
  paper: {
    height: "80%",
    width: "70%",
  },
  sensorBox: {
    height: "60%",
    marginTop: "30px",
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "95%",
    margin: "auto",
  },
  btnGrid: {
    marginTop: "50px",
    width: "100%",
  },
});
