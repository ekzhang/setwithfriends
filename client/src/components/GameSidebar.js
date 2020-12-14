import AlarmIcon from "@material-ui/icons/Alarm";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import SnoozeIcon from "@material-ui/icons/Snooze";
import { useLocation, Link as RouterLink } from "react-router-dom";

import User from "./User";
import Subheading from "./Subheading";
import useMoment from "../hooks/useMoment";
import { formatTime } from "../util";

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
    color: theme.alarm,
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
              component={Typography}
              variant="body2"
              noWrap
              render={(user, userEl) => (
                <ListItem button component={RouterLink} to={`/profile/${uid}`}>
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
                </ListItem>
              )}
            />
          ))}
        </List>
      </div>
    </Paper>
  );
}

export default GameSidebar;
