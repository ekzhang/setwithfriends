import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import { Redirect } from "react-router-dom";

import { removeCard, checkSet } from "../util";
import SnackContent from "../components/SnackContent";
import { findSet, computeState } from "../util";
import firebase, { createGame } from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import Game from "../components/Game";
import User from "../components/User";
import Loading from "../components/Loading";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import GameSidebar from "../components/GameSidebar";
import GameChat from "../components/GameChat";
import ShareDialog from "../components/ShareDialog";
import { UserContext } from "../context";

const useStyles = makeStyles((theme) => ({
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.up("lg")]: {
      maxHeight: 543,
    },
    [theme.breakpoints.down("md")]: {
      maxHeight: 435,
    },
    [theme.breakpoints.down("xs")]: {
      maxHeight: 400,
    },
  },
  mainColumn: {
    display: "flex",
    alignItems: "center",
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
  const [selected, setSelected] = useState([]);
  const [snack, setSnack] = useState({ open: false });

  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);
  const [gameData, loadingGameData] = useFirebaseRef(`gameData/${gameId}`);

  // Reset card selection on update to game data
  useEffect(() => {
    setSelected([]);
  }, [gameData]);

  // Terminate the game if no sets are remaining
  useEffect(() => {
    if (!loadingGame && !loadingGameData && game && gameData) {
      const { current } = computeState(gameData);
      // Maximal cap set has size 20 (see: https://en.wikipedia.org/wiki/Cap_set)
      if (
        game.users &&
        user.id in game.users &&
        game.status === "ingame" &&
        current.length <= 20 &&
        !findSet(current)
      ) {
        firebase.database().ref(`games/${gameId}`).update({
          status: "done",
          endedAt: firebase.database.ServerValue.TIMESTAMP,
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
    const s1 = scores[u1] || 0;
    const s2 = scores[u2] || 0;
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  });

  function handleSet([c1, c2, c3]) {
    firebase.analytics().logEvent("find_set", { c1, c2, c3 });
    firebase.database().ref(`gameData/${gameId}/events`).push({
      c1,
      c2,
      c3,
      user: user.id,
      time: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  function handleClick(card) {
    if (game.status !== "ingame") {
      return;
    }
    if (spectating) {
      setSnack({
        open: true,
        variant: "warning",
        message: "You are spectating!",
      });
      return;
    }
    setSelected((selected) => {
      if (selected.includes(card)) {
        return removeCard(selected, card);
      } else {
        const vals = [...selected, card];
        if (vals.length === 3) {
          if (checkSet(...vals)) {
            handleSet(vals);
            setSnack({
              open: true,
              variant: "success",
              message: "Found a set!",
            });
          } else {
            setSnack({
              open: true,
              variant: "error",
              message: "Not a set!",
            });
          }
          return [];
        } else {
          return vals;
        }
      }
    });
  }

  function handleClear() {
    setSelected([]);
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") return;
    setSnack({ ...snack, open: false });
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
    firebase
      .analytics()
      .logEvent("play_again", { gameId: newId, access: game.access });
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
      <ShareDialog active={game.status === "done" && !spectating} />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snack.open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackContent
          variant={snack.variant || "info"}
          message={snack.message || ""}
          onClose={handleClose}
        />
      </Snackbar>
      <Grid container spacing={2}>
        <Box clone order={{ xs: 3, sm: 1 }}>
          <Grid item xs={12} sm={4} md={3} className={classes.sideColumn}>
            <Paper style={{ display: "flex", height: "100%", padding: 8 }}>
              <GameChat
                gameId={gameId}
                history={history}
                startedAt={game.startedAt}
              />
            </Paper>
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, sm: 2 }} position="relative">
          <Grid item xs={12} sm={8} md={6} className={classes.mainColumn}>
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
                {!spectating && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlayAgain}
                    style={{ marginTop: 12 }}
                    disabled={waiting}
                  >
                    {waiting ? <Loading /> : "Play Again"}
                  </Button>
                )}
              </Paper>
            </div>

            {/* Game area itself */}
            <Game
              deck={current}
              selected={selected}
              onClick={handleClick}
              onClear={handleClear}
            />
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
