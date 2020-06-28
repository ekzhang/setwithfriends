import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Filter from "bad-words";

function PromptDialog(props) {
  const { open, onClose, title, message, label, maxLength } = props;
  const [value, setValue] = useState("");

  function handleClose() {
    onClose(null);
    setValue("");
  }

  function handleSubmit() {
    if (filter.isProfane(value)) {
      alert(
        "We detected that your name contains profane language. If you think this was a mistake, please let us know!"
      );
    } else {
      onClose(value);
      setValue("");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  const filter = new Filter();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={label}
          type="text"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
          onKeyDown={handleKeyDown}
          inputProps={{ maxLength }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromptDialog;
