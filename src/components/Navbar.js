import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";

import { version } from "../config";
import { SettingsContext, UserContext } from "../context";
import firebase from "../firebase";
import AccountOptionsDialog from "./AccountOptionsDialog";
import ColorChoiceDialog from "./ColorChoiceDialog";
import InternalLink from "./InternalLink";
import KeyboardLayoutDialog from "./KeyboardLayoutDialog";
import PromptDialog from "./PromptDialog";
import User from "./User";
import UserColorDialog from "./UserColorDialog";

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
        <IconButton color="inherit" onClick={handleChangeVolume} size="large">
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
        <IconButton color="inherit" onClick={handleChangeTheme} size="large">
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
        <IconButton color="inherit" onClick={handleMenu} size="large">
          <Tooltip title="Settings">
            <SettingsIcon />
          </Tooltip>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
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
                underline="hover"
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
