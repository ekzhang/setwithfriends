import React, { useState, useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

import firebase from "../firebase";
import { UserContext } from "../context";
import User from "./User";
import InternalLink from "./InternalLink";
import PromptDialog from "./PromptDialog";
import ColorChoiceDialog from "./ColorChoiceDialog";
import AccountOptionsDialog from "./AccountOptionsDialog";

function Navbar({
  themeType,
  handleChangeTheme,
  customColors,
  handleCustomColors,
}) {
  const user = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [changeName, setChangeName] = useState(false);
  const [changeColors, setChangeColors] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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

  function handleChangeColors(colorMap) {
    setChangeColors(false);
    if (colorMap) {
      customColors[themeType] = colorMap;
      handleCustomColors(customColors);
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
        <IconButton color="inherit" onClick={handleMenu}>
          <Tooltip title="Settings">
            <SettingsIcon />
          </Tooltip>
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
          <MenuItem
            onClick={() => {
              setChangeColors(true);
              handleCloseMenu();
            }}
          >
            Change colors
          </MenuItem>
          <MenuItem
            onClick={() => {
              setShowOptions(true);
              handleCloseMenu();
            }}
          >
            Account options
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
        <ColorChoiceDialog
          open={changeColors}
          onClose={handleChangeColors}
          title="Change Colors"
          key={themeType}
        />
        <AccountOptionsDialog
          open={showOptions}
          onClose={() => setShowOptions(false)}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
