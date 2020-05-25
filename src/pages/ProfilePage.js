import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EqualizerIcon from "@material-ui/icons/Equalizer";

import ProfileName from "../components/ProfileName";
import UserStatistics from "./UserStatistics";
import ProfileGamesTable from "../components/ProfileGamesTable";

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
  divider: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

function ProfilePage({ match }) {
  const [redirect, setRedirect] = useState(null);

  const classes = useStyles();

  const handleClickGame = () => {
    setRedirect("/game");
  };

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
            <ProfileGamesTable
              handleClickGame={handleClickGame}
            ></ProfileGamesTable>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
