import React, { useState, useEffect, useRef, useMemo } from "react";

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
import HourglassEmptyRounded from "@material-ui/icons/HourglassEmptyRounded";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import DoneRounded from "@material-ui/icons/DoneRounded";
import Face from "@material-ui/icons/Face";
import SportsEsports from "@material-ui/icons/SportsEsports";

import autoscroll from "../utils/autoscroll";

import moment from "moment";

import firebase from "../firebase";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import useMoment from "../hooks/useMoment";

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
        margin: "18px 0",
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

function LobbyPage({ user }) {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(null);
  const chatEl = useRef();

  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const gamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref("/games")
      .orderByChild("/meta/created")
      .startAt(false)
      .limitToLast(100);
  }, []);
  const games = useFirebaseQuery(gamesQuery);

  const onlineUsersQuery = useMemo(() => {
    return firebase
      .database()
      .ref("users")
      .orderByChild("connections")
      .startAt(false);
  }, []);
  const users = useFirebaseQuery(onlineUsersQuery);

  const myGamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref("/games")
      .orderByChild(`/meta/users/${user.id}`)
      .startAt(false);
  }, [user.id]);
  const myGames = useFirebaseQuery(myGamesQuery);

  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const time = useMoment();

  if (redirect) return <Redirect push to={redirect} />;

  function newRoom(isPrivate) {
    setRedirect(
      "/room/" + generate().dashed + `${isPrivate ? "?private=true" : ""}`
    );
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
                Online Users ({Object.keys(users).length})
              </Typography>
              <List
                dense
                style={{ paddingTop: 0, overflowY: "auto", flexGrow: 1 }}
              >
                {Object.entries(users).map(([userId, user]) => (
                  <ListItem key={userId} button>
                    <ListItemIcon>
                      <Face />
                    </ListItemIcon>
                    <ListItemText>{user.name}</ListItemText>
                  </ListItem>
                ))}
                {/* <SportsEsports /> */}
              </List>
            </section>
            <Divider />
            <section
              className={classes.chatPanel}
              style={{ flexGrow: 1, overflowY: "hidden" }}
            >
              <Typography variant="overline">Lobby Chat</Typography>
              <div style={{ overflowY: "auto", flexGrow: 1 }} ref={chatEl}>
                {[...Array(50)].map((_, i) => (
                  <div key={i}>
                    <b>Eric Zhang</b>: Hello world {i}!
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => e.preventDefault() || alert("chat!")}>
                <input
                  style={{ width: "100%" }}
                  placeholder="Press [Enter] to chat"
                />
              </form>
            </section>
            <Divider />
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
              <Tab label="Lobby"></Tab>
              <Tab label="Your games"></Tab>
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
                  {Object.entries(tabValue === 0 ? games : myGames)
                    .sort((a, b) => b[1].meta.created - a[1].meta.created)
                    .map(([gameId, gameInfo]) => (
                      <TableRow
                        key={gameId}
                        onClick={() => setRedirect(`/room/${gameId}`)}
                      >
                        <TableCell>{gameId}</TableCell>
                        <TableCell>
                          {"users" in gameInfo.meta
                            ? Object.keys(gameInfo.meta.users).length
                            : ""}
                        </TableCell>
                        <TableCell>
                          {gameInfo.meta.status === "ingame" ? (
                            <PlayArrowRounded fontSize="small" />
                          ) : gameInfo.meta.status === "waiting" ? (
                            <HourglassEmptyRounded fontSize="small" />
                          ) : (
                            <DoneRounded fontSize="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(gameInfo.meta.created).from(time)}
                        </TableCell>
                      </TableRow>
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
                onClick={() => newRoom(false)}
              >
                Create a Game
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => newRoom(true)}
              >
                New Private Game
              </Button>
            </div>
            <div className={classes.gameCounters}>
              <Typography variant="body2" gutterBottom>
                <b>37,000</b> games played
              </Typography>
            </div>
          </Grid>
        </Box>
      </Grid>
      <Typography variant="body1" align="center" style={{ margin: 16 }}>
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
