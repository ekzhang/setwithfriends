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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import User from "./User";
import InternalLink from "./InternalLink";
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
  vertIcon: {
    marginLeft: "auto",
    cursor: "pointer",
    "&:hover": {
      fill: "#f06292",
    },
  },
}));

function Chat() {
  const user = useContext(UserContext);
  const classes = useStyles();

  const [showVertIconIdx, setShowVertIconIdx] = useState(null);
  const [menuOpenIdx, setMenuOpenIdx] = useState(null);

  const chatEl = useRef();
  useEffect(() => {
    return autoscroll(chatEl.current);
  }, []);

  const [input, setInput] = useState("");

  const messagesQuery = useMemo(
    () =>
      firebase.database().ref("lobbyChat").orderByChild("time").limitToLast(30),
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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickVertIcon = (event, key) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenIdx(key);
  };

  const handleDelete = (key) => {
    firebase.database().ref("lobbyChat").child(key).remove();
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenIdx(null);
    setShowVertIconIdx(null);
  };

  return (
    <section
      className={classes.chatPanel}
      style={{ flexGrow: 1, overflowY: "hidden" }}
    >
      <Typography variant="overline">Lobby Chat</Typography>
      <div className={classes.chat} ref={chatEl}>
        {Object.entries(messages)
          .sort((a, b) => a[1].time - b[1].time)
          .map(([key, msg]) => (
            <div
              key={key}
              style={{ display: "flex", flexDirection: "row" }}
              onMouseEnter={() => setShowVertIconIdx(key)}
              onMouseLeave={() => setShowVertIconIdx(null)}
            >
              <Tooltip
                arrow
                placement="left"
                title={<ElapsedTime value={msg.time} />}
              >
                <Typography variant="body2" gutterBottom>
                  <User
                    id={msg.user}
                    component={InternalLink}
                    to={`/profile/${msg.user}`}
                    underline="none"
                  />
                  : {msg.message}
                </Typography>
              </Tooltip>
              {user.admin && (
                <MoreVertIcon
                  aria-controls="admin-menu"
                  color="inherit"
                  className={classes.vertIcon}
                  style={{
                    opacity: `${key === showVertIconIdx ? 1 : 0}`,
                  }}
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
              </Menu>
            </div>
          ))}
      </div>
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

export default memo(Chat);
