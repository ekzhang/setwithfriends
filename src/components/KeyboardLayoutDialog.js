import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import makeStyles from "@mui/styles/makeStyles";
import { useContext } from "react";

import { SettingsContext } from "../context";
import { standardLayouts } from "../util";

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
        <FormControl variant="standard" className={classes.formControl}>
          <InputLabel>Layout</InputLabel>
          <Select
            variant="standard"
            value={keyboardLayout}
            onChange={handleChange}
          >
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
