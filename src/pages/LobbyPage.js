import React, { useState } from "react";
import generate from "project-name-generator";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: {
    padding: 40,
    height: "100%",
    textAlign: "center"
  },
  menu: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    "& button": {
      margin: 12,
      marginTop: 6,
      marginBottom: 6
    },
    "& button:first-child": {
      marginTop: 12,
      marginBottom: 12
    },
    "& button:last-child": {
      marginBottom: 12
    }
  }
});

function LobbyPage({ user }) {
  const styles = useStyles();
  const [redirect, setRedirect] = useState(null);

  const UNIMPLEMENTED_MESSAGE = 'unimplemented. click "New Room" instead.';

  if (redirect) return <Redirect to={redirect} />;

  function play() {
    alert(UNIMPLEMENTED_MESSAGE);
  }

  function newRoom() {
    setRedirect("/room/" + generate().dashed);
  }

  function joinRoom() {
    alert(UNIMPLEMENTED_MESSAGE);
  }

  function spectate() {
    alert(UNIMPLEMENTED_MESSAGE);
  }

  function options() {
    alert(UNIMPLEMENTED_MESSAGE);
  }

  return (
    <Container className={styles.container}>
      <Typography variant="h3" component="h2" gutterBottom>
        Set with Friends (α)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          {/* empty */}
        </Grid>
        <Grid item xs={4}>
          <Card elevation={2} className={styles.menu}>
            <Button onClick={play} variant="contained" color="primary">
              Play
            </Button>
            <Button onClick={newRoom} variant="contained">
              New Room
            </Button>
            <Button onClick={joinRoom} variant="contained">
              Join Room by ID
            </Button>
            <Button onClick={spectate} variant="contained">
              Spectate
            </Button>
            <Button onClick={options} variant="contained">
              Options
            </Button>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={styles.menu}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            <Typography variant="body1">Games Played: x</Typography>
            <Typography variant="body1">Games Won: x</Typography>
            <Typography variant="body1">Total Sets: x</Typography>
            <Typography variant="body1">Avg. Sets per Game: x</Typography>
            <Typography variant="body1">(filler etc... todo)</Typography>
          </Card>
        </Grid>
        <Grid item xs={1}>
          {/* empty */}
        </Grid>
      </Grid>
    </Container>
  );
}

export default LobbyPage;
