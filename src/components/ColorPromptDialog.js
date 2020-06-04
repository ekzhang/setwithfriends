import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

import { colors } from "../util";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    margin: theme.spacing(1),
    listStyle: "none",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    lineHeight: "30px",
  },
  color: {
    margin: "5px",
    flex: "1 0 auto",
    height: "auto",
    textAlign: "center",
    cursor: "pointer",
  },
}));

function PromptDialog(props) {
  const classes = useStyles();
  const { open, onClose, title, message, label, maxLength } = props;
  const [value, setValue] = useState("");

  function handleClose() {
    onClose(null);
    setValue("");
  }
  function handleSubmit(value) {
    onClose(value);
    setValue("");
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <div className={classes.container}>
          {Object.keys(colors)
            .slice(0, 7)
            .map((color, i) => (
              <div
                key={color}
                className={classes.color}
                onClick={() => {
                  handleSubmit(color);
                }}
                style={{
                  color: colors[color][100],
                  backgroundColor: colors[color][100],
                }}
              >
                i
              </div>
            ))}
        </div>

        <div className={classes.container}>
          {Object.keys(colors)
            .slice(7, 14)
            .map((color) => (
              <div
                key={color}
                className={classes.color}
                onClick={() => {
                  handleSubmit(color);
                }}
                style={{
                  color: colors[color][100],
                  backgroundColor: colors[color][100],
                }}
              >
                color
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PromptDialog;
