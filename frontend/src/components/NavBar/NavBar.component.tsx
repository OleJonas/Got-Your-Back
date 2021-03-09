import React, { FC, useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../../assets/Logo.svg';
import ProfilePicture from '../../assets/profile_picture.png'

export const NavBar: FC = () => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Grid container justify="center" className='grid'>
                <Grid item xs={10} >
                    <img src={Logo} className={classes.icon} alt="logo" />
                </Grid>
                <Grid item xs={10}>
                    <img src={ProfilePicture} className={classes.profilePic} alt="PP"/>
                </Grid>
                <Grid item xs={10} style={{marginTop: "30px"}}><a href="/"><h3 className={classes.link}>Home</h3></a></Grid>
                <Grid item xs={10}><a href="/"><h3 className={classes.link}>History</h3></a></Grid>
                <Grid item xs={10}><a href="/"><h3 className={classes.link}>About</h3></a></Grid>
            </Grid>
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        minHeight: "100vh",
    },
    icon: {
        margin: "10px"
    },
    profilePic: {
        height: "80%",
        width: "80%",
        marginBottom: "20px"
    },
    link: {
        color: "white"
    }
  });