import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'
import { SensorListing } from "../SensorListing/SensorListing"
import { AnyAaaaRecord } from 'node:dns';

export const SensorModal: FC = () => {
    const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<any>([]);
    const [isFetching, setIsFetching] = useState(false);

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
                setIsFetching(false)
            });
    }, [isFetching]);

    const renderSensors: any = () =>{
        console.log(sensorsFound);
        if(sensorsFound.length < 1) return {}
        else{
            return sensorsFound.sensors.map((sensor: any) => {
                <SensorListing name={sensor} />
            });
        }
    }

    return (
        <Box>
            <Button text="Scan" id="ScanButton" disabled={isFetching} func={scanForSensors} />
            {(sensorsFound.sensors !== undefined)? sensorsFound.sensors.map((sensor: string) => (
                <SensorListing name={sensor} />
            )) : <></>}
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        borderRadius: "5px"
    }
  });