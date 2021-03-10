import { Grid, Box, makeStyles, Typography } from '@material-ui/core';

// Components
import { NavBar } from '../../components/NavBar/NavBar.component'
import { TemplateBox } from '../../components/TemplateBox/TemplateBox.component'
import { ConnectedSensorsBox } from '../../components/ConnectedSensorsBox/ConnectedSensorsBox.component'
import { LineGraph } from '../../components/LineGraph/LineGraph'

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
                                <ConnectedSensorsBox />
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Classification</Typography></Box>
                                <TemplateBox><h1>bruh</h1><LineGraph/></TemplateBox>
                            </Grid>
                            
                            <Grid item xs={12} md={7} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">My day</Typography></Box>
                                <TemplateBox></TemplateBox>
                            </Grid>
                            
                            <Grid item xs={12} md={5} className={classes.components}>
                                <Box mb={0.6}><Typography variant="h3" color="textPrimary">Distribution</Typography></Box>
                                <TemplateBox />
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
        minHeight: "100vh"
    },
    components: {
        height: "45vh"
    },
  });