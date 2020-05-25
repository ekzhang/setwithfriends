import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router-dom";

import { findSet, computeState } from "../util";
import firebase, { createGame } from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import Game from "../components/Game";
import User from "../components/User";
import Loading from "../components/Loading";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import GameSidebar from "../components/GameSidebar";
import { UserContext } from "../context";

const useStyles = makeStyles((theme) => ({
  sideColumn: {
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  doneOverlay: {
    position: "absolute",
    width: "calc(100% - 16px)",
    height: "calc(100% - 16px)",
    borderRadius: 4,
    background: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  doneModal: {
    padding: theme.spacing(3),
    textAlign: "center",
  },
}));

function GamePage({ match }) {
  const user = useContext(UserContext);
  const gameId = match.params.id;
  const classes = useStyles();
  const [waiting, setWaiting] = useState(false);
  const [redirect, setRedirect] = useState(null);

  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);
  const [gameData, loadingGameData] = useFirebaseRef(`gameData/${gameId}`);

  // Terminate the game if no sets are remaining
  useEffect(() => {
    if (!loadingGame && !loadingGameData && game && gameData) {
      const { current } = computeState(gameData);
      // Maximal cap set has size 20 (see: https://en.wikipedia.org/wiki/Cap_set)
      if (
        game.status === "ingame" &&
        current.length <= 20 &&
        !findSet(current)
      ) {
        firebase
          .database()
          .ref(`games/${gameId}`)
          .transaction((game) => {
            if (game.status === "ingame") {
              game.status = "done";
              game.endedAt = firebase.database.ServerValue.TIMESTAMP;
            }
            return game;
          });
      }
    }
  });

  if (redirect) return <Redirect push to={redirect} />;

  if (loadingGame || loadingGameData) {
    return <LoadingPage />;
  }

  if (!game || !gameData) {
    return <NotFoundPage />;
  }

  if (game.status === "waiting") {
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

  const spectating = !game.users || !(user.id in game.users);
  const { current, scores, history } = computeState(gameData);
  const leaderboard = Object.keys(game.users).sort((u1, u2) => {
    if (scores[u1] !== scores[u2]) return scores[u2] - scores[u1];
    return u1 < u2 ? -1 : 1;
  });

  function handleSet([c1, c2, c3]) {
    // Asynchronous timeout fixes warning: https://fb.me/setstate-in-render
    setTimeout(() => {
      const gameRef = firebase.database().ref(`gameData/${gameId}`);
      gameRef.child("events").push({
        c1,
        c2,
        c3,
        user: user.id,
        time: firebase.database.ServerValue.TIMESTAMP,
      });
    });
  }

  async function handlePlayAgain() {
    const idx = gameId.lastIndexOf("-");
    let id = gameId,
      num = 0;
    if (gameId.slice(idx + 1).match(/[0-9]+/)) {
      id = gameId.slice(0, idx);
      num = parseInt(gameId.slice(idx + 1));
    }
    setWaiting(true);
    const newId = `${id}-${num + 1}`;
    try {
      await createGame({ gameId: newId, access: game.access });
    } catch (error) {
      if (error.code !== "already-exists") {
        alert(error.toString());
        return;
      }
    }
    setRedirect(`/room/${newId}`);
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Box clone order={{ xs: 3, sm: 1 }}>
          <Grid item xs={12} sm={4} md={3} className={classes.sideColumn}>
            <Typography variant="overline">Game Chat</Typography>
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, sm: 2 }} position="relative">
          <Grid item xs={12} sm={8} md={6}>
            {/* Backdrop, to be active when the game ends */}
            <div
              className={classes.doneOverlay}
              style={{
                opacity: game.status === "done" ? 1 : 0,
                visibility: game.status === "done" ? "visible" : "hidden",
              }}
            >
              <Paper elevation={3} className={classes.doneModal}>
                <Typography variant="h5" gutterBottom>
                  The game has ended.
                </Typography>
                <Typography variant="body1">
                  Winner: <User id={leaderboard[0]} />
                </Typography>
                {leaderboard.length >= 2 && (
                  <Typography variant="body2">
                    Runner-up: <User id={leaderboard[1]} />
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlayAgain}
                  style={{ marginTop: 12 }}
                  disabled={waiting}
                >
                  {waiting ? <Loading /> : "Play Again"}
                </Button>
              </Paper>
            </div>

            {/* Game area itself */}
            <Game deck={current} spectating={spectating} onSet={handleSet} />
          </Grid>
        </Box>
        <Box clone order={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} md={3} className={classes.sideColumn}>
            <GameSidebar
              game={game}
              scores={scores}
              leaderboard={leaderboard}
            />
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default GamePage;
