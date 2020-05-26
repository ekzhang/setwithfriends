import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";
import moment from "moment";
import { Pie } from "react-chartjs-2";

import Loading from "./Loading";

const useStyles = makeStyles((theme) => ({
  statisticsPanel: {
    background: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: 4,
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

function UserStatistics({ gamesData, userId }) {
  const classes = useStyles();

  if (!gamesData) {
    return <Loading />;
  }

  const stats = Object.values(gamesData).reduce(
    ([playCount, winCount, setsCount, fastestWinTime, totalGameLength], g) => [
      playCount + 1,
      winCount + (g.winner === userId),
      setsCount + (g.scores[userId] || 0),
      Math.min(
        fastestWinTime,
        g.winner === userId ? g.endedAt - g.startedAt : Infinity
      ),
      totalGameLength + (g.endedAt - g.startedAt),
    ],
    [0, 0, 0, Infinity, 0]
  );

  const pieData = {
    datasets: [
      {
        data: [stats[1], stats[0] - stats[1]],
        backgroundColor: [green[300], red[300]],
      },
    ],
    labels: ["Games won", "Games lost"],
  };
  const pieDataNoGames = {
    datasets: [
      {
        data: [100],
        backgroundColor: [grey[300]],
      },
    ],
    labels: ["No games played"],
  };
  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: "bottom",
    },
  };

  return (
    <Grid container direction="row" className={classes.statisticsPanel}>
      <Grid item xs={12} sm={6} md={6}>
        <Pie data={stats[0] ? pieData : pieDataNoGames} options={pieOptions} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} className={classes.stats}>
        <Typography variant="body2" gutterBottom>
          Finished games: <strong>{stats[0]}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Total sets: <strong>{stats[2]}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Average sets per game:{" "}
          <strong>{stats[0] ? (stats[2] / stats[0]).toFixed(2) : "N/A"}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Fastest game won:{" "}
          <strong>
            {stats[3] !== Infinity
              ? moment.duration(stats[3]).humanize()
              : "N/A"}
          </strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Average game length:{" "}
          <strong>
            {stats[0] ? moment.duration(stats[4] / stats[0]).humanize() : "N/A"}
          </strong>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default UserStatistics;
