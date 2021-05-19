import { memo } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Pie } from "react-chartjs-2";

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

function UserStatistics({ stats, variant }) {
  const classes = useStyles();
  const theme = useTheme();

  const num = stats[variant];

  const pieData = {
    datasets: [
      {
        data: [num.wonGames, num.finishedGames - num.wonGames],
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
    plugins: {
      legend: {
        position: "bottom",
        onClick: (e) => e.stopPropagation(),
      },
      tooltip: {
        enabled: num.finishedGames > 0,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <Grid container direction="row" className={classes.statisticsPanel}>
      <Grid item xs={12} sm={6} md={6}>
        <Pie
          data={num.finishedGames > 0 ? pieData : pieDataNoGames}
          options={pieOptions}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} className={classes.stats}>
        <Typography variant="body2" className={classes.statsItem}>
          Finished games: <strong>{num.finishedGames}</strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Total sets: <strong>{num.totalSets}</strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Average sets per game:{" "}
          <strong>
            {num.finishedGames > 0
              ? (num.totalSets / num.finishedGames).toFixed(2)
              : "N/A"}
          </strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Fastest game won:{" "}
          <strong>
            {num.fastestTime !== Infinity ? formatTime(num.fastestTime) : "N/A"}
          </strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Average game length:{" "}
          <strong>
            {num.finishedGames > 0
              ? formatTime(num.totalTime / num.finishedGames)
              : "N/A"}
          </strong>
        </Typography>
        <Typography variant="body2" className={classes.statsItem}>
          Rating: <strong>{Math.round(stats.rating)}</strong>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default memo(UserStatistics);
