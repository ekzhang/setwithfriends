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
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

import firebase from "../firebase";
import { UserContext } from "../context";
import User from "./User";
import PromptDialog from "./PromptDialog";

function Navbar({ themeType, handleChangeTheme }) {
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
        <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
          <Link underline="none" color="inherit" component={RouterLink} to="/">
            Set with Friends
          </Link>
        </Typography>
        <Link
          underline="none"
          component={RouterLink}
          style={{ maxWidth: "45%", marginLeft: "2em", marginRight: 8 }}
          to={`/profile/${user.id}`}
        >
          <User
            component={Typography}
            variant="subtitle1"
            noWrap
            id={user.id}
          />
        </Link>
        <IconButton color="inherit" onClick={handleChangeTheme}>
          {themeType === "light" ? (
            <Brightness3Icon></Brightness3Icon>
          ) : (
            <WbSunnyIcon></WbSunnyIcon>
          )}
        </IconButton>
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
            onClick={() => {
              setChangeName(true);
              handleCloseMenu();
            }}
          >
            Change name
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
