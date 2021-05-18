import { useEffect, useRef, useState, useMemo, useContext, memo } from "react";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";

import User from "./User";
import InternalLink from "./InternalLink";
import SimpleInput from "./SimpleInput";
import Subheading from "./Subheading";
import Scrollbox from "./Scrollbox";
import ChatCards from "./ChatCards";
import ElapsedTime from "./ElapsedTime";
import firebase from "../firebase";
import { filter } from "../util";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import useMoment from "../hooks/useMoment";
import useStorage from "../hooks/useStorage";
import { UserContext } from "../context";

const useStyles = makeStyles({
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
});

/** A chat sidebar element, opens lobby chat when the `gameId` prop is not set. */
function Chat({
  title,
  messageLimit,
  showMessageTimes,
  gameId,
  history,
  gameMode,
  startedAt,
}) {
  const user = useContext(UserContext);
  const classes = useStyles();
  const isNewUser = useMoment(30000)
    .clone()
    .subtract(5, "minutes")
    .isBefore(user.authUser.metadata.creationTime);
  const chatDisabled = !gameId && isNewUser;

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");
  const [menuOpenIdx, setMenuOpenIdx] = useState(null);
  const [chatHidden, setChatHidden] = useStorage("chat-hidden", "no");

  const databasePath = gameId ? `chats/${gameId}` : "lobbyChat";
  const messagesQuery = useMemo(
    () =>
      firebase
        .database()
        .ref(databasePath)
        .orderByChild("time")
        .limitToLast(messageLimit),
    [databasePath, messageLimit]
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
        firebase.database().ref(databasePath).push({
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
    firebase.database().ref(databasePath).child(key).remove();
    handleClose();
  };

  const handleDeleteAll = async (uid) => {
    const messages = await firebase
      .database()
      .ref(databasePath)
      .orderByChild("user")
      .equalTo(uid)
      .once("value");
    const updates = {};
    messages.forEach((snap) => {
      updates[snap.key] = null;
    });
    firebase.database().ref(databasePath).update(updates);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenIdx(null);
  };

  const items = messages;
  if (gameId && history) {
    for (let i = 0; i < history.length; i++) {
      items[`card@${i}`] = history[i];
    }
  }

  const timeTooltip = (time, elem) => {
    if (!showMessageTimes) {
      return elem;
    }
    return (
      <Tooltip arrow placement="left" title={<ElapsedTime value={time} />}>
        {elem}
      </Tooltip>
    );
  };

  return (
    <section
      className={classes.chatPanel}
      style={{ flexGrow: 1, overflowY: "hidden" }}
    >
      <Subheading className={classes.chatHeader} onClick={toggleChat}>
        {title} {chatHidden === "yes" && "(Hidden)"}
      </Subheading>
      <Scrollbox className={classes.chat} ref={chatEl}>
        {Object.entries(items)
          .sort(([, a], [, b]) => a.time - b.time)
          .map(([key, item]) =>
            key.startsWith("card@") ? (
              <ChatCards
                key={key}
                item={item}
                gameMode={gameMode}
                startedAt={startedAt}
              />
            ) : (
              chatHidden !== "yes" && (
                <div
                  key={key}
                  style={{ display: "flex", flexDirection: "row" }}
                  className={classes.message}
                >
                  {timeTooltip(
                    item.time,
                    <Typography variant="body2" gutterBottom>
                      <User
                        id={item.user}
                        component={InternalLink}
                        to={`/profile/${item.user}`}
                        underline="none"
                      />
                      : {item.message}
                    </Typography>
                  )}
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
        <Tooltip
          arrow
          title={
            chatDisabled
              ? "New users cannot chat. Play a couple games first!"
              : ""
          }
        >
          <SimpleInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            maxLength={250}
            disabled={chatDisabled}
          />
        </Tooltip>
      </form>
    </section>
  );
}

export default memo(Chat);
