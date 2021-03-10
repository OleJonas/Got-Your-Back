import { Grid, Box, makeStyles, Typography } from '@material-ui/core';

// Components
import { NavBar } from '../../components/NavBar/NavBar.component'
import { ContentBox } from '../../components/ContentBox/ContentBox.component'
import { LineGraph } from '../../components/LineGraph/LineGraph'
import { SensorModal } from '../../components/SensorModal/SensorModal.component';
import { GoogleGraph } from '../../components/GoogleGraph/GoogleGraph.jsx';

export const HomeView = () => {
    const classes = useStyles();
    return (
        <>
            <Grid container justify="center" className={classes.root}>
                <Grid item xs={2} md={1}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} md={11}>
                    <Box m={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}><Typography variant="h1" color="textPrimary">Welcome Back, Ole Jonas!</Typography></Grid>    

                            <Grid item xs={12} md={5} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Connected sensors</Typography></Box>
                                <ContentBox><SensorModal /></ContentBox>
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Classification</Typography></Box>
                                <ContentBox></ContentBox>
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">My day</Typography></Box>
                                <ContentBox><GoogleGraph /></ContentBox>
                            </Grid>
                            
                            <Grid item xs={12} md={5} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Distribution</Typography></Box>
                                <ContentBox></ContentBox>
                            </Grid>
                            
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

const useStyles = makeStyles({
    root: {
        height: "100%"
    },
    components: {
        height: "45vh"
    },
  });