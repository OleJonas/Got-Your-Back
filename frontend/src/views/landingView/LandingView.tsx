import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@material-ui/core';
import Logo from '../../assets/Logo.svg';
import '../../styles/LandingView.scss'

import { NavBar } from '../../components/NavBar/NavBar.component'

export const LandingView = () => {
    return (
        <div className='container'>
            <Grid container justify="center" className='grid'>
                <Grid item xs={2} md={1}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={10} md={11}>
                </Grid>
            </Grid>
        </div>
    )
}