import { useEffect, useRef, useState, useMemo, useContext, memo } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import User from "./User";
import InternalLink from "./InternalLink";
import SimpleInput from "./SimpleInput";
import Subheading from "./Subheading";
import Scrollbox from "./Scrollbox";
import SetCard from "./SetCard";
import UltraSetChatCards from "./UltraSetChatCards";
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import useStorage from "../hooks/useStorage";
import { UserContext } from "../context";
import { formatTime, filter, modes } from "../util";

const useStyles = makeStyles((theme) => ({
  chatPanel: {
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    transition: "text-shadow 0.5s",
    "&:hover": {
      cursor: "pointer",
      textShadow: "0 0 0.75px",
    },
  },
  chat: {
    overflowY: "auto",
    flexGrow: 1,
    overflowWrap: "anywhere",
    padding: "0 4px",
  },
  vertIcon: {
    marginLeft: "auto",
    cursor: "pointer",
    "&:hover": {
      fill: "#f06292",
    },
    visibility: "hidden",
  },
  message: {
    "&:hover > $vertIcon": {
      visibility: "visible",
    },
  },
  logEntry: {
    marginBottom: "0.35em",
    padding: "0 12px",
    textAlign: "center",
    background: theme.setFoundEntry,
  },
  logEntryText: {
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
}));

function GameChat({ gameId, history, startedAt, gameMode }) {
  const user = useContext(UserContext);
  const classes = useStyles();

  const [menuOpenIdx, setMenuOpenIdx] = useState(null);

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");
  const [chatHidden, setChatHidden] = useStorage("chat-hidden", "no");

  const messagesQuery = useMemo(
    () =>
      firebase
        .database()
        .ref(`chats/${gameId}`)
        .orderByChild("time")
        .limitToLast(200),
    [gameId]
  );
  const messages = useFirebaseQuery(messagesQuery);

  function handleSubmit(event) {
    event.preventDefault();
    if (input) {
      if (filter.isProfane(input)) {
        alert(
          "We detected that your message contains profane language. If you think this was a mistake, please let us know!"
        );
      } else {
        firebase.database().ref(`chats/${gameId}`).push({
          user: user.id,
          message: input,
          time: firebase.database.ServerValue.TIMESTAMP,
        });
        setInput("");
      }
    }
  }

  function toggleChat() {
    setChatHidden(chatHidden === "yes" ? "no" : "yes");
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickVertIcon = (event, key) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenIdx(key);
  };

  const handleDelete = (key) => {
    firebase.database().ref(`chats/${gameId}`).child(key).remove();
    handleClose();
  };

  const handleDeleteAll = async (uid) => {
    const messages = await firebase
      .database()
      .ref(`chats/${gameId}`)
      .orderByChild("user")
      .equalTo(uid)
      .once("value");
    const updates = {};
    messages.forEach((snap) => {
      updates[snap.key] = null;
    });
    firebase.database().ref(`chats/${gameId}`).update(updates);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenIdx(null);
  };

  const items = messages;
  if (history) {
    for (let i = 0; i < history.length; i++) {
      items[`card@${i}`] = history[i];
    }
  }

  return (
    <section
      className={classes.chatPanel}
      style={{ flexGrow: 1, overflowY: "hidden" }}
    >
      <Subheading className={classes.chatHeader} onClick={toggleChat}>
        Game Chat {chatHidden === "yes" && "(Hidden)"}
      </Subheading>
      <Scrollbox className={classes.chat} ref={chatEl}>
        {Object.entries(items)
          .sort(([, a], [, b]) => a.time - b.time)
          .map(([key, item]) =>
            key.startsWith("card@") ? (
              <Tooltip
                arrow
                placement="left"
                title={formatTime(item.time - startedAt)}
                key={key}
              >
                <div className={classes.logEntry}>
                  <div className={classes.logEntryText}>
                    <Typography
                      variant="subtitle2"
                      style={{ marginRight: "0.2em" }}
                    >
                      {modes[gameMode].setType} found by
                    </Typography>
                    <User
                      component={Typography}
                      noWrap={true}
                      variant="subtitle2"
                      id={item.user}
                    />
                  </div>
                  {(gameMode === "normal" || gameMode === "setchain") && (
                    <div>
                      <SetCard size="sm" value={item.c1} />
                      <SetCard size="sm" value={item.c2} />
                      <SetCard size="sm" value={item.c3} />
                    </div>
                  )}
                  {gameMode === "ultraset" && <UltraSetChatCards item={item} />}
                </div>
              </Tooltip>
            ) : (
              chatHidden !== "yes" && (
                <div
                  key={key}
                  style={{ display: "flex", flexDirection: "row" }}
                  className={classes.message}
                >
                  <Typography variant="body2" gutterBottom>
                    <User
                      id={item.user}
                      component={InternalLink}
                      to={`/profile/${item.user}`}
                      underline="none"
                    />
                    : {item.message}
                  </Typography>
                  {user.admin && (
                    <MoreVertIcon
                      aria-controls="admin-menu"
                      color="inherit"
                      className={classes.vertIcon}
                      onClick={(e) => handleClickVertIcon(e, key)}
                    />
                  )}

                  <Menu
                    id="admin-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && key === menuOpenIdx}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleDelete(key)}>
                      Delete message
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteAll(item.user)}>
                      Delete all from user
                    </MenuItem>
                  </Menu>
                </div>
              )
            )
          )}
      </Scrollbox>
      <form onSubmit={handleSubmit}>
        <SimpleInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={250}
        />
      </form>
    </section>
  );
}

export default memo(GameChat);
