import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { red } from "@mui/material/colors";
import { useContext, useState } from "react";

import { UserContext } from "../context";
import firebase, { authProvider } from "../firebase";

function AccountOptionsDialog({ open, onClose }) {
  const user = useContext(UserContext);
  const [linkError, setLinkError] = useState(null);

  function handleLink() {
    firebase
      .auth()
      .currentUser.linkWithPopup(authProvider)
      .then((credential) => {
        // This is necessary because `linkWithPopup` does not automatically
        // trigger an auth state change on success.
        return user.setAuthUser({ ...credential.user });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/cancelled-popup-request":
          case "auth/popup-closed-by-user":
            break;
          case "auth/credential-already-in-use":
            setLinkError("Account is already associated with a different user");
            break;
          default:
            alert(error.toString()); // Should not be reached
        }
      });
  }

  function handleLogin() {
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .catch((error) => {
        switch (error.code) {
          case "auth/cancelled-popup-request":
          case "auth/popup-closed-by-user":
            break;
          default:
            alert(error.toString()); // Should not be reached
        }
      });
  }

  function handleLogout() {
    firebase.auth().signOut();
  }

  function handleClose() {
    setLinkError(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Account options</DialogTitle>
      {user.authUser.isAnonymous ? (
        <DialogContent>
          <DialogContentText gutterBottom>
            You are currently playing as an anonymous user. Your profile will be
            automatically saved for all future games from this browser.
          </DialogContentText>
          <DialogContentText gutterBottom>
            If you want to play with the same user from another computer or
            mobile device, you can link your profile to a Google account below.
            This can <em>only be done once</em> per account.
          </DialogContentText>
          <DialogContentText gutterBottom component="div">
            <Button
              onClick={handleLink}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              <PersonAddIcon style={{ marginRight: "0.2em" }} />
              Link Google Account
            </Button>
          </DialogContentText>
          {linkError && (
            <DialogContentText
              gutterBottom
              style={{
                color: red[500],
              }}
            >
              Error: {linkError}
            </DialogContentText>
          )}
          <DialogContentText gutterBottom>
            If you have already linked an account, you can sign in here.
          </DialogContentText>
          <DialogContentText component="div">
            <Button
              onClick={handleLogin}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              <VpnKeyIcon style={{ marginRight: "0.2em" }} />
              Sign in with Google
            </Button>
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText gutterBottom>
            You are currently signed in as{" "}
            <strong>{user.authUser.email}</strong>.
          </DialogContentText>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            <VpnKeyIcon style={{ marginRight: "0.2em" }} />
            Sign out
          </Button>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccountOptionsDialog;
