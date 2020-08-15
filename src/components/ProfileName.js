import React, { memo, useContext } from "react";

import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";

import firebase from "../firebase";
import ElapsedTime from "./ElapsedTime";
import User from "./User";
import { UserContext } from "../context";
import { generateName } from "../util";

const useStyles = makeStyles((theme) => ({
  vertIcon: {
    marginLeft: "auto",
    cursor: "pointer",
    "&:hover": {
      fill: "#f06292",
    },
    visibility: "hidden",
  },
  name: {
    "&:hover > $vertIcon": {
      visibility: "visible",
    },
  },
}));

function ProfileName({ userId }) {
  const theme = useTheme();
  const user = useContext(UserContext);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickVertIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleResetName = () => {
    firebase.database().ref(`users/${userId}/name`).set(generateName());
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <User
      id={userId}
      render={(player, userEl) => {
        const isOnline =
          player.connections && Object.keys(player.connections).length > 0;
        return (
          <section>
            <div
              style={{ display: "flex", flexDirection: "row", marginBottom: 6 }}
              className={classes.name}
            >
              <Typography variant="h4" style={{ overflowWrap: "anywhere" }}>
                {userEl}
              </Typography>
              {user.admin && (
                <MoreVertIcon
                  aria-controls="admin-menu"
                  color="inherit"
                  className={classes.vertIcon}
                  onClick={handleClickVertIcon}
                />
              )}
              <Menu
                id="admin-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleResetName}>Reset username</MenuItem>
              </Menu>
            </div>

            <Typography variant="body2" gutterBottom>
              Last seen:{" "}
              <span
                style={{
                  color: isOnline ? theme.palette.success.main : "inherit",
                  fontWeight: 700,
                }}
              >
                {isOnline ? (
                  "online now"
                ) : (
                  <ElapsedTime value={player.lastOnline} />
                )}
              </span>
            </Typography>
          </section>
        );
      }}
    />
  );
}

export default memo(ProfileName);
