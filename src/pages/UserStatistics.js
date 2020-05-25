import React from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Pie } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  statisticsPanel: {
    background: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: 4,
  },
}));
function UserStatistics() {
  // Fake pie chart data
  const data = {
    datasets: [
      {
        data: [35, 100],
        backgroundColor: ["#81c784", "#e57373"],
      },
    ],
    labels: ["Games won", "Games lost"],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: "bottom",
    },
  };
  const classes = useStyles();

  return (
    <Grid container direction="row" className={classes.statisticsPanel}>
      <Grid item xs={12} sm={6} md={6} className={classes.pie}>
        <Pie data={data} options={options} />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <List dense>
          <ListItem>
            <Typography variant="body2">Finished games: 135</Typography>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">Total sets: 2025</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">Average sets per game: 15</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">
                Fastest game won: 5 min 30 sec
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2">
                Average game length: 4 min
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}
export default UserStatistics;
