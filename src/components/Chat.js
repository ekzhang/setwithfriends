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

import User from "./User";
import ChatInput from "./ChatInput";
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import { UserContext } from "../context";

const useStyles = makeStyles((theme) => ({
  chatPanel: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
}));

function Chat() {
  const user = useContext(UserContext);
  const classes = useStyles();

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");

  const messagesQuery = useMemo(
    () =>
      firebase.database().ref("lobbyChat").orderByChild("time").limitToLast(50),
    []
  );
  const messages = useFirebaseQuery(messagesQuery);

  function handleSubmit(event) {
    event.preventDefault();
    if (input) {
      firebase.database().ref(`lobbyChat`).push({
        user: user.id,
        message: input,
        time: firebase.database.ServerValue.TIMESTAMP,
      });
    }
    setInput("");
  }

  return (
    <section
      className={classes.chatPanel}
      style={{ flexGrow: 1, overflowY: "hidden" }}
    >
      <Typography variant="overline">Lobby Chat</Typography>
      <div style={{ overflowY: "auto", flexGrow: 1 }} ref={chatEl}>
        {Object.entries(messages).map(([key, msg]) => (
          <Typography key={key} variant="body2" gutterBottom>
            <User id={msg.user} />: {msg.message}
          </Typography>
        ))}
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

export default memo(Chat);
