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

import useStorage from "../hooks/useStorage";
import { standardLayouts } from "../util";
import { KeyboardContext } from "../context";

const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  },
});

function KeyboardLayoutDialog(props) {
  const { open, onClose, title } = props;
  const classes = useStyles();

  const [generalLayout, setGeneralLayout] = useStorage(
    "generalKeyboardLayout",
    ""
  );

  function handleClose() {
    setGeneralLayout("");
    onClose(null);
  }

  function handleSubmit() {
    setGeneralLayout("");
    onClose(generalLayout);
  }

  const handleChange = (event) => {
    setGeneralLayout(event.target.value);
  };

  const menuItems = Object.keys(standardLayouts).map((layoutName) => (
    <MenuItem key={layoutName} value={layoutName}>
      {layoutName}
    </MenuItem>
  ));

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select your keyboard layout below. The layout will determine the keys
          used for selecting cards in both the vertical and horizontal
          orientations. The layout is currently set to{" "}
          <b>
            <code>
              <KeyboardContext.Consumer>
                {(value) => value[0]}
              </KeyboardContext.Consumer>
            </code>
          </b>
          .
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel>Layout</InputLabel>
          <Select value={generalLayout} onChange={handleChange}>
            {menuItems}
          </Select>
        </FormControl>
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

export default KeyboardLayoutDialog;
