import { useContext } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import SnoozeIcon from "@mui/icons-material/Snooze";
import StarsIcon from "@mui/icons-material/Stars";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTransition, animated } from "@react-spring/web";
import { Link as RouterLink } from "react-router-dom";

import User from "../components/User";
import { UserContext } from "../context";

function RoomUserList({ game, gameId }) {
  const user = useContext(UserContext);

  // Current list of players, sorted by when they joined
  const users = Object.keys(game.users || {}).sort(
    (a, b) => game.users[a] - game.users[b],
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
              <ListItemButton
                component={RouterLink}
                to={`/profile/${playerId}`}
              >
                <ListItemIcon>
                  {player.connections &&
                  Object.values(player.connections).includes(
                    `/room/${gameId}`,
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
              </ListItemButton>
            )}
          />
        </animated.div>
      ))}
    </List>
  );
}

export default RoomUserList;
