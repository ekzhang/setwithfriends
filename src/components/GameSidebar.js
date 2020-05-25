import React from "react";

import AlarmIcon from "@material-ui/icons/Alarm";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import SnoozeIcon from "@material-ui/icons/Snooze";
import moment from "moment";
import { useLocation, Link as RouterLink } from "react-router-dom";

import User from "./User";
import useMoment from "../hooks/useMoment";

const useStyles = makeStyles((theme) => ({
  timer: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  alarm: {
    color: red[700],
    marginRight: 10,
    marginBottom: 3,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

function formatTime(t) {
  t = Math.max(t, 0);
  const hours = Math.floor(t / (3600 * 1000));
  const rest = t % (3600 * 1000);
  return (hours ? `${hours}:` : "") + moment(rest).format("mm:ss");
}

function GameSidebar({ game, scores, leaderboard }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const time = useMoment(500);

  const gameTime = game.status === "done" ? game.endedAt : time;

  return (
    <>
      {/* Timer */}
      <div className={classes.timer}>
        <AlarmIcon className={classes.alarm} fontSize="large" />
        <Typography variant="h4" align="center">
          {formatTime(gameTime - game.startedAt)}
        </Typography>
      </div>
      {/* Scoreboard */}
      <div className={classes.panel}>
        <Typography variant="overline">Scoreboard</Typography>
        <List dense disablePadding style={{ overflowY: "auto" }}>
          {leaderboard.map((uid) => (
            <User
              key={uid}
              id={uid}
              render={(user, userEl) => (
                <ListItem button component={RouterLink} to={`/profile/${uid}`}>
                  <ListItemIcon>
                    {user.connections &&
                    Object.values(user.connections).includes(pathname) ? (
                      <SportsEsportsIcon />
                    ) : (
                      <SnoozeIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    {userEl} — {scores[uid] || 0}{" "}
                    {scores[uid] === 1 ? "set" : "sets"}
                  </ListItemText>
                </ListItem>
              )}
            />
          ))}
        </List>
      </div>
    </>
  );
}

export default GameSidebar;