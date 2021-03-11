import { FC } from "react";
import { Typography, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { ButtonBase } from "@material-ui/core";

export type ButtonProps = {
  func?: any;
  id?: string;
  disabled?: boolean;
};

export const ConnectBtn: FC<ButtonProps> = (props) => {
  const useStyles = makeStyles({
    root: {
      maxWidth: "10px",
    },
    btn: {
      height: "30px",
      width: "30px",
      backgroundColor: "#EDB93C",
    },
  });

  const classes = useStyles();

  return (
    <Box>
      <ButtonBase
        className={classes.btn}
        id={props.id}
        onClick={props.func === undefined ? () => {} : props.func}
        disabled={props.disabled ? true : false}
      >
        <Typography variant="button" color="textPrimary">
          +
        </Typography>
      </ButtonBase>
    </Box>
  );
};
