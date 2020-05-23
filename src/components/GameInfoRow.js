import React from "react";

import HourglassEmptyRoundedIcon from "@material-ui/icons/HourglassEmptyRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import ElapsedTime from "./ElapsedTime";
import User from "./User";
import useFirebaseRef from "../hooks/useFirebaseRef";

function GameInfoRow({ gameId, onClick }) {
  const [game, loading] = useFirebaseRef(`/games/${gameId}`);
  if (loading) {
    return null;
  }
  return (
    <TableRow onClick={onClick}>
      <TableCell>
        <User id={game.host} />
      </TableCell>
      <TableCell>{game.users ? Object.keys(game.users).length : 0}</TableCell>
      <TableCell>
        {game.status === "ingame" ? (
          <PlayArrowRoundedIcon fontSize="small" />
        ) : game.status === "waiting" ? (
          <HourglassEmptyRoundedIcon fontSize="small" />
        ) : (
          <DoneRoundedIcon fontSize="small" />
        )}
      </TableCell>
      <TableCell>
        <ElapsedTime value={game.createdAt} />
      </TableCell>
    </TableRow>
  );
}

export default GameInfoRow;
