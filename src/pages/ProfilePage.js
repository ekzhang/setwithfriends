import React, { useState, useMemo } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import EqualizerIcon from "@material-ui/icons/Equalizer";

import ProfileName from "../components/ProfileName";
import UserStatistics from "../components/UserStatistics";
import ProfileGamesTable from "../components/ProfileGamesTable";
import useFirebaseRef from "../hooks/useFirebaseRef";
import useFirebaseRefs from "../hooks/useFirebaseRefs";
import { computeState } from "../util";
import LoadingPage from "./LoadingPage";

const datasetVariants = {
  all: {
    label: "All Games",
    filterFn: (gameData) => true,
  },
  solo: {
    label: "Solo Games",
    filterFn: (gameData) => Object.keys(gameData.users).length === 1,
  },
  multiplayer: {
    label: "Multiplayer Games",
    filterFn: (gameData) => Object.keys(gameData.users).length > 1,
  },
};

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
  const { scores } = computeState(gameData);
  const topScore = Math.max(0, ...Object.values(scores));
  return {
    ...game,
    ...gameData,
    topScore,
    scores,
  };
}

function ProfilePage({ match }) {
  const userId = match.params.id;
  const classes = useStyles();

  const [games, loadingGames] = useFirebaseRef(`/userGames/${userId}`, true);
  const [redirect, setRedirect] = useState(null);
  const [variant, setVariant] = useState("all");

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
        const gameData = mergeGameData(gameVals[i], gameDataVals[i]);
        if (datasetVariants[variant].filterFn(gameData)) {
          gamesData[gameIds[i]] = gameData;
        }
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
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div style={{ display: "flex" }}>
                <Typography variant="overline">Statistics</Typography>
                <EqualizerIcon />
              </div>

              <Select
                value={variant}
                onChange={(event) => setVariant(event.target.value)}
                style={{ marginLeft: "auto" }}
                color="secondary"
              >
                {Object.entries(datasetVariants).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    <Typography variant="body2">{label}</Typography>
                  </MenuItem>
                ))}
              </Select>
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
