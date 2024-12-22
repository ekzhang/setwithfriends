import StarIcon from "@mui/icons-material/Star";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { amber, grey } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";

import { colors, formatTime, modes } from "../util";
import ElapsedTime from "./ElapsedTime";
import Loading from "./Loading";
import User from "./User";

const useStyles = makeStyles((theme) => ({
  gamesTable: {
    display: "flex",
    flexDirection: "column",
    maxHeight: 400,
    marginBottom: theme.spacing(1),
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
    "& th": {
      background: theme.palette.background.panel,
    },
    "& tr": {
      background: theme.custom.profileTable.row,
    },
    "& tr:hover": {
      background: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  // Remove cells of some columns of table for small screens
  vanishingTableCell: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

function ProfileGamesTable({ userId, gamesWithScores, handleClickGame }) {
  const classes = useStyles();
  const theme = useTheme();

  if (!gamesWithScores) {
    return <Loading />;
  }
  if (Object.keys(gamesWithScores).length === 0) {
    return (
      <Typography style={{ color: grey[400] }}>
        No recent games to display…
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} className={classes.gamesTable}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Host</TableCell>
            <TableCell>Players</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Num. Sets</TableCell>
            <TableCell>Length</TableCell>
            <TableCell className={classes.vanishingTableCell}>
              Created
            </TableCell>
            <TableCell>Won</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(gamesWithScores)
            .sort(([, g1], [, g2]) => g2.createdAt - g1.createdAt)
            .map(([gameId, game]) => {
              const modeInfo = modes[game.mode || "normal"];
              return (
                <TableRow key={gameId} onClick={() => handleClickGame(gameId)}>
                  <TableCell>
                    <User id={game.host} />
                  </TableCell>
                  <TableCell>{Object.keys(game.users).length}</TableCell>
                  <TableCell
                    style={{
                      color:
                        colors[modeInfo.color][
                          theme.palette.mode === "dark" ? 100 : 900
                        ],
                    }}
                  >
                    {modeInfo.name}
                  </TableCell>
                  <TableCell>
                    {game.scores ? game.scores[userId] || 0 : "—"}
                  </TableCell>
                  <TableCell>
                    {formatTime(game.endedAt - game.startedAt)}
                  </TableCell>
                  <TableCell className={classes.vanishingTableCell}>
                    <ElapsedTime value={game.createdAt} />
                  </TableCell>
                  <TableCell>
                    {game.scores &&
                      game.scores[userId] ===
                        Math.max(0, ...Object.values(game.scores)) && (
                        <StarIcon style={{ color: amber[500] }} />
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfileGamesTable;
