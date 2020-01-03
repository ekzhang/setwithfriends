import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  square: {
    display: "inline-block",
    border: "1px solid black",
    height: "1rem",
    width: "1rem",
    minWidth: "1rem",
    marginRight: 12
  }
});

function ColorSquare({ color }) {
  const classes = useStyles();
  return <span className={classes.square} style={{ background: color }}></span>;
}

export default ColorSquare;
