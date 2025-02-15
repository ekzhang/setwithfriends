import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import useSound from "use-sound";

import failSfx from "../assets/failedSetSound.mp3";
import foundSfx from "../assets/successfulSetSound.mp3";
import Chat from "../components/Chat";
import DonateDialog from "../components/DonateDialog";
import Game from "../components/Game";
import GameSidebar from "../components/GameSidebar";
import Loading from "../components/Loading";
import SnackContent from "../components/SnackContent";
import User from "../components/User";
import { SettingsContext, UserContext } from "../context";
import firebase, { createGame, fetchStaleGame, finishGame } from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import useKeydown from "../hooks/useKeydown";
import {
  checkSet,
  checkSetUltra,
  computeState,
  findSet,
  hasHint,
  removeCard,
} from "../util";
import LoadingPage from "./LoadingPage";
import NotFoundPage from "./NotFoundPage";

const useStyles = makeStyles((theme) => ({
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.up("lg")]: {
      maxHeight: 543,
    },
    [theme.breakpoints.down("lg")]: {
      maxHeight: 435,
    },
    [theme.breakpoints.down("sm")]: {
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

function GamePage() {
  const user = useContext(UserContext);
  const { volume } = useContext(SettingsContext);
  const { id: gameId } = useParams();
  const classes = useStyles();

  const [waiting, setWaiting] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [selected, setSelected] = useState([]);
  const [snack, setSnack] = useState({ open: false });
  const [numHints, setNumHints] = useState(0);
  const [fetchingStaleGame, setFetchingStaleGame] = useState("not-stale");

  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);
  const [gameData, loadingGameData] = useFirebaseRef(`gameData/${gameId}`);
  const [playSuccess] = useSound(foundSfx);
  const [playFail] = useSound(failSfx);

  // Reset card selection and number of hints on update to game data
  useEffect(() => {
    setSelected([]);
    setNumHints(0);
  }, [gameData]);

  // Terminate the game if no sets are remaining
  const finishing = useRef(false);
  useEffect(() => {
    if (!loadingGame && !loadingGameData && game && gameData) {
      const gameMode = game.mode || "normal";
      const { current, history } = computeState(gameData, gameMode);
      if (game.status === "ingame" && !finishing.current) {
        let hasSet = false;
        if (gameMode === "setchain" && history.length > 0) {
          const { c1, c2, c3 } = history[history.length - 1];
          hasSet = findSet(current, gameMode, [c1, c2, c3]);
        } else {
          hasSet = findSet(current, gameMode, []);
        }

        if (!hasSet) {
          finishing.current = true;
          // Attempt to finish the game up to 5 times, before giving up
          (async () => {
            for (let i = 0; i < 5; i++) {
              try {
                await finishGame({ gameId });
                break;
              } catch (error) {
                const delay = 200 * (i + 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
              }
            }
            finishing.current = false;
          })();
        }
      }
    }
  });

  // Try to fetch the game from cloud storage, if archived due to being stale.
  useEffect(() => {
    if (!loadingGame && !loadingGameData) {
      if (game && gameData) {
        if (fetchingStaleGame !== "not-stale") {
          setFetchingStaleGame("not-stale");
        }
      } else {
        if (fetchingStaleGame === "not-stale") {
          setFetchingStaleGame("fetching");
          (async () => {
            // On success, the database should automatically update with game state.
            const { restored } = await fetchStaleGame({ gameId });
            if (!restored) {
              setFetchingStaleGame("failed");
            }
          })();
        }
      }
    }
  }, [loadingGame, loadingGameData, game, gameData, fetchingStaleGame, gameId]);

  useKeydown((event) => {
    if (
      event.ctrlKey === true &&
      event.keyCode === 13 &&
      game.status === "done"
    ) {
      handlePlayAgain();
    }
  });

  if (redirect) return <Navigate push to={redirect} />;

  if (
    loadingGame ||
    loadingGameData ||
    ((!game || !gameData) && fetchingStaleGame !== "failed")
  ) {
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

  const gameMode = game.mode || "normal";
  const spectating = !game.users || !(user.id in game.users);
  const maxHints = gameMode === "ultraset" ? 4 : 3;

  const { current, scores, history, boardSize } = computeState(
    gameData,
    gameMode,
  );

  const leaderboard = Object.keys(game.users).sort((u1, u2) => {
    const s1 = scores[u1] || 0;
    const s2 = scores[u2] || 0;
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  });

  function handleSet(cards) {
    const event =
      gameMode === "ultraset"
        ? { c1: cards[0], c2: cards[1], c3: cards[2], c4: cards[3] }
        : { c1: cards[0], c2: cards[1], c3: cards[2] };
    firebase.analytics().logEvent("find_set", event);
    firebase
      .database()
      .ref(`gameData/${gameId}/events`)
      .push({
        ...event,
        user: user.id,
        time: firebase.database.ServerValue.TIMESTAMP,
      });
  }

  let lastSet = [];
  if (gameMode === "setchain" && history.length > 0) {
    const { c1, c2, c3 } = history[history.length - 1];
    lastSet = [c1, c2, c3];
  }
  let answer = findSet(current.slice(0, boardSize), gameMode, lastSet);
  if (hasHint(game) && answer) {
    answer = answer.slice(0, numHints);
  } else {
    answer = null;
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
        if (gameMode === "normal" || gameMode === "setjr") {
          const vals = [...selected, card];
          if (vals.length === 3) {
            if (checkSet(...vals)) {
              handleSet(vals);
              if (volume === "on") playSuccess();
              setSnack({
                open: true,
                variant: "success",
                message: "Found a set!",
              });
            } else {
              if (volume === "on") playFail();
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
        } else if (gameMode === "ultraset") {
          const vals = [...selected, card];
          if (vals.length === 4) {
            let res = checkSetUltra(...vals);
            if (res) {
              handleSet(res);
              if (volume === "on") playSuccess();
              setSnack({
                open: true,
                variant: "success",
                message: "Found an UltraSet!",
              });
            } else {
              if (volume === "on") playFail();
              setSnack({
                open: true,
                variant: "error",
                message: "Not an UltraSet!",
              });
            }
            return [];
          } else {
            return vals;
          }
        } else if (gameMode === "setchain") {
          let vals = [];
          if (lastSet.includes(card)) {
            if (selected.length > 0 && lastSet.includes(selected[0])) {
              return [card, ...selected.slice(1)];
            } else {
              vals = [card, ...selected];
            }
          } else {
            vals = [...selected, card];
          }
          if (vals.length === 3) {
            if (lastSet.length > 0 && !lastSet.includes(vals[0])) {
              if (volume === "on") playFail();
              setSnack({
                open: true,
                variant: "error",
                message: "One card must be from the previous set!",
              });
            } else if (checkSet(...vals)) {
              handleSet(vals);
              if (volume === "on") playSuccess();
              setSnack({
                open: true,
                variant: "success",
                message: "Found a set chain!",
              });
            } else {
              if (volume === "on") playFail();
              setSnack({
                open: true,
                variant: "error",
                message: "Not a set chain!",
              });
            }
            return [];
          } else {
            return vals;
          }
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

  function handleAddHint() {
    setNumHints((numHints) => {
      if (numHints === maxHints) {
        return numHints;
      }
      return numHints + 1;
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
    const newGame = {
      gameId: newId,
      access: game.access,
      mode: game.mode,
      enableHint: game.enableHint,
    };
    firebase.analytics().logEvent("play_again", newGame);
    try {
      await createGame(newGame);
    } catch (error) {
      if (error.code !== "functions/already-exists") {
        alert(error.toString());
        setWaiting(false);
        return;
      }
    }
    setRedirect(`/room/${newId}`);
  }

  return (
    <Container sx={{ pb: 2 }}>
      <DonateDialog
        active={game.status === "done" && !spectating && !user.patron}
      />
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
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          order={{ xs: 3, sm: 1 }}
          className={classes.sideColumn}
        >
          <Paper style={{ display: "flex", height: "100%", padding: 8 }}>
            <Chat
              title="Game Chat"
              messageLimit={200}
              gameId={gameId}
              history={history}
              startedAt={game.startedAt}
              gameMode={gameMode}
            />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          order={{ xs: 1, sm: 2 }}
          position="relative"
          className={classes.mainColumn}
        >
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
            boardSize={boardSize}
            selected={selected}
            onClick={handleClick}
            onClear={handleClear}
            gameMode={gameMode}
            lastSet={lastSet}
            answer={answer}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          order={{ xs: 2, sm: 3 }}
          className={classes.sideColumn}
        >
          <GameSidebar game={game} scores={scores} leaderboard={leaderboard} />
          <Box mt={2}>
            {hasHint(game) && (
              <Button
                size="medium"
                variant="outlined"
                color="primary"
                fullWidth
                disabled={
                  numHints === maxHints || !answer || game.status === "done"
                }
                onClick={handleAddHint}
              >
                Add hint: {numHints}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GamePage;
