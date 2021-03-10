import { FC, useState, useEffect, useCallback } from 'react';
import { Box, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'

export const SensorModal: FC = () => {
    const classes = useStyles();

    const [sensorsFound, setSensorsFound] = useState<Array<JSON>>([]);
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

    return (
        <Box>
            <Button text="Scan" id="ScanButton" disabled={isFetching} func={scanForSensors} />
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