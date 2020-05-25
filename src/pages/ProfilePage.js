import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import StarIcon from "@material-ui/icons/Star";

import { Pie } from "react-chartjs-2";

import User from "../components/User";

const useStyles = makeStyles((theme) => ({
  statisticsPanel: {
    background: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: 4,
  },
  mainGrid: {
    "--table-height": "400px", // responsive variable
    [theme.breakpoints.up("sm")]: {
      "--table-height": "480px",
    },
    [theme.breakpoints.up("md")]: {
      "--table-height": "calc(100vh - 140px)",
    },
  },
  gamesTable: {
    height: "var(--table-height)",
    whiteSpace: "nowrap",
    "& td, & th": {
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 12,
      paddingRight: 12,
    },
    "& svg": {
      display: "block",
    },
    "& tr:hover": {
      background: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  divider: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  //Remove cells of some columns of table for small screens
  vanishingTableCell: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  usernamePanel: { display: "flex", flexDirection: "column" },
}));

function ProfilePage({ match }) {
  const [redirect, setRedirect] = useState(null);

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

  if (redirect) return <Redirect push to={redirect} />;

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Grid container className={classes.mainGrid}>
          <Grid item xs={12} sm={12} md={4} className={classes.usernamePanel}>
            <User
              component={Typography}
              variant="h4"
              gutterBottom
              id={match.params.id}
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Box mr={1} display="inline">
                <Typography variant="body2" mr={1} style={{ color: "black" }}>
                  Last seen:
                </Typography>
              </Box>
              <Typography variant="body2" style={{ color: "#1976d2" }}>
                a few seconds ago
              </Typography>
            </div>
          </Grid>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            className={classes.divider}
          />
          <Grid item xs={12} sm={12} style={{ flex: 1 }} p={1}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="overline"> Statistics</Typography>
              <EqualizerIcon />
            </div>
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
                      <Typography variant="body2">
                        Average sets per game: 15
                      </Typography>
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
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="overline"> Finished Games</Typography>
            <TableContainer component={Paper} className={classes.gamesTable}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell className={classes.vanishingTableCell}>
                      Host
                    </TableCell>
                    <TableCell># Users</TableCell>
                    <TableCell># Sets</TableCell>
                    <TableCell>Length</TableCell>
                    <TableCell className={classes.vanishingTableCell}>
                      Created
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(30)].map((_, i) =>
                    i % 2 ? (
                      <TableRow key={i} onClick={() => setRedirect("/game")}>
                        <TableCell>{i + 1}.</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          Anonymous Polar Bear
                        </TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>0h {i + 2}m 5s</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          {i + 2} hours ago
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ) : i % 3 ? (
                      <TableRow key={i} onClick={() => setRedirect("/game")}>
                        <TableCell>{i + 1}.</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          Anonymous Ant
                        </TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>1h {i + 2}m 20s</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          {i + 2} hours ago
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ) : (
                      <TableRow key={i} onClick={() => setRedirect("/game")}>
                        <TableCell>{i + 1}.</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          Anonymous Dragonfly
                        </TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>256h {i + 2}m 35s</TableCell>
                        <TableCell className={classes.vanishingTableCell}>
                          {i + 2} hours ago
                        </TableCell>
                        <TableCell>
                          <StarIcon style={{ color: "#ffb74d" }}></StarIcon>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
