import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@material-ui/core';
import Logo from '../../assets/Logo.svg';
import '../../styles/LandingView.css'

import { NavBar } from '../../components/NavBar/NavBar.component'

export const LandingView = () => {
    return (
        <div className='container'>
            <Grid container justify="center" className='grid'>
                <Grid item xs={2} lg={1}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} lg={11}>
                </Grid>
            </Grid>
        </div>
    )
}