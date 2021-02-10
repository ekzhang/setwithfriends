import { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Select from "@material-ui/core/Select";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import DialogContentText from "@material-ui/core/DialogContentText";
import { makeStyles } from "@material-ui/core/styles";

import { standardLayouts } from "../util";
import { SettingsContext } from "../context";

const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  },
});

function KeyboardLayoutDialog(props) {
  const { open, onClose, title } = props;
  const classes = useStyles();

  const { keyboardLayout, setKeyboardLayout } = useContext(SettingsContext);

  const handleChange = (event) => {
    setKeyboardLayout(event.target.value);
  };

  const menuItems = Object.keys(standardLayouts).map((layoutName) => (
    <MenuItem key={layoutName} value={layoutName}>
      {layoutName}
    </MenuItem>
  ));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select your keyboard layout below. The layout will determine the keys
          used for selecting cards in both the vertical and horizontal
          orientations. The layout is currently set to{" "}
          <b>
            <code>{keyboardLayout}</code>
          </b>
          .
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel>Layout</InputLabel>
          <Select value={keyboardLayout} onChange={handleChange}>
            {menuItems}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default KeyboardLayoutDialog;
