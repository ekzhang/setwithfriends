import { withTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Select from "@material-ui/core/Select";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useStorage from "../hooks/useStorage";
import { MenuItem } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";

function KeyboardLayoutDialog(props) {
  const { open, onClose, title } = props;

  const [generalLayout, setGeneralLayout] = useStorage(
    "generalKeyboardLayout",
    "QWERTY"
  );

  const standardLayouts = {
    QWERTY: {
      verticalLayout: "123qweasdzxcrtyfghvbn",
      horizontalLayout: "qazwsxedcrfvtgbyhnujm",
      orientationChangeKey: ";",
    },
    AZERTY: {
      verticalLayout: '1é"azeqsdwxcrtyfghvbn',
      horizontalLayout: "aqwzsxedcrfvtgbyhnuj;",
      orientationChangeKey: "m",
    },
    QWERTZ: {
      verticalLayout: "123qweasdyxcrtzfghvbn",
      horizontalLayout: "qaywsxedcrfvtgbzhnujm",
      orientationChangeKey: "p",
    },
    Dvorak: {
      verticalLayout: "123',.aoe;qjpyfuidkxb",
      horizontalLayout: "'a;,oq.ejpukyixfdbghm",
      orientationChangeKey: "s",
    },
    Colemak: {
      verticalLayout: "123qwfarszxcpgjtdhvbk",
      horizontalLayout: "qazwrxfscptvgdbjhklnm",
      orientationChangeKey: "o",
    },
    Workman: {
      verticalLayout: "123qdrashzxmwbjtgycvk",
      horizontalLayout: "qazdsxrhmwtcbgvjykfnl",
      orientationChangeKey: "i",
    },
  };

  const previousLayout = generalLayout;

  function handleClose() {
    setGeneralLayout(previousLayout);
    onClose(null);
  }

  function handleSubmit() {
    onClose(standardLayouts[generalLayout]);
  }

  const handleChange = (event) => {
    setGeneralLayout(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select your keyboard layout below. The layout will determine the keys
          used for selecting cards in both the vertical and horizontal
          orientations. The changes will take effect in the next game or upon
          reloading the page.
        </DialogContentText>
        <Select value={generalLayout} onChange={handleChange}>
          <MenuItem value={"QWERTY"}>QWERTY</MenuItem>
          <MenuItem value={"AZERTY"}>AZERTY</MenuItem>
          <MenuItem value={"QWERTZ"}>QWERTZ</MenuItem>
          <MenuItem value={"Dvorak"}>Dvorak</MenuItem>
          <MenuItem value={"Colemak"}>Colemak</MenuItem>
          <MenuItem value={"Workman"}>Workman</MenuItem>
        </Select>
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

export default withTheme(KeyboardLayoutDialog);
