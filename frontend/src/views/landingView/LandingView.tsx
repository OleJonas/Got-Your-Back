import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import '../../styles/LandingView.scss'

import Logo from '../../assets/Logo.svg';

export const LandingView = () => {
    return (
        <div className='container'>
            <Grid container justify="center" className='grid'>
                <Grid item xs={12}>
                    <h1>Hello Jonas</h1>
                </Grid>
                <Grid item xs={12}>
                    <img src={Logo} />
                </Grid>
            </Grid>
        </div>
    )
}