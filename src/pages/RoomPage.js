import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LinkIcon from "@material-ui/icons/Link";
import DoneIcon from "@material-ui/icons/Done";
import PersonIcon from "@material-ui/icons/Person";
import SnoozeIcon from "@material-ui/icons/Snooze";
import StarsIcon from "@material-ui/icons/Stars";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { useTransition, animated } from "react-spring";

import useFirebaseRef from "../hooks/useFirebaseRef";
import LoadingPage from "./LoadingPage";
import NotFoundPage from "./NotFoundPage";
import SimpleInput from "../components/SimpleInput";
import User from "../components/User";
import GameChat from "../components/GameChat";
import firebase from "../firebase";
import { UserContext } from "../context";

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
}));

function RoomPage({ match, location }) {
  const user = useContext(UserContext);
  const gameId = match.params.id;
  const classes = useStyles();

  const [copiedLink, setCopiedLink] = useState(false);
  const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);

  useEffect(() => {
    if (
      game &&
      game.status === "waiting" &&
      (!game.users || !(user.id in game.users))
    ) {
      firebase.analytics().logEvent("join_game", { gameId });
      firebase
        .database()
        .ref(`games/${gameId}/users/${user.id}`)
        .set(firebase.database.ServerValue.TIMESTAMP);
      firebase
        .database()
        .ref(`userGames/${user.id}/${gameId}`)
        .set(game.createdAt);
    }
  }, [user.id, game, gameId]);

  const users = game && game.users ? Object.keys(game.users) : [];
  const transitions = useTransition(users, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  if (loadingGame) {
    return <LoadingPage />;
  }

  if (!game) {
    return <NotFoundPage />;
  }

  if (game.status !== "waiting") {
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

  return (
    <Container>
      <Grid container spacing={2}>
        <Box clone order={{ xs: 2, sm: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <Paper className={classes.chatPanel}>
              <GameChat gameId={gameId} />
            </Paper>
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={8} md={9}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h4" gutterBottom>
                Waiting Room
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <div className={classes.subpanel}>
                    <Typography variant="overline">Players</Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to={`/profile/${game.host}`}
                      >
                        <ListItemIcon>
                          <Tooltip title="Game host">
                            <StarsIcon />
                          </Tooltip>
                        </ListItemIcon>
                        <ListItemText>
                          <User id={game.host} />
                          {game.host === user.id && " (You)"}
                        </ListItemText>
                      </ListItem>
                      {transitions.map(
                        ({ item: playerId, props, key }) =>
                          playerId !== game.host && (
                            <User
                              key={key}
                              id={playerId}
                              render={(player, playerEl) => (
                                <animated.div style={props}>
                                  <ListItem
                                    button
                                    component={RouterLink}
                                    to={`/profile/${playerId}`}
                                  >
                                    <ListItemIcon>
                                      {player.connections &&
                                      Object.values(
                                        player.connections
                                      ).includes(`/room/${gameId}`) ? (
                                        <Tooltip title="Active player">
                                          <PersonIcon />
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Disconnected player">
                                          <SnoozeIcon />
                                        </Tooltip>
                                      )}
                                    </ListItemIcon>
                                    <ListItemText>
                                      {playerEl}
                                      {playerId === user.id && " (You)"}
                                    </ListItemText>
                                  </ListItem>
                                </animated.div>
                              )}
                            />
                          )
                      )}
                    </List>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className={classes.subpanel}>
                    <Typography variant="overline">Inviting Friends</Typography>
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
              {user.id === game.host ? (
                <Box marginTop={2}>
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
                </Box>
              ) : (
                <Box marginTop={2}>
                  <Button size="large" fullWidth disabled>
                    Waiting for host to start
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default RoomPage;
