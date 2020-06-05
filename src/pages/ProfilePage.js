import React, { useState, useMemo } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EqualizerIcon from "@material-ui/icons/Equalizer";

import ProfileName from "../components/ProfileName";
import UserStatistics from "../components/UserStatistics";
import ProfileGamesTable from "../components/ProfileGamesTable";
import useFirebaseRef from "../hooks/useFirebaseRef";
import useFirebaseRefs from "../hooks/useFirebaseRefs";
import { computeState } from "../util";
import LoadingPage from "./LoadingPage";

const useStyles = makeStyles((theme) => ({
  divider: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mainGrid: {
    marginBottom: theme.spacing(1),
  },
}));

function mergeGameData(game, gameData) {
  const scores = computeState(gameData).scores;
  const winner = Object.keys(game.users).sort((u1, u2) => {
    const s1 = scores[u1] || 0;
    const s2 = scores[u2] || 0;
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  })[0];
  return {
    ...game,
    ...gameData,
    winner: winner,
    scores: scores,
  };
}

function ProfilePage({ match }) {
  const userId = match.params.id;
  const classes = useStyles();

  const [games, loadingGames] = useFirebaseRef(`/userGames/${userId}`);
  const [redirect, setRedirect] = useState(null);

  const handleClickGame = (gameId) => {
    setRedirect(`/room/${gameId}`);
  };

  const gameIds = useMemo(
    () => (loadingGames ? [] : Object.keys(games || {})),
    [loadingGames, games]
  );
  const [gameVals, loadingGameVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `games/${gameId}`), [gameIds])
  );
  const [gameDataVals, loadingGameDataVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `gameData/${gameId}`), [gameIds])
  );

  if (redirect) {
    return <Redirect push to={redirect} />;
  }
  if (loadingGames) {
    return <LoadingPage />;
  }

  let gamesData = null;
  if (!loadingGameVals && !loadingGameDataVals) {
    gamesData = {};
    for (let i = 0; i < gameIds.length; i++) {
      if (gameVals[i].status === "done") {
        gamesData[gameIds[i]] = mergeGameData(gameVals[i], gameDataVals[i]);
      }
    }
  }

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Grid container className={classes.mainGrid}>
          <Grid item xs={12} md={4}>
            <ProfileName userId={userId} />
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            className={classes.divider}
          />
          <Grid item xs={12} style={{ flex: 1 }} p={1}>
            <div style={{ display: "flex" }}>
              <Typography variant="overline">Statistics</Typography>
              <EqualizerIcon />
            </div>
            <UserStatistics userId={userId} gamesData={gamesData} />
          </Grid>
        </Grid>
        <Typography variant="overline" component="div">
          Finished Games
        </Typography>
        <ProfileGamesTable
          userId={userId}
          handleClickGame={handleClickGame}
          gamesData={gamesData}
        />
      </Paper>
    </Container>
  );
}

export default ProfilePage;
