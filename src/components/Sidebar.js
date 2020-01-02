import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import AlarmIcon from "@material-ui/icons/Alarm";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import moment from "moment";

import ColorSquare from "./ColorSquare";
import SetCard from "./SetCard";

const useStyles = makeStyles({
  alarm: { color: red[700], marginRight: 10, marginBottom: 3 },
  panelTitle: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6
  },
  logName: {
    marginLeft: 12,
    fontWeight: "bold"
  },
  historyTimeIcon: {
    marginRight: 12,
    "& span": {
      margin: "0 auto"
    }
  }
});

function Sidebar({ game, scores }) {
  const classes = useStyles();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const t = Date.now();
    setTime(t);
    const id = setInterval(() => setTime(t => t + 1000), 1000);
    return () => clearInterval(id);
  }, []);

  function formatTime(t) {
    const hours = Math.floor(t / (3600 * 1000));
    const rest = t % (3600 * 1000);
    return (hours ? `${hours}:` : "") + moment(rest).format("mm:ss");
  }

  const currentTime =
    game.meta.status === "done"
      ? Object.values(game.history).slice(-1)[0].time
      : time;

  return (
    <>
      <Box p={2} display="flex" alignItems="center" justifyContent="center">
        {/* Timer */}
        <AlarmIcon className={classes.alarm} fontSize="large" />
        <Typography variant="h4" align="center">
          {formatTime(currentTime - game.meta.started)}
        </Typography>
      </Box>
      <Divider />
      <Box maxHeight="40%" flexShrink={0} overflow="auto">
        {/* Scoreboard */}
        <Typography variant="h6" className={classes.panelTitle}>
          Scoreboard
        </Typography>
        <List disablePadding dense>
          {scores.map(([uid, score], idx) => (
            <ListItem key={uid} button>
              <ColorSquare color={game.meta.users[uid].color} />
              <ListItemText>
                {idx + 1}. {game.meta.users[uid].name} ({score} sets)
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box flexGrow={1} overflow="auto">
        {/* Log */}
        <Typography variant="h6" className={classes.panelTitle}>
          Game Log
        </Typography>
        <List disablePadding dense>
          {game.history &&
            Object.entries(game.history).map(([id, event]) => (
              <ListItem button key={id}>
                <ListItemIcon className={classes.historyTimeIcon}>
                  <span>[{formatTime(event.time - game.meta.started)}]</span>
                </ListItemIcon>
                <ListItemText>
                  <SetCard value={event.cards[0]} size="sm" />
                  <SetCard value={event.cards[1]} size="sm" />
                  <SetCard value={event.cards[2]} size="sm" />
                  <span className={classes.logName}>
                    {game.meta.users[event.user].name}
                  </span>
                </ListItemText>
              </ListItem>
            ))}
        </List>
      </Box>
    </>
  );
}

export default Sidebar;
