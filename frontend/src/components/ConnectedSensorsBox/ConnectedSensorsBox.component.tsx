import { FC } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import { Button } from '../Button/Button.component'


export const ConnectedSensorsBox: FC = () => {
    const classes = useStyles();
    return (
        <Box className={classes.root} >
            <Button text="Scan for devices" onclick={() => {return "hei"}}/>
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        height: "90%",
        borderRadius: "5px"
    }
  });