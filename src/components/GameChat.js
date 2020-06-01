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
import { lightGreen } from "@material-ui/core/colors";

import User from "./User";
import ChatInput from "./ChatInput";
import SetCard from "./SetCard";
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import { UserContext } from "../context";

const useStyles = makeStyles((theme) => ({
  chatPanel: {
    display: "flex",
    flexDirection: "column",
  },
  chat: {
    overflowY: "auto",
    flexGrow: 1,
    overflowWrap: "anywhere",
  },
  logEntry: {
    marginBottom: "0.35em",
    textAlign: "center",
    background: lightGreen[100],
  },
}));

function GameChat({ gameId, history }) {
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
              <div className={classes.logEntry} key={key}>
                <Typography variant="subtitle2">
                  Set found by <User id={item.user} />
                </Typography>
                <div>
                  <SetCard size="sm" value={item.c1} />
                  <SetCard size="sm" value={item.c2} />
                  <SetCard size="sm" value={item.c3} />
                </div>
              </div>
            ) : (
              <Typography key={key} variant="body2" gutterBottom>
                <User id={item.user} />: {item.message}
              </Typography>
            )
          )}
      </div>
      <form onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
    </section>
  );
}

export default memo(GameChat);
