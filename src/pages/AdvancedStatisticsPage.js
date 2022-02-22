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
import FormControl from "@material-ui/core/FormControl";
import {FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, Slider, TextField} from "@material-ui/core";

const playerCountFilter = {
  all: {
    label: "All",
    filterFn: (gameData) => true,
  },
  solo: {
    label: "Single player",
    filterFn: (gameData) => Object.keys(gameData.users).length === 1,
  },
  multiplayer: {
    label: "Multiplayer",
    filterFn: (gameData) => Object.keys(gameData.users).length >= 2,
  },
  two: {
    label: "2",
    filterFn: (gameData) => Object.keys(gameData.users).length === 2,
  },
  three: {
    label: "3",
    filterFn: (gameData) => Object.keys(gameData.users).length === 3,
  },
  four: {
    label: "4",
    filterFn: (gameData) => Object.keys(gameData.users).length === 4,
  },
  fiveplus: {
    label: "5+",
    filterFn: (gameData) => Object.keys(gameData.users).length >= 5,
  }
};

const hintFilter = {
  all: {
    label: "All",
    filterFn: (gameData) => true,
  },
  enabled: {
    label: "Enabled",
    filterFn: (gameData) => hasHint(gameData),
  },
  disabled: {
    label: "Disabled",
    filterFn: (gameData) => !hasHint(gameData),
  }
};

const resultFilter = {
  all: {
    label: "All",
    filterFn: (gameData, userId) => true,
  },
  won: {
    label: "Won",
    filterFn: (gameData, userId) => gameData.scores[userId] === gameData.topScore,
  },
  lost: {
    label: "Lost",
    filterFn: (gameData, userId) => gameData.scores[userId] !== gameData.topScore,
  }
}

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
  const [modeVariant, setModeVariant] = useState("all");
  const [sortVariable, setSortVariable] = useState("createdAt");
  const [sortAscending, setSortAscending] = useState(true);
  const [playerCount, setPlayerCount] = useState("all");
  const [hints, setHints] = useState("all");
  const [result, setResult] = useState("all");
  const [setCountRange, setSetCountRange] = useState([17, 40]);
  const [setWonCountRange, setSetWonCountRange] = useState([0, 40]);

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

  if (!permission && selfAnalysis && !loadingUser) {
    // Requesting own statistics without being a patron or admin.
    return <Redirect to={'/donate'} />;
  } else if (!permission && user) {
    // Requesting statistics of other user without being an admin.
    return <Redirect to={'/permissiondenied'} />;
  } else if (!permission && !loadingUser) {
    // Requesting statistics of non-existing user.
    return <Redirect to={'/notfound'} />;
  }

  if (redirect) {
    return <Redirect push to={redirect} />;
  }
          <InputLabel id="playercount-select">Player count</InputLabel>

  if (!games) {
    return <LoadingPage />;
  }

  let gamesData = null;
  if (!loadingGameVals && !loadingGameDataVals) {
    gamesData = {};
    for (let i = 0; i < gameIds.length; i++) {
      if (gameVals[i].status === "done") {
        const gameData = mergeGameData(gameVals[i], gameDataVals[i]);

        let totalSetCount = 0;
        for (const [key, value] of Object.entries(gameData.scores)) {
          totalSetCount += value;
        }

        if (
          playerCountFilter[playerCount].filterFn(gameData) &&
          (modeVariant === "all" ? true : (gameData.mode || "normal") === modeVariant) &&
          hintFilter[hints].filterFn(gameData) &&
          resultFilter[result].filterFn(gameData, userId) &&
          (totalSetCount <= Math.max(...setCountRange) && totalSetCount >= Math.min(...setCountRange)) &&
          (gameData.scores[userId] <= Math.max(...setWonCountRange) && gameData.scores[userId] >= Math.min(...setWonCountRange))
        ) {
          gamesData[gameIds[i]] = gameData;
        }
      }
    }
  }

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Subheading style={{ textAlign: "left" }}>
          Options
        </Subheading>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <TextField
            value={modeVariant}
            onChange={(event) => setModeVariant(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Game mode"
            color="secondary"
          >
            <MenuItem key={"all"} value={"all"}>
              <Typography variant="body2">All</Typography>
            </MenuItem>
            {Object.entries(modes).map(([key, { name }]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body2">{name}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={playerCount}
            onChange={(event) => setPlayerCount(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Player count"
            color="secondary"
          >
            {Object.entries(playerCountFilter).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body2">{label}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={hints}
            onChange={(event) => setHints(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Hints"
            color="secondary"
            >
            {Object.entries(hintFilter).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body2">{label}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={result}
            onChange={(event) => setResult(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Result"
            color="secondary"
          >
            {Object.entries(resultFilter).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body2">{label}</Typography>
              </MenuItem>
            ))}
          </TextField>

          <InputLabel id="setrange-label">Total num. sets</InputLabel>
          <Slider
            value={setCountRange}
            onChange={(event, newValue) => { setSetCountRange(newValue); }}
            step={1}
            min={0}
            max={40}
            style={{ marginRight: "1em", width: "250px" }}
            valueLabelDisplay="auto"
            aria-labelledby="setrange-label"
          >
          </Slider>

          <InputLabel id="setwonrange-label">Num. sets</InputLabel>
          <Slider
            value={setWonCountRange}
            onChange={(event, newValue) => { setSetWonCountRange(newValue); }}
            step={1}
            min={0}
            max={40}
            style={{ marginRight: "1em", width: "250px" }}
            valueLabelDisplay="auto"
            aria-labelledby="setwonrange-label"
          >
          </Slider>

          <TextField
            value={sortVariable}
            onChange={(event) => setSortVariable(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Sort on"
            color="secondary"
          >
            <MenuItem key={"createdAt"} value={"createdAt"}>
              <Typography variant="body2">Creation time</Typography>
            </MenuItem>
            <MenuItem key={"duration"} value={"duration"}>
              <Typography variant="body2">Duration</Typography>
            </MenuItem>
            <MenuItem key={"players"} value={"players"}>
              <Typography variant="body2">Num. players</Typography>
            </MenuItem>
          </TextField>

          <TextField
            value={sortAscending}
            onChange={(event) => setSortAscending(event.target.value)}
            select
            style={{ marginRight: "1em", width: "100px" }}
            label="Sort order"
            color="secondary"
          >
            <MenuItem key={"ascending"} value={true}>
              <Typography variant="body2">Ascending</Typography>
            </MenuItem>
            <MenuItem key={"descending"} value={false}>
              <Typography variant="body2">Descending</Typography>
            </MenuItem>
          </TextField>

        </div>



        <ProfileGamesTable
          userId={userId}
          handleClickGame={handleClickGame}
          gamesData={gamesData}
          sortVariable={sortVariable}
          sortAscending={sortAscending}
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
