import React, { useState } from "react";
import { withTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ChromePicker } from "react-color";
import ResponsiveSetCard from "./ResponsiveSetCard";

function ColorChoiceDialog(props) {
  const { open, onClose, title, theme } = props;

  const [red, setRed] = useState(theme.setCard.red);
  const [green, setGreen] = useState(theme.setCard.green);
  const [purple, setPurple] = useState(theme.setCard.purple);

  function handleClose() {
    onClose(null);
  }

  function handleSubmit() {
    onClose({ red: red, green: green, purple: purple });
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"xl"}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ height: "420px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ResponsiveSetCard
              width={225}
              value="0000"
              colorOverride={{ red: red, green: green, purple: purple }}
            />
            <ChromePicker
              color={purple}
              onChangeComplete={(result) => setPurple(result.hex)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ResponsiveSetCard
              width={225}
              value="1000"
              colorOverride={{ red: red, green: green, purple: purple }}
            />
            <ChromePicker
              color={green}
              onChangeComplete={(result) => setGreen(result.hex)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ResponsiveSetCard
              width={225}
              value="2000"
              colorOverride={{ red: red, green: green, purple: purple }}
            />
            <ChromePicker
              color={red}
              onChangeComplete={(result) => setRed(result.hex)}
            />
          </Grid>
        </Grid>
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

export default withTheme(ColorChoiceDialog);
