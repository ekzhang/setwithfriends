import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { Redirect } from "react-router-dom";

import { removeCard, findSet } from "../util";
import firebase from "../firebase";
import Game from "../components/Game";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import Sidebar from "../components/Sidebar";

const useStyles = makeStyles(theme => ({
  container: {
    height: "100%"
  },
  gamePanel: {
    height: "100%",
    display: "flex"
  },
  sidePanel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: theme.palette.background.paper,
    borderLeft: "1px solid lightgray"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalBox: {
    outline: 0,
    padding: 28,
    textAlign: "center"
  },
  play: {
    marginTop: 14
  }
}));

function GamePage({ user, gameId }) {
  const classes = useStyles();
  const [game, setGame] = useState(null);
  const [redirect, setRedirect] = useState(null);

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

  if (redirect) return <Redirect push to={redirect} />;

  if (game === undefined) {
    return <NotFoundPage />;
  }

  if (!game) {
    return <LoadingPage />;
  }

  const spectating = !game.meta.users || !game.meta.users[user.id];

  const scoreMap = {};
  for (const uid of Object.keys(game.meta.users)) {
    scoreMap[uid] = 0;
  }
  if (game.history) {
    for (const event of Object.values(game.history)) {
      scoreMap[event.user] += 1;
    }
  }

  const scores = Object.entries(scoreMap).sort(([u1, s1], [u2, s2]) => {
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  });

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
    if (!findSet(deck)) {
      gameRef.child("meta/status").set("done");
    }
  }

  function handlePlayAgain() {
    const idx = gameId.lastIndexOf("-");
    let id = gameId,
      num = 0;
    if (gameId.slice(idx + 1).match(/[0-9]+/)) {
      id = gameId.slice(0, idx);
      num = parseInt(gameId.slice(idx + 1));
    }
    setRedirect(`/room/${id}-${num + 1}`);
  }

  return (
    <Grid container spacing={0} className={classes.container}>
      <Modal className={classes.modal} open={game.meta.status === "done"}>
        <Paper className={classes.modalBox}>
          <Typography variant="h4" gutterBottom>
            The game has ended.
          </Typography>
          <Typography variant="body1">
            Winner: {game.meta.users[scores[0][0]].name}
          </Typography>
          {scores.length >= 2 && (
            <Typography variant="body2">
              Runner-up: {game.meta.users[scores[1][0]].name}
            </Typography>
          )}
          <Button
            className={classes.play}
            variant="contained"
            color="primary"
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </Paper>
      </Modal>
      <Grid item xs={8} lg={9} className={classes.gamePanel}>
        {/* Game Area */}
        <Game game={game} spectating={spectating} onSet={handleSet} />
      </Grid>
      <Grid item xs={4} lg={3} className={classes.sidePanel}>
        {/* Sidebar */}
        <Sidebar game={game} scores={scores} />
      </Grid>
    </Grid>
  );
}

export default GamePage;
