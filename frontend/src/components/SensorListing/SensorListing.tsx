import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Divider, Modal, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from "../../theme"

// Components
import { Button } from '../Button/Button.component'

type SensorProps = {
    id?: number,
    name: string,
    index: number
}

export const SensorListing: FC<SensorProps> = (props) => {
    const [name, setName] = useState<string>("")
    const [batteryPercent, setBatteryPercent] = useState<number>(0)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)

    const connect = useCallback(async () => {
        if(isFetching) return;
        setIsFetching(true);

        await fetch('http://localhost:5000/setup/connect', {
            method: "POST",
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "handle": props.index
            })
            }).then(res => res.json()).then(data => {
                console.log(data);
                setConnected(true);
                setIsFetching(false)
            });
    }, [isFetching]);

    const sensorString = () =>{
        let out: string = ""
        if(props.id) out += props.id + "  ";
        out += props.name + "  ";
        out += (connected? "Tilkoblet" : "Frakoblet");
        return out;
    }

    return (
        <Grid container justify="center">
            <Grid item xs={9}>
                <Typography variant="body1" color="textSecondary">{sensorString()}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Button func={connect} id="connectButton" disabled={isFetching}>{connected? ">":"||"}</Button>
            </Grid>
        </Grid>
    )
}

const AddButton = () => {
    return (
        <></>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        borderRadius: "5px"
    }
  });