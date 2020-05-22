import React from "react";

import HourglassEmptyRoundedIcon from "@material-ui/icons/HourglassEmptyRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import ElapsedTime from "../components/ElapsedTime";

function GameInfoRow({ game, onClick }) {
  return (
    <TableRow onClick={onClick}>
      <TableCell>{game.meta.admin}</TableCell>
      <TableCell>
        {"users" in game.meta ? Object.keys(game.meta.users).length : ""}
      </TableCell>
      <TableCell>
        {game.meta.status === "ingame" ? (
          <PlayArrowRoundedIcon fontSize="small" />
        ) : game.meta.status === "waiting" ? (
          <HourglassEmptyRoundedIcon fontSize="small" />
        ) : (
          <DoneRoundedIcon fontSize="small" />
        )}
      </TableCell>
      <TableCell>
        <ElapsedTime value={game.meta.created} />
      </TableCell>
    </TableRow>
  );
}

export default GameInfoRow;
