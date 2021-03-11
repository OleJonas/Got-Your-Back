import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Typography } from '@material-ui/core';
import { Button } from '../Buttons/Button.component'

interface MyProps{
    datapoint: JSON
}

export const ClassificationBox: React.FC<MyProps> = (props: MyProps) => {
    const classes = useStyles();
    const [posture, setPosture] = useState(1)
    let postureArray = ["Upright", "Forward", "Forward right", "Right", "Back right", "Back", "Back left", "Left", "Forward left"]

    let postures = [1,2,3,4,5]

    useEffect(() =>  {
        setPosture(() => {
            if(posture === 8){
                return 0
            }
            return posture + 1})
    }, [props.datapoint])

    return (
        <div className={classes.root}>
            <Grid className={classes.grid} justify="center" alignItems="center" container item xs={12}>
                <Box>
                    <Typography variant="subtitle1" color="textPrimary">{posture}</Typography>
                    <Typography variant="h1" color="textPrimary">{postureArray[posture]}</Typography>
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