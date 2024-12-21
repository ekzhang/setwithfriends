import { useState } from "react";

import makeStyles from "@mui/styles/makeStyles";
import withTheme from "@mui/styles/withTheme";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ChromePicker } from "react-color";

import ResponsiveSetCard from "./ResponsiveSetCard";
import { darkTheme, lightTheme } from "../themes";

const useStyles = makeStyles({
  colorPickerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

function ColorChoiceDialog(props) {
  const { open, onClose, title, theme } = props;
  const classes = useStyles();

  const [red, setRed] = useState(theme.custom.setCard.red);
  const [green, setGreen] = useState(theme.custom.setCard.green);
  const [purple, setPurple] = useState(theme.custom.setCard.purple);

  function handleClose() {
    onClose(null);
  }

  function handleSubmit() {
    onClose({ red: red, green: green, purple: purple });
  }

  function handleReset() {
    if (theme.palette.mode === "light") {
      setRed(lightTheme.custom.setCard.red);
      setGreen(lightTheme.custom.setCard.green);
      setPurple(lightTheme.custom.setCard.purple);
    }
    if (theme.palette.mode === "dark") {
      setRed(darkTheme.custom.setCard.red);
      setGreen(darkTheme.custom.setCard.green);
      setPurple(darkTheme.custom.setCard.purple);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className={classes.colorPickerColumn}>
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
          <Grid item xs={12} md={4} className={classes.colorPickerColumn}>
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
          <Grid item xs={12} md={4} className={classes.colorPickerColumn}>
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
        <Grid container direction="row" justifyContent="center">
          <Button
            onClick={handleReset}
            variant="outlined"
            color="secondary"
            style={{ marginTop: "15px" }}
          >
            Set Colors to Default
          </Button>
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
