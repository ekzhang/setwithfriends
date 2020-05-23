import React, { useEffect, useRef, useState, memo } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "./Loading";
import User from "./User";
import firebase from "../firebase";
import autoscroll from "../utils/autoscroll";

const useStyles = makeStyles((theme) => ({
  chatPanel: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
}));

function Chat({ user }) {
  const classes = useStyles();

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    const chatRef = firebase.database().ref(`lobbyChat`);
    function update(snapshot) {
      const items = [];
      snapshot.forEach((child) => {
        items.push(child.val());
      });
      setMessages(items);
    }
    chatRef.on("value", update);
    return () => {
      chatRef.off("value", update);
    };
  }, []);

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
        {messages ? (
          messages.map((msg, i) => (
            <Typography key={i} gutterBottom>
              <User id={msg.user} />: {msg.message}
            </Typography>
          ))
        ) : (
          <Loading />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Press [Enter] to chat"
        />
      </form>
    </section>
  );
}

export default memo(Chat);
