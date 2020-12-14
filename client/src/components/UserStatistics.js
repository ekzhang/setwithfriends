import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Pie } from "react-chartjs-2";

import Loading from "./Loading";
import { formatTime } from "../util";

const useStyles = makeStyles((theme) => ({
  statisticsPanel: {
    background: theme.palette.background.panel,
    padding: theme.spacing(2),
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  statsItem: {
    margin: "0.25em 0",
  },
}));

function UserStatistics({ gamesData, userId }) {
  const classes = useStyles();
  const theme = useTheme();

  if (!gamesData) {
    return <Loading />;
  }

  const stats = Object.values(gamesData).reduce(
    ([playCount, winCount, setsCount, fastestWinTime, totalGameLength], g) => [
      playCount + 1,
      winCount + (g.scores[userId] === g.topScore),
      setsCount + (g.scores[userId] || 0),
      Math.min(
        fastestWinTime,
        g.scores[userId] === g.topScore ? g.endedAt - g.startedAt : Infinity
      ),
      totalGameLength + (g.endedAt - g.startedAt),
    ],
    [0, 0, 0, Infinity, 0]
  );

  const pieData = {
    datasets: [
      {
        data: [stats[1], stats[0] - stats[1]],
        backgroundColor: [
          theme.palette.success.light,
          theme.palette.error.light,
        ],
      },
    ],
    labels: ["Games won", "Games lost"],
  };
  const pieDataNoGames = {
    datasets: [
      {
        data: [100],
        backgroundColor: [theme.pie.noGames],
      },
    ],
    labels: ["No games played"],
  };
  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: "bottom",
      onClick: (e) => e.stopPropagation(),
    },
    tooltips: { enabled: stats[0] },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <Grid container direction="row" className={classes.statisticsPanel}>
      <Grid item xs={12} sm={6} md={6}>
        <Pie data={stats[0] ? pieData : pieDataNoGames} options={pieOptions} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} className={classes.stats}>
        <Typography variant="body2" className={classes.statsItem}>
          Finished games: <strong>{stats[0]}</strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Total sets: <strong>{stats[2]}</strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Average sets per game:{" "}
          <strong>{stats[0] ? (stats[2] / stats[0]).toFixed(2) : "N/A"}</strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Fastest game won:{" "}
          <strong>
            {stats[3] !== Infinity ? formatTime(stats[3]) : "N/A"}
          </strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Average game length:{" "}
          <strong>{stats[0] ? formatTime(stats[4] / stats[0]) : "N/A"}</strong>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default UserStatistics;
