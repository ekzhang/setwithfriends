import AlarmIcon from "@mui/icons-material/Alarm";
import SnoozeIcon from "@mui/icons-material/Snooze";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { Link as RouterLink, useLocation } from "react-router-dom";

import useMoment from "../hooks/useMoment";
import { formatTime } from "../util";
import Subheading from "./Subheading";
import User from "./User";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 8,
  },
  timer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  alarm: {
    color: theme.custom.alarm,
    marginRight: 10,
    marginBottom: 3,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
  },
}));

function GameSidebar({ game, scores, leaderboard }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const time = useMoment(500);

  const gameTime = game.status === "done" ? game.endedAt : time;

  return (
    <Paper className={classes.sidebar}>
      {/* Timer */}
      <div className={classes.timer} style={{ marginTop: 6 }}>
        <AlarmIcon className={classes.alarm} fontSize="large" />
        <Typography variant="h4" align="center">
          {/* Hide the sub-second time resolution while game is active to
          avoid stressing beginners. */}
          {formatTime(gameTime - game.startedAt, game.status !== "done")}
        </Typography>
      </div>
      <Divider style={{ margin: "8px 0" }} />
      {/* Scoreboard */}
      <div className={classes.panel}>
        <Subheading>Scoreboard</Subheading>
        <List dense disablePadding style={{ overflowY: "auto" }}>
          {leaderboard.map((uid) => (
            <User
              key={uid}
              id={uid}
              showRating={game.mode || "normal"}
              component={Typography}
              variant="body2"
              noWrap
              render={(user, userEl) => (
                <ListItemButton component={RouterLink} to={`/profile/${uid}`}>
                  {game.status === "ingame" && (
                    <ListItemIcon>
                      {user.connections &&
                      Object.values(user.connections).includes(pathname) ? (
                        <Tooltip title="Active player">
                          <SportsEsportsIcon />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Disconnected player">
                          <SnoozeIcon />
                        </Tooltip>
                      )}
                    </ListItemIcon>
                  )}
                  <ListItemText disableTypography>{userEl}</ListItemText>
                  <ListItemText
                    style={{
                      flex: "0 0 36px",
                      textAlign: "right",
                    }}
                  >
                    <strong>{scores[uid] || 0}</strong>
                  </ListItemText>
                </ListItemButton>
              )}
            />
          ))}
        </List>
      </div>
    </Paper>
  );
}

export default GameSidebar;
