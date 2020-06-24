import React, { memo, useState } from "react";

import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";

import ElapsedTime from "./ElapsedTime";
import User from "./User";

const useStyles = makeStyles((theme) => ({
  vertIcon: {
    marginLeft: "auto",
    cursor: "pointer",
    "&:hover": {
      fill: "pink",
    },
  },
}));

function ProfileName({ userId }) {
  const theme = useTheme();
  const classes = useStyles();

  const [showVertIcon, setShowVertIcon] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickVertIcon = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
    setShowVertIcon(false);
  };

  return (
    <User
      id={userId}
      render={(user, userEl) => {
        const isOnline =
          user.connections && Object.keys(user.connections).length > 0;
        return (
          <section>
            <div
              style={{ display: "flex", flexDirection: "row" }}
              onMouseEnter={() => setShowVertIcon(true)}
              onMouseLeave={() => setShowVertIcon(false)}
            >
              <Typography
                variant="h4"
                gutterBottom
                style={{ overflowWrap: "anywhere" }}
              >
                {userEl}
              </Typography>
              <MoreVertIcon
                aria-controls="admin-menu"
                color="inherit"
                className={classes.vertIcon}
                style={{
                  opacity: `${showVertIcon ? 1 : 0}`,
                }}
                onClick={(e) => handleClickVertIcon(e)}
              />
              <Menu
                id="admin-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuOpen}
                onClose={handleClose}
              >
                <MenuItem>Reset username</MenuItem>
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
                  <ElapsedTime value={user.lastOnline} />
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
