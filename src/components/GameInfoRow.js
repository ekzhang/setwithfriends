import React from "react";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DoneIcon from "@material-ui/icons/Done";
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
            <VisibilityIcon fontSize="small" />
          </Tooltip>
        ) : game.status === "waiting" ? (
          <Tooltip title="Accepting players" arrow placement="top">
            <ExitToAppIcon fontSize="small" />
          </Tooltip>
        ) : (
          <Tooltip title="Finished game" arrow placement="top">
            <DoneIcon fontSize="small" />
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
