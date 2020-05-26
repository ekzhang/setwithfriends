import React from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
}));

function UserStatistics({ gamesData, userId, loadingGames }) {
  const classes = useStyles();

  if (loadingGames || !gamesData) {
    return <Loading></Loading>;
  }

  const stats = Object.values(gamesData).reduce(
    ([p, w, s, f, l], g) => [
      p + 1,
      w + (g.winner === userId),
      s + (g.scores[userId] || 0),
      Math.min(f, g.winner === userId ? g.endedAt - g.startedAt : Infinity),
      l + (g.endedAt - g.startedAt),
    ],
    [0, 0, 0, Infinity, 0]
  );

  const pieData = {
    datasets: [
      {
        data: [stats[1], stats[0]],
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
      <Grid item xs={12} sm={6} md={6} className={classes.pie}>
        <Pie data={stats[0] ? pieData : pieDataNoGames} options={pieOptions} />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <List dense>
          <ListItem>
            <Typography variant="body2">Finished games: {stats[0]}</Typography>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">Total sets: {stats[2]}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">
                Average sets per game:
                {stats[0] ? (stats[2] / stats[0]).toFixed(2) : "N/A"}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">
                Fastest game won:
                {stats[3] !== Infinity
                  ? moment.duration(stats[3]).humanize()
                  : "N/A"}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">
                Average game length:
                {stats[0]
                  ? moment.duration(stats[4] / stats[0]).humanize()
                  : "N/A"}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}
export default UserStatistics;
