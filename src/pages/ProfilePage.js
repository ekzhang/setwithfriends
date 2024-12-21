import { useState, useMemo, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import makeStyles from "@mui/styles/makeStyles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EqualizerIcon from "@mui/icons-material/Equalizer";

import ProfileName from "../components/ProfileName";
import UserStatistics from "../components/UserStatistics";
import ProfileGamesTable from "../components/ProfileGamesTable";
import Subheading from "../components/Subheading";
import Loading from "../components/Loading";
import firebase from "../firebase";
import useFirebaseRefs from "../hooks/useFirebaseRefs";
import useStats from "../hooks/useStats";
import { computeState, hasHint, modes } from "../util";
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
  statsHeading: {
    // Pixel-perfect corrections for icon alignment
    paddingTop: 4,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 3,
    },
  },
  divider: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  mainGrid: {
    marginBottom: theme.spacing(1),
  },
}));

function mergeGameData(game, gameData) {
  const { scores } = computeState(gameData, game.mode || "normal");
  const topScore = Math.max(0, ...Object.values(scores));
  return {
    ...game,
    ...gameData,
    topScore,
    scores,
  };
}

function ProfilePage() {
  const { id: userId } = useParams();
  const classes = useStyles();

  const [games, setGames] = useState(null);
  useEffect(() => {
    const query = firebase
      .database()
      .ref(`/userGames/${userId}`)
      .orderByValue()
      .limitToLast(50);
    const update = (snapshot) => {
      query.off("value", update);
      setGames(snapshot.val() ?? {});
    };
    query.on("value", update);
    return () => {
      query.off("value", update);
    };
  }, [userId]);

  const [stats, loadingStats] = useStats(userId);
  const [redirect, setRedirect] = useState(null);
  const [variant, setVariant] = useState("all");
  const [modeVariant, setModeVariant] = useState("normal");

  const handleClickGame = (gameId) => {
    setRedirect(`/room/${gameId}`);
  };

  const gameIds = useMemo(() => (games ? Object.keys(games) : []), [games]);
  const [gameVals, loadingGameVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `games/${gameId}`), [gameIds]),
    true,
  );
  const [gameDataVals, loadingGameDataVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `gameData/${gameId}`), [gameIds]),
    true,
  );

  if (redirect) {
    return <Navigate push to={redirect} />;
  }
  if (!games) {
    return <LoadingPage />;
  }

  let gamesData = null;
  if (!loadingGameVals && !loadingGameDataVals) {
    gamesData = {};
    for (let i = 0; i < gameIds.length; i++) {
      if (gameVals[i].status === "done") {
        const gameData = mergeGameData(gameVals[i], gameDataVals[i]);
        if (
          datasetVariants[variant].filterFn(gameData) &&
          (gameData.mode || "normal") === modeVariant &&
          !hasHint(gameData)
        ) {
          gamesData[gameIds[i]] = gameData;
        }
      }
    }
  }

  return (
    <Container sx={{ pb: 2 }}>
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
                <Subheading className={classes.statsHeading}>
                  Statistics
                </Subheading>
                <EqualizerIcon />
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Select
                  variant="standard"
                  value={modeVariant}
                  onChange={(event) => setModeVariant(event.target.value)}
                  style={{ marginRight: "1em" }}
                  color="secondary"
                >
                  {Object.entries(modes).map(([key, { name }]) => (
                    <MenuItem key={key} value={key}>
                      <Typography variant="body2">{name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  variant="standard"
                  value={variant}
                  onChange={(event) => setVariant(event.target.value)}
                  color="secondary"
                >
                  {Object.entries(datasetVariants).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      <Typography variant="body2">{label}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {loadingStats ? (
              <Loading />
            ) : (
              <UserStatistics stats={stats[modeVariant]} variant={variant} />
            )}
          </Grid>
        </Grid>
        <Subheading style={{ textAlign: "left" }}>Finished Games</Subheading>
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
