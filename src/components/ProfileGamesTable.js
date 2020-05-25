import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
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

  //Remove cells of some columns of table for small screens
  vanishingTableCell: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));
function ProfileGamesTable({ handleClickGame, games }) {
  const classes = useStyles();

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
          {[...Array(30)].map((_, i) =>
            i % 2 ? (
              <TableRow key={i} onClick={handleClickGame}>
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
              <TableRow key={i} onClick={handleClickGame}>
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
              <TableRow key={i} onClick={handleClickGame}>
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
  );
}
export default ProfileGamesTable;
