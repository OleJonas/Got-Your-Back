import React, { FC, useState, useEffect } from 'react';
import { Grid, Box, Typography, Link, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export type ButtonProps = {
    text: string,
    onclick: Function,
};

export const Button: FC<ButtonProps> = (props) => {
    return (
        <Fab variant="extended" color="primary">
            <Typography variant="button" color="textPrimary">{props.text}</Typography>
        </Fab>
    )
}
