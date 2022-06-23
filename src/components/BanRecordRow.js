import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import User from "./User";
import ElapsedTime from "./ElapsedTime";
import useFirebaseRef from "../hooks/useFirebaseRef";

function displayBanDuration(duration) {
  if (duration >= 24 * 3600 * 1000) {
    const days = Math.floor(duration / (24 * 3600 * 1000));
    const unit = days === 1 ? "day" : "days";
    return days.toString() + " " + unit;
  } else if (duration >= 3600 * 1000) {
    const hours = Math.floor(duration / (3600 * 1000));
    const unit = hours === 1 ? "hour" : "hours";
    return hours.toString() + " " + unit;
  } else {
    const minutes = Math.floor(duration / (60 * 1000));
    const unit = minutes === 1 ? "minute" : "minutes";
    return minutes.toString() + " " + unit;
  }
}

function BanRecordRow({ banRecordProps, handleClickUser }) {
  let playerId = banRecordProps.user;
  let [player, loading] = useFirebaseRef(`users/${playerId}`);

  if (loading) {
    return null;
  }

  const isOnline =
    player.connections && Object.keys(player.connections).length > 0;

  return (
    <TableRow key={playerId} onClick={() => handleClickUser(playerId)}>
      <TableCell>
        <User id={playerId} />
      </TableCell>
      <TableCell>
        <User id={banRecordProps.moderator} />
      </TableCell>
      <TableCell>
        <ElapsedTime value={banRecordProps.time} />
      </TableCell>
      <TableCell>{displayBanDuration(banRecordProps.duration)}</TableCell>
      <TableCell>
        {player.banned && Date.now() < player.banned
          ? "Ban active"
          : player.banned
          ? "Ban expired"
          : "Never banned"}
      </TableCell>
      <TableCell>
        {isOnline ? "online now" : <ElapsedTime value={player.lastOnline} />}
      </TableCell>
    </TableRow>
  );
}

export default BanRecordRow;
