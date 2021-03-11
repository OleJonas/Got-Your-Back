import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Typography } from '@material-ui/core';
import { Button } from '../Buttons/Button.component'

export const SamplingRateContent = () => {

    const classes = useStyles();

    const [rate, setRate] = useState(5)
    
    return (
        <div className={classes.root}>
            <Grid container xs={12} justify="center" alignItems="center" className={classes.grid}>
                <Box>
                    <Typography variant="subtitle1" color="textPrimary">{5}</Typography>
                    <Typography variant="h1" color="textPrimary">{"Hz"}</Typography>
                    <Button>Start</Button>
                </Box>
            </Grid>
            
        </div>
    )   
}

const useStyles = makeStyles({
    root : {
        height: "100%",
    },
    grid : {
        height: "100%",
        textAlign: "center",
    },
    btn : {
        margin: "auto"
    }
})