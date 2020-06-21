import React, { useState, useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

import firebase from "../firebase";
import { UserContext } from "../context";
import User from "./User";
import InternalLink from "./InternalLink";
import PromptDialog from "./PromptDialog";

function Navbar({ themeType, handleChangeTheme }) {
  const user = useContext(UserContext);
  const [changeName, setChangeName] = useState(false);

  function handleChangeName(name) {
    setChangeName(false);
    if (name) {
      firebase.database().ref(`users/${user.id}/name`).set(name);
    }
  }

  return (
    <AppBar position="relative" color="transparent" elevation={0}>
      <Toolbar variant="dense">
        <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
          <InternalLink underline="none" color="inherit" to="/">
            Set with Friends
          </InternalLink>
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ marginLeft: "2em", marginRight: 8, minWidth: 0 }}
        >
          <InternalLink underline="none" to={`/profile/${user.id}`}>
            <User
              id={user.id}
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />
          </InternalLink>
        </Typography>
        <IconButton color="inherit" onClick={() => setChangeName(true)}>
          <Tooltip title="Change name">
            <EditIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" onClick={handleChangeTheme}>
          {themeType === "light" ? (
            <Tooltip title="Dark theme">
              <Brightness3Icon />
            </Tooltip>
          ) : (
            <Tooltip title="Light theme">
              <WbSunnyIcon />
            </Tooltip>
          )}
        </IconButton>
        <PromptDialog
          open={changeName}
          onClose={handleChangeName}
          title="Change Name"
          message="Enter your preferred display name below. This will be updated for all current, past, and future games."
          label="Name"
          maxLength={25}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
