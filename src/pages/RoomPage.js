import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import FaceIcon from "@material-ui/icons/Face";
import StarsIcon from "@material-ui/icons/Stars";
import EditIcon from "@material-ui/icons/Edit";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { Motion, spring } from "react-motion";

import firebase from "../firebase";
import { generateDeck } from "../util";
import Loading from "../components/Loading";

const useStyles = makeStyles({
  container: {
    padding: 48,
    textAlign: "center"
  },
  playerList: {
    margin: "auto",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column"
  },
  chip: {
    margin: "2px auto"
  },
  gameArea: {
    padding: 16,
    display: "inline-block",
    margin: "16px auto"
  }
});

function RoomPage({ user, gameId }) {
  const classes = useStyles();
  const [game, setGame] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    function update(snapshot) {
      if (snapshot.exists()) {
        setGame(snapshot.val());
      } else {
        // Initialize a new game as admin
        gameRef.set({
          history: {},
          deck: generateDeck(),
          meta: {
            admin: user.id,
            created: Date.now(),
            status: "waiting",
            users: {}
          }
        });
      }
    }

    const gameRef = firebase.database().ref(`games/${gameId}`);
    gameRef.on("value", update);
    return () => {
      gameRef.off("value", update);
    };
  }, [user.id, gameId]);

  // Add self to game
  useEffect(() => {
    if (
      game &&
      user &&
      game.meta.status === "waiting" &&
      (!game.meta.users || !(user.id in game.meta.users))
    ) {
      firebase
        .database()
        .ref(`games/${gameId}/meta/users/${user.id}`)
        .set({ name: user.name, color: user.color });
      firebase
        .database()
        .ref(`users/${user.id}/games`)
        .push(gameId);
    }
  }, [game, gameId, user]);

  function changeName() {
    const name = prompt("Set name");
    if (name) {
      const updates = {};
      updates[`users/${user.id}/name`] = name;
      updates[`games/${gameId}/meta/users/${user.id}/name`] = name;
      firebase
        .database()
        .ref()
        .update(updates);
    }
  }

  function startGame() {
    firebase
      .database()
      .ref(`games/${gameId}/meta`)
      .update({
        status: "ingame",
        started: Date.now()
      });
  }

  if (redirect) return <Redirect to={`/game/${gameId}`} />;

  let starting = false;
  if (game && game.meta.status !== "waiting") {
    if (game.meta.users && user.id in game.meta.users) {
      setTimeout(() => {
        setRedirect(true);
      }, 1500);
      starting = true;
    } else {
      return (
        <Container className={classes.container}>
          <Typography variant="h4" align="center" gutterBottom>
            The game has already{" "}
            {game.meta.status === "ingame" ? "started" : "ended"}.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRedirect(true)}
          >
            Spectate
          </Button>
        </Container>
      );
    }
  }

  let players = [];
  if (game && game.meta.users) {
    players = Object.entries(game.meta.users).sort((a, b) => {
      if (a[0] === game.meta.admin) return -1;
      if (b[0] === game.meta.admin) return 1;
      return a[0] < b[0] ? -1 : 1;
    });
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        {starting ? "Starting..." : "Waiting for Players..."}
      </Typography>
      <Typography variant="body1" align="center">
        Invite by sharing the link:{" "}
        <Link component={RouterLink} to={`/room/${gameId}`}>
          {window.location.href}
        </Link>
      </Typography>
      {game ? (
        <Paper className={classes.gameArea}>
          <div className={classes.playerList}>
            {players.map(([id, info]) => (
              <Motion
                key={id}
                defaultStyle={{ opacity: 0 }}
                style={{ opacity: spring(1, { damping: 40 }) }}
              >
                {style => (
                  <Chip
                    icon={id === game.meta.admin ? <StarsIcon /> : <FaceIcon />}
                    label={info.name + (id === user.id ? " (You)" : "")}
                    className={classes.chip}
                    onClick={id === user.id ? () => {} : null}
                    onDelete={id === user.id ? changeName : null}
                    deleteIcon={<EditIcon />}
                    color={id === game.meta.admin ? "secondary" : "default"}
                    style={style}
                  />
                )}
              </Motion>
            ))}
          </div>
          <div className={classes.center}>
            {user.id === game.meta.admin ? (
              <Button
                variant="contained"
                color="primary"
                onClick={startGame}
                disabled={starting}
              >
                Start
              </Button>
            ) : (
              <Button disabled>
                {starting ? "Starting" : "Waiting for host to start"}
              </Button>
            )}
          </div>
        </Paper>
      ) : (
        <Loading />
      )}
    </Container>
  );
}

export default RoomPage;
