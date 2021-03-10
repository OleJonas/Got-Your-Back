import { FC } from 'react';
import { Grid, Box, Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Logo from '../../assets/Logo.svg';
import ProfilePicture from '../../assets/AgurkPB.png'

export const NavBar: FC = () => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Grid container justify="center" className='grid'>
                
                <Grid item xs={10}><Box m={1}><img src={Logo} alt="logo" /></Box></Grid>
                
                <Grid item xs={10}><Box my={2} mb={4}><img src={ProfilePicture} className={classes.profilePic} alt="PP"/></Box></Grid>

                <Grid item xs={10}><Link href="#/home"><Box m={1.2}><Typography variant="caption" color={window.location.href.includes('home') ? "textSecondary" : "textPrimary"}>Home</Typography></Box></Link></Grid>
                <Grid item xs={10}><Link href="#/history"><Box m={1.2}><Typography variant="caption" color={window.location.href.includes('history') ? "textSecondary" : "textPrimary"}>History</Typography></Box></Link></Grid>
                <Grid item xs={10}><Link href="#/about"><Box m={1.2}><Typography variant="caption" color={window.location.href.includes('about') ? "textSecondary" : "textPrimary"}>About</Typography></Box></Link></Grid>

            </Grid>
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        minHeight: "100%",
        textAlign: "center"
    },
    profilePic: {
        height: "65%",
        width: "65%",
        borderRadius: '50%',
        backgroundColor: '#f5f5f5'
    }
  });