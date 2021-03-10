import { Grid, Box, makeStyles, Typography } from '@material-ui/core';

// Components
import { NavBar } from '../../components/NavBar/NavBar.component'
import { ContentBox } from '../../components/ContentBox/ContentBox.component'

export const HistoryView = () => {
    const classes = useStyles();
    return (
        <>
            <Grid container justify="center" className={classes.root}>
                <Grid item xs={2} md={1}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} md={11} className={classes.height}>
                        <Grid container spacing={2} className={classes.grid}>
                            <Grid item xs={12}><Typography variant="h1" color="textPrimary">History</Typography></Grid>    

                            <Grid item xs={12} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">This week</Typography></Box>
                                <ContentBox />
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Most common posture today</Typography></Box>
                                <ContentBox />
                            </Grid>
                            
                            <Grid item xs={12} md={5} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Distribution last 30 days</Typography></Box>
                                <ContentBox />
                            </Grid>
                            
                        </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const useStyles = makeStyles({
    root: {
        height: "100%"
    },
    grid: {
        height: "100%",
        padding: "20px",
        overflow: "auto"
    },
    components: {
        height: "400px"
    },
    height: {
        height: "100%"
    }
  });