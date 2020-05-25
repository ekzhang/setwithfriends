import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
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

import ProfileName from "../components/ProfileName";
import UserStatistics from "./UserStatistics";

const useStyles = makeStyles((theme) => ({
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
}));

function ProfilePage({ match }) {
  const [redirect, setRedirect] = useState(null);

  const classes = useStyles();

  if (redirect) return <Redirect push to={redirect} />;

  return (
    <Container>
      <Paper style={{ padding: 16 }}>
        <Grid container className={classes.mainGrid}>
          <Grid item xs={12} sm={12} md={4} className={classes.usernamePanel}>
            <ProfileName userId={match.params.id}></ProfileName>
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
            <UserStatistics></UserStatistics>
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
