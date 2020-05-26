import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import amber from "@material-ui/core/colors/amber";
import grey from "@material-ui/core/colors/grey";
import moment from "moment";

import ElapsedTime from "./ElapsedTime";
import User from "./User";
import Loading from "./Loading";

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
    "& tr:hover": {
      background: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  //Remove cells of some columns of table for small screens
  vanishingTableCell: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));
function ProfileGamesTable({ userId, gamesData, handleClickGame }) {
  const classes = useStyles();
  if (!gamesData) {
    return <Loading></Loading>;
  }
  if (Object.keys(gamesData).length === 0) {
    return (
      <Typography style={{ color: grey[300] }}>
        No games finished yet...
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} className={classes.gamesTable}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell className={classes.vanishingTableCell}>Host</TableCell>
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
          {Object.values(gamesData)
            .sort((g1, g2) => g2.createdAt - g1.createdAt)
            .map((game, i) => {
              return (
                <TableRow key={i} onClick={() => handleClickGame(game.gameId)}>
                  <TableCell>{i + 1}.</TableCell>
                  <TableCell className={classes.vanishingTableCell}>
                    <User id={game.host} />
                  </TableCell>
                  <TableCell>{Object.keys(game.users).length}</TableCell>
                  <TableCell>{game.scores[userId] || 0}</TableCell>
                  <TableCell>
                    {moment.duration(game.endedAt - game.startedAt).humanize()}
                  </TableCell>
                  <TableCell className={classes.vanishingTableCell}>
                    <ElapsedTime value={game.createdAt}></ElapsedTime>
                  </TableCell>
                  <TableCell>
                    {game.winner === userId ? (
                      <StarIcon style={{ color: amber[500] }}></StarIcon>
                    ) : (
                      <></>
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
