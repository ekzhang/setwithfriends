import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

function AccountOptionsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Account options</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          You are currently playing as an anonymous user. Your profile will be
          automatically saved for all future games from this browser.
        </DialogContentText>
        <DialogContentText gutterBottom>
          If you want to play with the same user from another computer or mobile
          device, you can link your profile to a Google account below. This can{" "}
          <em>only be done once</em> per account.
        </DialogContentText>
        <DialogContentText gutterBottom component="div">
          <Button onClick={null} variant="outlined" color="secondary" fullWidth>
            <PersonAddIcon style={{ marginRight: "0.2em" }} />
            Link Google Account
          </Button>
        </DialogContentText>
        <DialogContentText gutterBottom>
          If you have already linked a profile, you can sign in here.
        </DialogContentText>
        <DialogContentText gutterBottom component="div">
          <Button onClick={null} variant="outlined" color="secondary" fullWidth>
            <VpnKeyIcon style={{ marginRight: "0.2em" }} />
            Sign in with Google
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccountOptionsDialog;
