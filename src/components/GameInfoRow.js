import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SnoozeIcon from "@material-ui/icons/Snooze";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DoneIcon from "@material-ui/icons/Done";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { useTheme } from "@material-ui/core/styles";

import ElapsedTime from "./ElapsedTime";
import User from "./User";
import useFirebaseRef from "../hooks/useFirebaseRef";
import { makeStyles } from "@material-ui/core/styles";
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
                  theme.palette.type === "dark" ? 100 : 900
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
