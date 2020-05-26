import React from "react";

import HourglassEmptyRoundedIcon from "@material-ui/icons/HourglassEmptyRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";

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
          <Tooltip title="Ongoing game" arrow placement="top">
            <PlayArrowRoundedIcon fontSize="small" />
          </Tooltip>
        ) : game.status === "waiting" ? (
          <Tooltip title="Waiting for players" arrow placement="top">
            <HourglassEmptyRoundedIcon fontSize="small" />
          </Tooltip>
        ) : (
          <Tooltip title="Finished game" arrow placement="top">
            <DoneRoundedIcon fontSize="small" />
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <ElapsedTime value={game.createdAt} />
      </TableCell>
    </TableRow>
  );
}

export default GameInfoRow;
