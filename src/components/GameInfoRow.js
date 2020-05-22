import React from "react";
import HourglassEmptyRounded from "@material-ui/icons/HourglassEmptyRounded";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import DoneRounded from "@material-ui/icons/DoneRounded";
import ElapsedTime from "../components/ElapsedTime";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

function gameRow({ game }) {
  return (
    <TableRow>
      <TableCell>{game.meta.admin}</TableCell>
      <TableCell>
        {"users" in game.meta ? Object.keys(game.meta.users).length : ""}
      </TableCell>
      <TableCell>
        {game.meta.status === "ingame" ? (
          <PlayArrowRounded fontSize="small" />
        ) : game.meta.status === "waiting" ? (
          <HourglassEmptyRounded fontSize="small" />
        ) : (
          <DoneRounded fontSize="small" />
        )}
      </TableCell>
      <TableCell>
        <ElapsedTime pastTime={game.meta.created}></ElapsedTime>
      </TableCell>
    </TableRow>
  );
  //   return <span className={classes.square} style={{ background: color }}></span>;
}

export default gameRow;
