import React, { useEffect, useState, useRef, memo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import ForumIcon from "@material-ui/icons/Forum";
import SendIcon from "@material-ui/icons/Send";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { animated, useSpring } from "react-spring";

import firebase from "../firebase";
import Loading from "./Loading";
import autoscroll from "../utils/autoscroll";

const CHAT_HEIGHT = 480;

const useStyles = makeStyles(theme => ({
  chatContainer: {
    position: "fixed",
    bottom: 0,
    left: 16,
    width: 280,
    zIndex: 1
  },
  chatHeader: {
    padding: 12,
    fontSize: "1.4rem",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    cursor: "pointer",
    "& > div": {
      display: "flex",
      alignItems: "center"
    }
  },
  chatAvatar: {
    marginRight: 10
  },
  badge: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: 5,
    padding: "1px 5px",
    fontSize: "1.25rem",
    marginLeft: 14
  },
  content: {
    height: CHAT_HEIGHT,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "0 !important"
  },
  chatArea: {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "auto",
    padding: 6,
    textAlign: "left"
  },
  chatInput: {
    flexShrink: 0,
    height: 64,
    padding: 6,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  }
}));

function Chat({ chatId, user }) {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(null);
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(0);
  const chatAreaEl = useRef(null);
  const springProps = useSpring({
    transform: `translateY(${open ? 0 : CHAT_HEIGHT}px)`
  });

  useEffect(() => {
    const chatRef = firebase.database().ref(`chats/${chatId}`);
    function update(snapshot) {
      const items = [];
      snapshot.forEach(child => {
        items.push(child.val());
      });
      setMessages(items);
      if (open) {
        setRead(items.length);
      }
    }
    chatRef.on("value", update);
    return () => {
      chatRef.off("value", update);
    };
  }, [chatId, open]);

  useEffect(() => {
    return autoscroll(chatAreaEl.current);
  }, []);

  function handleShow() {
    if (!open) {
      setRead(messages.length);
    }
    setOpen(!open);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (input) {
      firebase
        .database()
        .ref(`chats/${chatId}`)
        .push({
          user: user.name,
          message: input
        });
    }
    setInput("");
  }

  return (
    <animated.div className={classes.chatContainer} style={springProps}>
      <Card elevation={2}>
        <CardHeader
          disableTypography
          avatar={<ForumIcon size="small" />}
          title={
            <>
              Chat
              {messages && messages.length > read && (
                <span className={classes.badge}>{messages.length - read}</span>
              )}
            </>
          }
          className={classes.chatHeader}
          classes={{ avatar: classes.chatAvatar }}
          onClick={handleShow}
        />
        <CardContent className={classes.content}>
          <div className={classes.chatArea} ref={chatAreaEl}>
            {messages ? (
              messages.map((msg, i) => (
                <Typography key={i} gutterBottom>
                  <b>{msg.user}:</b> {msg.message}
                </Typography>
              ))
            ) : (
              <Loading />
            )}
          </div>
          <Divider />
          <form className={classes.chatInput} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="none"
              size="small"
              label="Message"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              <SendIcon style={{ fontSize: "1.68rem" }} />
            </Button>
          </form>
        </CardContent>
      </Card>
    </animated.div>
  );
}

export default memo(Chat);
