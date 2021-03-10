import { FC } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


export const TemplateBox: FC = () => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
        </Box>
    )
}

const useStyles = makeStyles({
    root: {
        background: "rgba(0,0,0,0.5)",
        height: "90%",
        borderRadius: "5px"
    }
  });