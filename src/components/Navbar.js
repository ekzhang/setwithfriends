import React, { useState, useContext } from "react";

import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import firebase from "../firebase";
import { UserContext } from "../context";
import User from "./User";
import PromptDialog from "./PromptDialog";

function Navbar() {
  const user = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [changeName, setChangeName] = useState(false);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleChangeName(name) {
    setChangeName(false);
    if (name) {
      firebase.database().ref(`users/${user.id}/name`).set(name);
    }
  }

  return (
    <AppBar position="relative" color="transparent" elevation={0}>
      <Toolbar variant="dense">
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link underline="none" color="inherit" component={RouterLink} to="/">
            Set with Friends
          </Link>
        </Typography>
        <Typography variant="subtitle1" style={{ marginRight: 8 }}>
          <Link
            underline="none"
            color="inherit"
            component={RouterLink}
            to={`/profile/${user.id}`}
          >
            <User id={user.id} />
          </Link>
        </Typography>
        <IconButton color="inherit" onClick={handleMenu}>
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={anchorEl !== null}
          onClose={handleCloseMenu}
        >
          <MenuItem
            component={RouterLink}
            to={`/profile/${user.id}`}
            onClick={handleCloseMenu}
          >
            My profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChangeName(true);
              handleCloseMenu();
            }}
          >
            Change name
          </MenuItem>
          <MenuItem
            component={Link}
            target="_blank"
            rel="noopener"
            href="https://github.com/ekzhang/setwithfriends"
            onClick={handleCloseMenu}
          >
            View on GitHub
          </MenuItem>
        </Menu>
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
