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
import { useTransition, animated } from "react-spring";
import { Link as RouterLink } from "react-router-dom";

import User from "../components/User";
import { UserContext } from "../context";
import { BASE_RATING } from "../util";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  rating: {
    color: "white",
    backgroundColor: "dodgerblue",
    borderRadius: "5px",
    fontSize: "13.5px",
    textAlign: "center",
    width: "41px",
  }
}));

function RoomUserList({ game, gameMode, gameId }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  // Current list of players, sorted by when they joined
  const users = Object.keys(game.users || {}).sort(
    (a, b) => game.users[a] - game.users[b]
  );
  const transitions = useTransition(users, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <List dense disablePadding>
      {transitions.map(({ item: playerId, props, key }) => (
        <animated.div key={key} style={props}>
          <User
            id={playerId}
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
                <ListItemText classes={{ primary: classes.rating }}>
                  {Math.round(player.ratings == null ? BASE_RATING : player.ratings[game.mode || "normal"] || BASE_RATING)}
                </ListItemText>
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
