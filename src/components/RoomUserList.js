import { useContext } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import SnoozeIcon from "@material-ui/icons/Snooze";
import StarsIcon from "@material-ui/icons/Stars";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { useTransition, animated } from "@react-spring/web";
import { Link as RouterLink } from "react-router-dom";

import User from "../components/User";
import { UserContext } from "../context";

function RoomUserList({ game, gameId }) {
  const user = useContext(UserContext);

  // Current list of players, sorted by when they joined
  const users = Object.keys(game.users || {}).sort(
    (a, b) => game.users[a] - game.users[b]
  );
  const transition = useTransition(users, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <List dense disablePadding>
      {transition((style, playerId) => (
        <animated.div style={style}>
          <User
            id={playerId}
            showRating={game.mode || "normal"}
            component={Typography}
            variant="body2"
            noWrap
            render={(player, playerEl) => (
              <ListItem
                button
                component={RouterLink}
                to={`/profile/${playerId}`}
              >
                <ListItemIcon>
                  {player.connections &&
                  Object.values(player.connections).includes(
                    `/room/${gameId}`
                  ) ? (
                    <Tooltip title={playerId === game.host ? "Host" : "Player"}>
                      {playerId === game.host ? <StarsIcon /> : <PersonIcon />}
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        playerId === game.host
                          ? "Inactive host"
                          : "Inactive player"
                      }
                    >
                      <SnoozeIcon />
                    </Tooltip>
                  )}
                </ListItemIcon>

                <ListItemText disableTypography>{playerEl}</ListItemText>
                {playerId === user.id && (
                  <ListItemText style={{ flex: "0 0 auto", marginLeft: 8 }}>
                    (You)
                  </ListItemText>
                )}
              </ListItem>
            )}
          />
        </animated.div>
      ))}
    </List>
  );
}

export default RoomUserList;
