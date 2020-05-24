import React, { useState, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router-dom";

import { removeCard, findSet, computeState } from "../util";
import firebase from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import Game from "../components/Game";
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
}));

function GamePage({ match }) {
  const user = useContext(UserContext);
  const gameId = match.params.id;
  const classes = useStyles();
  const [redirect, setRedirect] = useState(null);

  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);
  const [gameData, loadingGameData] = useFirebaseRef(`gameData/${gameId}`);

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
    <Container>
      <Grid container spacing={2}>
        <Box clone order={{ xs: 3, sm: 1 }}>
          <Grid item xs={12} sm={4} md={3} className={classes.sideColumn}>
            <Typography variant="overline">Game Chat</Typography>
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={8} md={6}>
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
