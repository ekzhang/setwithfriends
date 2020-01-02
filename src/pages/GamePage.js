import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AlarmIcon from "@material-ui/icons/Alarm";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import moment from "moment";

import { removeCard } from "../util";
import firebase from "../firebase";
import SetCard from "../components/SetCard";
import Game from "../components/Game";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import ColorSquare from "../components/ColorSquare";

const useStyles = makeStyles(theme => ({
  container: {
    height: "100%"
  },
  gamePanel: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  sidePanel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: theme.palette.background.paper,
    borderLeft: "1px solid lightgray"
  },
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
}));

function GamePage({ user, gameId }) {
  const classes = useStyles();
  const [game, setGame] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    function update(snapshot) {
      if (!snapshot.exists()) setGame(undefined);
      else setGame(snapshot.val());
    }
    const gameRef = firebase.database().ref(`games/${gameId}`);
    gameRef.on("value", update);
    return () => {
      gameRef.off("value", update);
    };
  }, [gameId]);

  useEffect(() => {
    const t = Date.now();
    setTime(t);
    const id = setInterval(() => setTime(t => t + 1000), 1000);
    return () => clearInterval(id);
  }, []);

  if (game === undefined) {
    return <NotFoundPage />;
  }

  if (!game) {
    return <LoadingPage />;
  }

  if (!game.meta.users || !game.meta.users[user.id]) {
    return <h1>Sorry, spectating not supported yet.</h1>;
  }

  const scores = {};
  for (const uid of Object.keys(game.meta.users)) {
    scores[uid] = 0;
  }
  if (game.history) {
    for (const event of Object.values(game.history)) {
      scores[event.user] += 1;
    }
  }

  function handleSet(vals) {
    let deck = game.deck;
    deck = removeCard(deck, vals[0]);
    deck = removeCard(deck, vals[1]);
    deck = removeCard(deck, vals[2]);
    const gameRef = firebase.database().ref(`games/${gameId}`);
    gameRef.child("deck").set(deck);
    gameRef.child("history").push({
      user: user.id,
      cards: vals,
      time: Date.now()
    });
  }

  function compare([u1, s1], [u2, s2]) {
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  }

  function formatTime(t) {
    const hours = Math.floor(t / (3600 * 1000));
    const rest = t % (3600 * 1000);
    return (hours ? `${hours}:` : "") + moment(rest).format("mm:ss");
  }

  return (
    <Grid container spacing={0} className={classes.container}>
      <Grid item xs={8} lg={9} className={classes.gamePanel}>
        {/* Game Area */}
        <Game game={game} onSet={handleSet} />
      </Grid>
      <Grid item xs={4} lg={3} className={classes.sidePanel}>
        {/* Sidebar */}
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="4em"
        >
          {/* Timer */}
          <AlarmIcon className={classes.alarm} fontSize="large" />
          <Typography variant="h4" align="center">
            {formatTime(time - game.meta.started)}
          </Typography>
        </Box>
        <Divider />
        <Box maxHeight="40%" flexShrink={0} overflow="auto">
          {/* Scoreboard */}
          <Typography variant="h6" className={classes.panelTitle}>
            Scoreboard
          </Typography>
          <List disablePadding dense>
            {Object.entries(scores)
              .sort(compare)
              .map(([uid, score], idx) => (
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
      </Grid>
    </Grid>
  );
}

export default GamePage;
