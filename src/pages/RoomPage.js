import { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LinkIcon from "@material-ui/icons/Link";
import DoneIcon from "@material-ui/icons/Done";
import { Redirect, useHistory } from "react-router-dom";

import useFirebaseRef from "../hooks/useFirebaseRef";
import LoadingPage from "./LoadingPage";
import NotFoundPage from "./NotFoundPage";
import SimpleInput from "../components/SimpleInput";
import RoomUserList from "../components/RoomUserList";
import Subheading from "../components/Subheading";
import Chat from "../components/Chat";
import firebase from "../firebase";
import { UserContext } from "../context";
import GameSettings from "../components/GameSettings";

const useStyles = makeStyles((theme) => ({
  subpanel: {
    background: theme.palette.background.panel,
    padding: theme.spacing(1),
    borderRadius: 4,
  },
  shareLink: {
    display: "flex",
    alignItems: "center",
    "& > input": {
      flexGrow: 1,
      color: theme.palette.secondary.main,
    },
  },
  chatPanel: {
    display: "flex",
    flexDirection: "column",
    height: 400,
    padding: 8,
  },
  modeSelection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
}));

function RoomPage({ match, location }) {
  const user = useContext(UserContext);
  const gameId = match.params.id;
  const classes = useStyles();
  const history = useHistory();

  const [copiedLink, setCopiedLink] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);

  useEffect(() => {
    if (
      !leaving &&
      game &&
      game.status === "waiting" &&
      (!game.users || !(user.id in game.users))
    ) {
      const updates = {
        [`games/${gameId}/users/${user.id}`]:
          firebase.database.ServerValue.TIMESTAMP,
        [`userGames/${user.id}/${gameId}`]: game.createdAt,
      };
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => firebase.analytics().logEvent("join_game", { gameId }))
        .catch((reason) => {
          console.warn(`Failed to join game (${reason})`);
        });
    }
  }, [user.id, game, gameId, leaving]);

  if (loadingGame) {
    return <LoadingPage />;
  }

  if (!game) {
    return <NotFoundPage />;
  }

  if (game.status !== "waiting" && !leaving) {
    return <Redirect to={`/game/${gameId}`} />;
  }

  // Current href, without the query string or hash
  const link = window.location.origin + location.pathname;

  function handleCopy() {
    navigator.clipboard.writeText(link).then(() => setCopiedLink(true));
  }

  function startGame() {
    firebase.database().ref(`games/${gameId}`).update({
      status: "ingame",
      startedAt: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  function leaveGame() {
    setLeaving(true);
    const updates = {
      [`games/${gameId}/users/${user.id}`]: null,
      [`userGames/${user.id}/${gameId}`]: null,
    };
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => history.push("/"))
      .catch((reason) => {
        console.warn(`Failed to leave game (${reason})`);
        setLeaving(false);
      });
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Box clone order={{ xs: 2, sm: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <Paper className={classes.chatPanel}>
              <Chat title="Game Chat" messageLimit={200} gameId={gameId} />
            </Paper>
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={8} md={9}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h4" gutterBottom>
                Waiting Room{" "}
                <Tooltip
                  placement="right"
                  title={
                    game.access === "public"
                      ? "Anyone can join this game."
                      : "Only players with the link can join this game."
                  }
                >
                  <span style={{ opacity: 0.4 }}>
                    [{game.access === "public" ? "Public" : "Private"}]
                  </span>
                </Tooltip>
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <div className={classes.subpanel}>
                    <Subheading>Players</Subheading>
                    <RoomUserList game={game} gameId={gameId} />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div className={classes.subpanel}>
                        <Subheading>Game Settings</Subheading>
                        <GameSettings
                          game={game}
                          gameId={gameId}
                          userId={user.id}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.subpanel}>
                        <Subheading>Inviting Friends</Subheading>
                        <Typography variant="body1">
                          To invite someone to play, share this URL:
                          <span className={classes.shareLink}>
                            <SimpleInput
                              readOnly
                              value={link}
                              onFocus={(event) => event.target.select()}
                            />
                            <Tooltip
                              placement="top"
                              title={copiedLink ? "Link copied" : "Copy link"}
                            >
                              <IconButton onClick={handleCopy}>
                                {copiedLink ? <DoneIcon /> : <LinkIcon />}
                              </IconButton>
                            </Tooltip>
                          </span>
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box marginTop={2}>
                {user.id === game.host ? (
                  <Tooltip
                    arrow
                    title="Make sure everyone is in the waiting room! Additional players won't be able to join after the game has started."
                  >
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={startGame}
                    >
                      Start game
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    arrow
                    title="Currently waiting for the host to start the game. You can leave by pressing this button."
                  >
                    <Button
                      size="large"
                      variant="outlined"
                      fullWidth
                      disabled={leaving}
                      onClick={leaveGame}
                    >
                      Leave game
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default RoomPage;
