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
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";
import useFirebaseQuery from "../hooks/useFirebaseQuery";
import { UserContext } from "../context";
import ElapsedTime from "./ElapsedTime";

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
      <div className={classes.chat} ref={chatEl}>
        {Object.entries(messages).map(([key, msg]) => (
          <Tooltip
            key={key}
            arrow
            placement="left"
            title={<ElapsedTime value={msg.time} />}
          >
            <Typography variant="body2" gutterBottom>
              <User id={msg.user} />: {msg.message}
            </Typography>
          </Tooltip>
        ))}
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

export default memo(Chat);
