import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Typography } from '@material-ui/core';
import { Button } from '../Button/Button.component'

export const ClassificationBox = () => {
    const classes = useStyles();
    const [posture, setPosture] = useState(1)
    let postureArray = ["Upright", "Forward", "Forward right", "Right", "Back right", "Back", "Back left", "Left", "Forward left"]
    
    return (
        <div className={classes.root}>
            <Grid container xs={12} className={classes.grid}>
                <Grid className={classes.grid} justify="center" alignItems="center" container item xs={6}>
                    <Box>
                        <Typography variant="subtitle1" color="textPrimary">{posture}</Typography>
                        <Typography variant="h1" color="textPrimary">{postureArray[posture]}</Typography>
                        <Button>Start</Button>
                    </Box>
                </Grid>
                <Grid className={classes.grid} justify="center" alignItems="center" container item xs={6}>
                    <Box>
                        <Typography variant="subtitle1" color="textPrimary">{5}</Typography>
                        <Typography variant="h1" color="textPrimary">{"Hz"}</Typography>
                        <Button>Start</Button>
                    </Box>
                </Grid>
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