import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import generate from "project-name-generator";
import { useContext, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import Chat from "../components/Chat";
import GameInfoRow from "../components/GameInfoRow";
import InternalLink from "../components/InternalLink";
import { UserContext } from "../context";
import firebase, { createGame } from "../firebase";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import useFirebaseRef from "../hooks/useFirebaseRef";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    "--table-height": "400px", // responsive variable
    [theme.breakpoints.up("sm")]: {
      "--table-height": "480px",
    },
    [theme.breakpoints.up("md")]: {
      "--table-height": "calc(min(100vh - 140px, 720px))",
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
    "& tbody > tr:hover": {
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
    "& > p:first-of-type": {
      marginBottom: "0.2em",
    },
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
      bottom: 4,
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: 4,
      display: "flex",
      justifyContent: "space-between",
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
    [theme.breakpoints.down("sm")]: {
      "& button": {
        marginBottom: theme.spacing(1),
      },
    },
  },
  chatColumn: {
    maxHeight: "calc(var(--table-height) + 16px)",
    [theme.breakpoints.up("md")]: {
      marginTop: 36,
    },
  },
  chatColumnPaper: {
    padding: 8,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  chatPanel: {
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

// Add separators to a large number, every 3 digits, while also displaying in
// a span that is styled with equal width numerals.
//   humanize(12345) -> "12,345"
function humanize(number) {
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {number.toLocaleString()}
    </span>
  );
}

function LobbyPage() {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [redirect, setRedirect] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const gamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref("/publicGames")
      .orderByValue()
      .limitToLast(35);
  }, []);
  const games = useFirebaseQuery(gamesQuery);

  const myGamesQuery = useMemo(() => {
    return firebase
      .database()
      .ref(`/userGames/${user.id}`)
      .orderByValue()
      .limitToLast(35);
  }, [user.id]);
  const myGames = useFirebaseQuery(myGamesQuery);

  const [stats, loadingStats] = useFirebaseRef("/stats");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (redirect) return <Navigate push to={redirect} />;

  async function newRoom(access) {
    // Make several attempts to create a game with an unused ID
    setWaiting(true);
    let attempts = 0;
    while (attempts < 5) {
      const gameId = generate({ words: 3 }).dashed;
      try {
        await createGame({ gameId, access });
      } catch (error) {
        if (error.code === "functions/already-exists") {
          // We generated an already-used game ID
          ++attempts;
          continue;
        } else {
          // Unspecified error occurred
          setWaiting(false);
          alert(error.toString());
          return;
        }
      }
      // Successful game creation
      firebase.analytics().logEvent("create_game", { gameId, access });
      setRedirect(`/room/${gameId}`);
      return;
    }
    // Unsuccessful game creation
    setWaiting(false);
    alert("Error: Could not find an available game ID.");
  }

  return (
    <Container>
      <Grid container spacing={2} className={classes.mainGrid}>
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          order={{ xs: 3, md: 1 }}
          className={classes.chatColumn}
        >
          <Paper className={classes.chatColumnPaper}>
            <Chat title="Lobby Chat" messageLimit={30} showMessageTimes />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={8} md={6} order={{ xs: 1, md: 2 }}>
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
                  <TableCell>Players</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
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

        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          order={{ xs: 2, md: 3 }}
          className={classes.buttonColumn}
        >
          <div className={classes.actionButtons}>
            <Tooltip
              arrow
              placement="top"
              title="Create a new game, which will appear in the lobby. You can also invite your friends to join by link!"
            >
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => newRoom("public")}
                disabled={waiting}
              >
                Create a game
              </Button>
            </Tooltip>
            <Tooltip
              arrow
              placement="bottom"
              title="Create a new private game. Only players you share the link with will be able to join."
            >
              <Button
                variant="contained"
                fullWidth
                color="grey"
                onClick={() => newRoom("private")}
                disabled={waiting}
              >
                New private game
              </Button>
            </Tooltip>
          </div>
          <div className={classes.gameCounters}>
            <Typography variant="body2">
              <strong>
                {loadingStats
                  ? "---"
                  : humanize((stats && stats.onlineUsers) || 0)}
              </strong>{" "}
              users online
            </Typography>
            <Typography variant="body2">
              <strong>
                {loadingStats
                  ? "---,---"
                  : humanize((stats && stats.gameCount) || 0)}
              </strong>{" "}
              games played
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Typography variant="body1" align="center" style={{ padding: "16px 0" }}>
        <InternalLink to="/help">Help</InternalLink> •{" "}
        <InternalLink to="/about">About</InternalLink> •{" "}
        <InternalLink to="/conduct">Conduct</InternalLink> •{" "}
        <InternalLink to="/donate">Donate</InternalLink> •{" "}
        <InternalLink to="/legal">Legal</InternalLink> •{" "}
        <Link
          target="_blank"
          rel="noopener"
          href="https://discord.gg/XbjJyc9"
          underline="hover"
        >
          Discord
        </Link>
      </Typography>
    </Container>
  );
}

export default LobbyPage;
