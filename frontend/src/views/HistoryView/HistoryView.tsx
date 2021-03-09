import React, { useState, useEffect } from 'react';
import { Grid, Box, makeStyles } from '@material-ui/core';
import Logo from '../../assets/Logo.svg';

import { NavBar } from '../../components/NavBar/NavBar.component'

export const HistoryView = () => {
    const classes = useStyles();
    return (
        <div className='container'>
            <Grid container justify="center" className='grid'>
                <Grid item xs={2} lg={1}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} lg={11} >
                    <Grid container>
                        <Grid item xs={12}>
                            <Box m={2}><h3>History</h3></Box>
                        </Grid>  
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

const useStyles = makeStyles({
    
  });