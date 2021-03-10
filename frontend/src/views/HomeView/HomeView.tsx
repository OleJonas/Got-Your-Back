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
            <Grid container justify="center" className={classes.rootGrid}>
                <Grid item xs={2} md={1} className={classes.rootGrid}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item container xs={10} md={11} direction="column" className={classes.rootGrid}>
                    <Box m={2} className={classes.contentBox}>
                        <Grid container spacing={2} className={classes.rootGrid}>
                            <Grid item xs={12}><Typography variant="h1" color="textPrimary">Welcome Back, Ole Jonas!</Typography></Grid>    

                            <Grid item xs={12} md={5} className={classes.contentGrid}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Connected sensors</Typography></Box>
                                <ContentBox><SensorModal /></ContentBox>
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.contentGrid}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Classification</Typography></Box>
                                <ContentBox></ContentBox>
                            </Grid>
                            <Grid item xs={12} md={7} className={classes.contentGrid}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">My day</Typography></Box>
                                <ContentBox><LineGraph/></ContentBox>
                            </Grid>
                            <Grid item xs={12} md={5} className={classes.contentGrid}>
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
        height: "100%",
        width: "100%",
    },
    contentBox : {
        width: "95%",
        height: "100%",
    },
    rootGrid: {
        height: "100%",
        width: "100%",
    },
    contentGrid : {
        height: "45%",
    },
    components: {
        height: "100%",
    },
  });