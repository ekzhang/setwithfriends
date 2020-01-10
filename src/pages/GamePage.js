import React, { useState, useEffect, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Redirect } from "react-router-dom";

import { removeCard, findSet, computeState } from "../util";
import firebase from "../firebase";
import Game from "../components/Game";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

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

  const handleSet = useCallback(
    vals => {
      let { deck } = computeState(game);
      deck = removeCard(deck, vals[0]);
      deck = removeCard(deck, vals[1]);
      deck = removeCard(deck, vals[2]);
      const gameRef = firebase.database().ref(`games/${gameId}`);
      gameRef.child("history").push({
        user: user.id,
        cards: vals,
        time: firebase.database.ServerValue.TIMESTAMP
      });
      if (!findSet(deck)) {
        gameRef.child("meta/status").set("done");
      }
    },
    [game, gameId, user.id]
  );

  if (redirect) return <Redirect push to={redirect} />;

  if (game === undefined) {
    return <NotFoundPage />;
  }

  if (!game) {
    return <LoadingPage />;
  }

  if (game.meta.status === "waiting") {
    return (
      <Container>
        <Box p={4}>
          <Typography variant="h4" align="center">
            Waiting for the game to start...
          </Typography>
        </Box>
      </Container>
    );
  }

  const spectating = !game.meta.users || !game.meta.users[user.id];

  const gameState = computeState(game);

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
      <Chat user={user} chatId={gameId} />
      <Modal className={classes.modal} open={game.meta.status === "done"}>
        <Paper className={classes.modalBox}>
          <Typography variant="h4" gutterBottom>
            The game has ended.
          </Typography>
          <Typography variant="body1">
            Winner: {game.meta.users[gameState.scores[0][0]].name}
          </Typography>
          {gameState.scores.length >= 2 && (
            <Typography variant="body2">
              Runner-up: {game.meta.users[gameState.scores[1][0]].name}
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
        <Game
          game={game}
          gameState={gameState}
          spectating={spectating}
          onSet={handleSet}
        />
      </Grid>
      <Grid item xs={4} lg={3} className={classes.sidePanel}>
        {/* Sidebar */}
        <Sidebar game={game} gameState={gameState} />
      </Grid>
    </Grid>
  );
}

export default GamePage;
