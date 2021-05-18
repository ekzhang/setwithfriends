import { useState, useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import firebase from "../firebase";
import { UserContext, SettingsContext } from "../context";
import { version } from "../config";
import User from "./User";
import InternalLink from "./InternalLink";
import PromptDialog from "./PromptDialog";
import UserColorDialog from "./UserColorDialog";
import ColorChoiceDialog from "./ColorChoiceDialog";
import KeyboardLayoutDialog from "./KeyboardLayoutDialog";
import AccountOptionsDialog from "./AccountOptionsDialog";

function Navbar({
  themeType,
  handleChangeTheme,
  customColors,
  handleCustomColors,
}) {
  const user = useContext(UserContext);
  const settings = useContext(SettingsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changeName, setChangeName] = useState(false);
  const [changeUserColor, setChangeUserColor] = useState(false);
  const [changeCardColors, setChangeCardColors] = useState(false);
  const [changeKeyboardLayout, setChangeKeyboardLayout] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleChangeName(name) {
    setChangeName(false);
    name = (name || "").trim();
    if (name) {
      firebase.database().ref(`users/${user.id}/name`).set(name);
    }
  }

  function handleChangeCardColors(colorMap) {
    setChangeCardColors(false);
    if (colorMap) {
      customColors[themeType] = colorMap;
      handleCustomColors(customColors);
    }
  }

  function handleChangeVolume() {
    settings.setVolume((volume) => (volume === "on" ? "off" : "on"));
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
        <IconButton color="inherit" onClick={handleChangeVolume}>
          {settings.volume === "on" ? (
            <Tooltip title="Mute">
              <VolumeUpIcon />
            </Tooltip>
          ) : (
            <Tooltip title="Unmute">
              <VolumeOffIcon />
            </Tooltip>
          )}
        </IconButton>
        <IconButton color="inherit" onClick={handleChangeTheme}>
          {themeType === "light" ? (
            <Tooltip title="Dark theme">
              <Brightness4Icon />
            </Tooltip>
          ) : (
            <Tooltip title="Light theme">
              <Brightness7Icon />
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
          <Typography variant="subtitle1" align="center">
            {version ? `Version ${version}` : "Development Version"}
          </Typography>
          {version && (
            <Typography variant="subtitle2" align="center">
              <Link
                target="_blank"
                rel="noopener"
                href={`https://github.com/ekzhang/setwithfriends/releases/tag/v${version}`}
              >
                Release Notes
              </Link>
            </Typography>
          )}
          <Divider style={{ margin: "8px 0" }} />
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
              setChangeUserColor(true);
              handleCloseMenu();
            }}
          >
            Change user color
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChangeCardColors(true);
              handleCloseMenu();
            }}
          >
            Change card colors
          </MenuItem>
          <MenuItem
            onClick={() => {
              setChangeKeyboardLayout(true);
              handleCloseMenu();
            }}
          >
            Change keyboard layout
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
        <UserColorDialog
          open={changeUserColor}
          onClose={() => setChangeUserColor(false)}
          title="Change User Color"
        />
        <ColorChoiceDialog
          open={changeCardColors}
          onClose={handleChangeCardColors}
          title="Change Card Colors"
        />
        <KeyboardLayoutDialog
          open={changeKeyboardLayout}
          onClose={() => setChangeKeyboardLayout(false)}
          title="Change Keyboard Layout"
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
