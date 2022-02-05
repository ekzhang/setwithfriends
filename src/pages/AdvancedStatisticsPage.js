import { useState, useMemo, useEffect, useContext } from "react";
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
import Subheading from "../components/Subheading";
import Loading from "../components/Loading";
import firebase from "../firebase";
import useFirebaseRefs from "../hooks/useFirebaseRefs";
import useStats from "../hooks/useStats";
import { computeState, hasHint, modes } from "../util";
import LoadingPage from "./LoadingPage";
import { UserContext } from "../context";
import useFirebaseRef from "../hooks/useFirebaseRef";

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
    [theme.breakpoints.down("xs")]: {
      paddingTop: 3,
    },
  },
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
  const { scores } = computeState(gameData, game.mode || "normal");
  const topScore = Math.max(0, ...Object.values(scores));
  return {
    ...game,
    ...gameData,
    topScore,
    scores,
  };
}

/** Function defining and constructing the page displaying advanced statistics
 * for a player, both for cheat detection and general statistics purposes. */
function AdvancedStatisticsPage({ match }) {
  const userId = match.params.id;
  const requester = useContext(UserContext);
  const [user, loadingUser] = useFirebaseRef(`users/${userId}`);

  const selfAnalysis = (userId === requester.id);

  // Whether data should be loaded.
  const permission = user && ((selfAnalysis && requester.patron) || (requester.admin && !selfAnalysis));

  const classes = useStyles();

  const [games, setGames] = useState(null);
  const [stats, loadingStats] = useStats(userId);
  const [redirect, setRedirect] = useState(null);
  const [variant, setVariant] = useState("all");
  const [modeVariant, setModeVariant] = useState("normal");

  useEffect(() => {
    if (!permission) return null;
    const query = firebase
      .database()
      .ref(`/userGames/${userId}`)
      .orderByValue();
    const update = (snapshot) => {
      query.off("value", update);
      setGames(snapshot.val() ?? {});
    };
    query.on("value", update);
    return () => {
      query.off("value", update);
    };
  }, [userId, permission]);

  const handleClickGame = (gameId) => {
    setRedirect(`/room/${gameId}`);
  };

  const gameIds = useMemo(() => (games ? Object.keys(games) : []), [games]);
  const [gameVals, loadingGameVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `games/${gameId}`), [gameIds]),
    true
  );
  const [gameDataVals, loadingGameDataVals] = useFirebaseRefs(
    useMemo(() => gameIds.map((gameId) => `gameData/${gameId}`), [gameIds]),
    true
  );

  if (!permission && selfAnalysis) {
    // Requesting own statistics without being a patron or admin.
    return <Redirect to={'/donate'} />;
  } else if (!permission && user) {
    // Requesting statistics of other user without being an admin.
    return <Redirect to={'/permissiondenied'} />;
  } else if (!permission) {
    // Requesting statistics of non-existing user.
    return <Redirect to={'/notfound'} />;
  }

  if (redirect) {
    return <Redirect push to={redirect} />;
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
                <Subheading className={classes.statsHeading}>
                  Statistics
                </Subheading>
                <EqualizerIcon />
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Select
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

export default AdvancedStatisticsPage;


/**
 * Techniques for catching cheaters:
 * - Request game analysis on players (most recent x games, or all games, or specific game)
 * - Mark as player of interest (maybe + notes?)
 * - Mark as confirmed previous cheater
 * - List of last bans
 */

/**
 * Features to be analysed:
 * - Time to first set
 * - Time between sets of one player (mean, min, std)
 * - Time to previous set (mean, min, std)
 * - Time to last card unseen being added (mean, min, std)
 * - Number of times taking extension's choice vs total number of sets - Can we do some fancy probabilistic analysis here? - Probably not or only partially
 * - Probability of taking extension's choice
 * - Like Lichess, graph of set taking duration per player, ideally also indicating whether bruteforce set
 * ------> For cheater analysis, more per game based, overall statistics less important.
 */

/**
 * Extra statistics for paying players: -> run clientside
 * - Std of set times
 * - Fastest game(s,  maybe the best 10 or so? And also split it out per gamemode / number of players / number of sets?)
 * - Time to next set (mean, min, std)
 * - Time to first set (mean, min, std)
 * - Percentage of finished games
 * - Graphs of fastest time over dates
 * - Graphs of average time over dates
 * - Graphs of set times frequence
 * - Favourite card (including how many times more likely to pick that card than average)
 * - Favourite SET (including how many times more likely to pick that set than average)
 * - Number of distinct sets found (maximum 1080)
 * - Graph of games over time (frequency of play)
 * - Average number of games per day
 * - Expected number of games before breaking record / probability of breaking record
 * - Total time spent on each gamemode
 */

/**
 * Code structure:
 * - Computation client-side.
 * - Handle finished games and unfinished games separately
 * - Analyze each game, and compute all statistics (each statistic dependent on whether
 * - Store nothing on server
 * - Upon request from frontend, analysis is run, and last analysis for player replaced. -> Rate limit
 */
