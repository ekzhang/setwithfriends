import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";

import { UserContext } from "../context";
import { filter } from "../util";

function PromptDialog(props) {
  const { open, onClose, title, message, label, maxLength } = props;
  const [value, setValue] = useState("");
  const user = useContext(UserContext);

  function handleClose() {
    onClose(null);
    setValue("");
  }

  function handleSubmit() {
    if (filter.isProfane(value)) {
      alert(
        "We detected that your input contains profane language. If you think this was a mistake, please let us know!",
      );
    } else if (
      !user.patron &&
      !value.match(/^[\p{L}\p{M}\p{N}\p{P}\p{Zs}]*$/u)
    ) {
      alert("Please use only letters, numbers, and punctuation.");
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
