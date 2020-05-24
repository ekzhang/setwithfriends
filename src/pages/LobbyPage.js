import React, { useState, useMemo, useContext } from "react";

import generate from "project-name-generator";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import FaceIcon from "@material-ui/icons/Face";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";

import firebase, { createGame } from "../firebase";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import useFirebaseRef from "../hooks/useFirebaseRef";
import GameInfoRow from "../components/GameInfoRow";
import Chat from "../components/Chat";
import { UserContext } from "../context";

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
  lobbyTabs: {
    minHeight: 32,
    "& .MuiTab-root": {
      minHeight: 32,
      textTransform: "none",
      fontWeight: 400,
    },
  },
  gameCounters: {
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
      bottom: 8,
    },
  },
  actionButtons: {
    [theme.breakpoints.up("sm")]: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "& button": {
        margin: "12px 0",
      },
    },
    [theme.breakpoints.down("xs")]: {
      "& button": {
        marginBottom: theme.spacing(1),
      },
    },
  },
  chatColumn: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(var(--table-height) + 16px)",
    [theme.breakpoints.up("md")]: {
      marginTop: 36,
    },
  },
  chatPanel: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
  buttonColumn: {
    position: "relative",
    maxHeight: "calc(var(--table-height) + 16px)",
    [theme.breakpoints.up("sm")]: {
      marginTop: 36,
    },
  },
}));

function LobbyPage() {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [redirect, setRedirect] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const onlineUsersQuery = useMemo(() => {
    return firebase
      .database()
      .ref("users")
      .orderByChild("connections")
      .startAt(false);
  }, []);
  const onlineUsers = useFirebaseQuery(onlineUsersQuery);

  const gamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref("/publicGames")
      .orderByValue()
      .limitToLast(50);
  }, []);
  const games = useFirebaseQuery(gamesQuery);

  const myGamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref(`/userGames/${user.id}`)
      .orderByValue()
      .limitToLast(50);
  }, [user.id]);
  const myGames = useFirebaseQuery(myGamesQuery);

  const [stats, loadingStats] = useFirebaseRef("/stats");

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (redirect) return <Redirect push to={redirect} />;

  async function newRoom(access) {
    const gameId = generate().dashed;
    try {
      setWaiting(true);
      await createGame({ gameId, access });
      setRedirect(`/room/${gameId}`);
    } catch (error) {
      setWaiting(false);
      alert(error.toString());
    }
  }

  function isIngame(user) {
    for (const url of Object.values(user.connections)) {
      if (url.startsWith("/game")) {
        return true;
      }
    }
    return false;
  }

  return (
    <Container>
      <Grid container spacing={2} className={classes.mainGrid}>
        <Box clone order={{ xs: 3, md: 1 }} className={classes.chatColumn}>
          <Grid item xs={12} sm={12} md={3}>
            <section
              className={classes.chatPanel}
              style={{
                flexShrink: 0,
                maxHeight: "40%",
              }}
            >
              <Typography variant="overline">
                Online Users ({Object.keys(onlineUsers).length})
              </Typography>
              <List
                dense
                disablePadding
                style={{ overflowY: "auto", flexGrow: 1 }}
              >
                {Object.entries(onlineUsers).map(([userId, user]) => (
                  <ListItem
                    key={userId}
                    button
                    component={RouterLink}
                    to={`/profile/${userId}`}
                  >
                    <ListItemIcon>
                      {isIngame(user) ? <SportsEsportsIcon /> : <FaceIcon />}
                    </ListItemIcon>
                    <ListItemText>
                      <span style={{ fontWeight: 500, color: user.color }}>
                        {user.name}
                      </span>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </section>
            <Divider />
            <Chat user={user} />
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, md: 2 }}>
          <Grid item xs={12} sm={8} md={6}>
            <Tabs
              className={classes.lobbyTabs}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              value={tabValue}
              onChange={handleTabChange}
            >
              <Tab label="Lobby" />
              <Tab label="Your games" />
            </Tabs>
            <TableContainer component={Paper} className={classes.gamesTable}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Host</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(tabValue === 0 ? games : myGames)
                    .reverse()
                    .map((gameId) => (
                      <GameInfoRow
                        key={gameId}
                        gameId={gameId}
                        onClick={() => {
                          if (!waiting) setRedirect(`/room/${gameId}`);
                        }}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
        <Box clone order={{ xs: 2, md: 3 }} className={classes.buttonColumn}>
          <Grid item xs={12} sm={4} md={3}>
            <div className={classes.actionButtons}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => newRoom("public")}
                disabled={waiting}
              >
                Create a Game
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => newRoom("private")}
                disabled={waiting}
              >
                New Private Game
              </Button>
            </div>
            <div className={classes.gameCounters}>
              <Typography variant="body2" gutterBottom>
                <strong>
                  {loadingStats ? "-----" : stats ? stats.gameCount : 0}
                </strong>{" "}
                games played
              </Typography>
            </div>
          </Grid>
        </Box>
      </Grid>
      <Typography variant="body1" align="center" style={{ padding: "16px 0" }}>
        <Link component={RouterLink} to="/help">
          Help
        </Link>{" "}
        •{" "}
        <Link component={RouterLink} to="/about">
          About
        </Link>{" "}
        •{" "}
        <Link component={RouterLink} to="/contact">
          Contact
        </Link>
      </Typography>
    </Container>
  );
}

export default LobbyPage;
