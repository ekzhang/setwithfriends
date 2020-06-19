import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useContext,
  memo,
} from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import User from "./User";
import SimpleInput from "./SimpleInput";
import SetCard from "./SetCard";
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import { UserContext } from "../context";
import { formatTime } from "../util";

const useStyles = makeStyles((theme) => ({
  chatPanel: {
    display: "flex",
    flexDirection: "column",
  },
  chat: {
    overflowY: "auto",
    flexGrow: 1,
    overflowWrap: "anywhere",
    padding: "0 4px",
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

function GameChat({ gameId, history, startedAt }) {
  const user = useContext(UserContext);
  const classes = useStyles();

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");

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
      firebase.database().ref(`chats/${gameId}`).push({
        user: user.id,
        message: input,
        time: firebase.database.ServerValue.TIMESTAMP,
      });
    }
    setInput("");
  }

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
      <Typography variant="overline">Game Chat</Typography>
      <div className={classes.chat} ref={chatEl}>
        {Object.entries(items)
          .sort(([, a], [, b]) => a.time - b.time)
          .map(([key, item]) =>
            key.startsWith("card@") ? (
              <Tooltip
                arrow
                placement="left"
                title={formatTime(item.time - startedAt)}
              >
                <div className={classes.logEntry} key={key}>
                  <div className={classes.logEntryText}>
                    <Typography
                      variant="subtitle2"
                      style={{ marginRight: "0.2em" }}
                    >
                      Set found by
                    </Typography>
                    <User
                      component={Typography}
                      noWrap={true}
                      variant="subtitle2"
                      id={item.user}
                    />
                  </div>
                  <div>
                    <SetCard size="sm" value={item.c1} />
                    <SetCard size="sm" value={item.c2} />
                    <SetCard size="sm" value={item.c3} />
                  </div>
                </div>
              </Tooltip>
            ) : (
              <Typography key={key} variant="body2" gutterBottom>
                <User id={item.user} />: {item.message}
              </Typography>
            )
          )}
      </div>
      <form onSubmit={handleSubmit}>
        <SimpleInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
    </section>
  );
}

export default memo(GameChat);
