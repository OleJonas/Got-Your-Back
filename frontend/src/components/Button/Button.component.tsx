import { FC } from 'react';
import { Typography, Fab } from '@material-ui/core';

export type ButtonProps = {
    text: string,
    func?: any,
    id?: string,
    disabled?: boolean
};

export const Button: FC<ButtonProps> = (props) => {
    return (
        <Fab variant="extended" color="primary" id={props.id} onClick={(props.func === undefined) ? () => {} : props.func } disabled={props.disabled ? true : false}>
            <Typography variant="button" color="textPrimary">{props.text}</Typography>
        </Fab>
    )
}
