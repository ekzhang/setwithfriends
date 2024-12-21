import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SnoozeIcon from "@mui/icons-material/Snooze";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import ElapsedTime from "./ElapsedTime";
import User from "./User";
import useFirebaseRef from "../hooks/useFirebaseRef";
import makeStyles from "@mui/styles/makeStyles";
import { colors, modes } from "../util";

const useStyles = makeStyles({
  host: {
    maxWidth: "14em",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

function GameInfoRow({ gameId, onClick }) {
  const classes = useStyles();
  const theme = useTheme();

  const [game, loading] = useFirebaseRef(`/games/${gameId}`);
  if (loading) {
    return null;
  }
  const gameMode = game.mode || "normal";

  const actionIcon = (host) => {
    let title, Icon;
    switch (game.status) {
      case "ingame":
        title = "Ongoing game";
        Icon = VisibilityIcon;
        break;
      case "done":
        title = "Finished game";
        Icon = DoneIcon;
        break;
      case "waiting":
        if (Object.values(host.connections || {}).includes(`/room/${gameId}`)) {
          title = "Accepting players";
          Icon = ExitToAppIcon;
        } else {
          title = "Inactive host";
          Icon = SnoozeIcon;
        }
        break;
      default:
        return null;
    }
    return (
      <Tooltip title={title} arrow placement="top">
        <Icon fontSize="small" />
      </Tooltip>
    );
  };

  return (
    <User
      id={game.host}
      component={TableCell}
      className={classes.host}
      render={(host, hostEl) => (
        <TableRow onClick={onClick}>
          {hostEl}
          <TableCell>
            {game.users ? Object.keys(game.users).length : 0}
          </TableCell>
          <TableCell
            style={{
              color:
                colors[modes[gameMode].color][
                  theme.palette.mode === "dark" ? 100 : 900
                ],
            }}
          >
            {modes[gameMode].name}
          </TableCell>
          <TableCell>{actionIcon(host)}</TableCell>
          <TableCell>
            <ElapsedTime value={game.createdAt} />
          </TableCell>
        </TableRow>
      )}
    />
  );
}

export default GameInfoRow;
