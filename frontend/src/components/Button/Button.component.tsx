import { FC } from 'react';
import { Typography, Fab } from '@material-ui/core';

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
