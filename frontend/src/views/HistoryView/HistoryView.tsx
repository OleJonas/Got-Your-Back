import React from 'react';
import { Grid, Box, makeStyles, Typography } from '@material-ui/core';

// Components
import { NavBar } from '../../components/NavBar/NavBar.component'
import { TemplateBox } from '../../components/TemplateBox/TemplateBox.component';

export const HistoryView = () => {
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
                            <Grid item xs={12}><Typography variant="h1" color="textPrimary">History</Typography></Grid>    

                            <Grid item xs={12} md={5} className={classes.components}><TemplateBox /></Grid>
                            <Grid item xs={12} md={7} className={classes.components}><TemplateBox /></Grid>

                            <Grid item xs={12} md={7} className={classes.components}><TemplateBox /></Grid>
                            <Grid item xs={12} md={5} className={classes.components}><TemplateBox /></Grid>
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
        minHeight: "40vh",
        borderRadius: "25px"
    }
  });