import EqualizerIcon from "@mui/icons-material/Equalizer";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import ProfileGamesTable from "../components/ProfileGamesTable";
import ProfileName from "../components/ProfileName";
import Subheading from "../components/Subheading";
import UserStatistics from "../components/UserStatistics";
import firebase from "../firebase";
import useFirebaseRefs from "../hooks/useFirebaseRefs";
import useStats from "../hooks/useStats";
import { computeState, hasHint, modes } from "../util";
import LoadingPage from "./LoadingPage";

const datasetVariants = {
  all: {
    label: "All Games",
    filterFn: () => true,
  },
  solo: {
    label: "Solo Games",
    filterFn: (game) => Object.keys(game.users).length === 1,
  },
  multiplayer: {
    label: "Multiplayer Games",
    filterFn: (game) => Object.keys(game.users).length > 1,
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

function gameWithScores(game, gameData) {
  if (gameData) {
    const { scores } = computeState(gameData, game.mode || "normal");
    return { ...game, scores };
  } else {
    return { ...game, scores: null };
  }
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

  let gamesWithScores = null;
  if (!loadingGameVals && !loadingGameDataVals) {
    gamesWithScores = {};
    for (let i = 0; i < gameIds.length; i++) {
      if (gameVals[i].status === "done") {
        const game = gameWithScores(gameVals[i], gameDataVals[i]);
        if (
          datasetVariants[variant].filterFn(game) &&
          (game.mode || "normal") === modeVariant &&
          !hasHint(game)
        ) {
          gamesWithScores[gameIds[i]] = game;
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
          gamesWithScores={gamesWithScores}
        />
      </Paper>
    </Container>
  );
}

export default ProfilePage;
