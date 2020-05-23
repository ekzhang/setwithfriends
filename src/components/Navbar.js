import React, { useContext } from "react";

import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import SettingsIcon from "@material-ui/icons/Settings";

import { UserContext } from "../context";

function Navbar() {
  const user = useContext(UserContext);
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
            {user.name}
          </Link>
        </Typography>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
