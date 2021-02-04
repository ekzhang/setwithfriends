import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import InternalLink from "./InternalLink";
import useStorage from "../hooks/useStorage";

const useStyles = makeStyles({
  emoji: {
    display: "inline-block",
    width: "1.5em",
  },
});

function WelcomeDialog() {
  const classes = useStyles();
  const [visited, setVisited] = useStorage("welcome-v2", "new-user");
  const handleClose = () => setVisited("returning-user");
  return (
    <Dialog open={visited === "new-user"} onClose={handleClose}>
      <DialogTitle>Set with Friends</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Welcome to <em>Set with Friends</em>, an online multiplayer card game!
          It looks like this is your first visit, so here's a couple of ways you
          can use the site:
        </Typography>
        <Typography variant="body1" component="div" style={{ padding: 12 }}>
          <div>
            <span className={classes.emoji} role="img" aria-label="Game emoji">
              🎮
            </span>
            Join a <strong>public game</strong> in seconds.
          </div>
          <div>
            <span className={classes.emoji} role="img" aria-label="Fire emoji">
              🔥
            </span>
            Create a <strong>private game</strong> and invite friends.
          </div>
          <div>
            <span className={classes.emoji} role="img" aria-label="Books emoji">
              📚
            </span>
            Review the <strong>rules of Set</strong> at our{" "}
            <InternalLink to="/help" onClick={handleClose}>
              help page
            </InternalLink>
            .
          </div>
          <div>
            <span className={classes.emoji} role="img" aria-label="Chat emoji">
              💬
            </span>
            Chat with <strong>online users</strong> in the lobby.
          </div>
        </Typography>
        <Typography variant="body1">
          If you arrived here by link to a particular game, then it will start
          soon. Good luck, and have fun playing Set!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Enter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WelcomeDialog;
