import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { useHistory } from "react-router-dom";

import useStorage from "../hooks/useStorage";
import useMoment from "../hooks/useMoment";
import firebase from "../firebase";

function DonateDialog({ active }) {
  const history = useHistory();

  const [viewed, setViewed] = useStorage("donate-time", "0");
  const time = useMoment(30000);
  const recentlyViewed = time
    .clone()
    .subtract(1, "days")
    .isBefore(Number(viewed));
  const handleClose = () => setViewed(time.valueOf().toString());
  const handleDonate = () => {
    firebase.analytics().logEvent("donate_dialog_click");
    history.push("/donate");
  };
  return (
    <Dialog open={active && !recentlyViewed} onClose={handleClose}>
      <DialogTitle>Support Set with Friends!</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Set with Friends is free for everyone. We want to make it as easy as
          possible to have fun playing Set online, and we don't run ads.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
            Recently, our site has grown massively in popularity, and server
            costs are getting expensive.
          </strong>{" "}
          If you enjoy using Set with Friends, please consider donating to help
          keep our site running. Plus, supporters get perks!
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDonate}
            fullWidth
          >
            <WhatshotIcon style={{ marginRight: "0.2em" }} /> Become a patron
          </Button>
        </Typography>
        <Typography variant="body1" gutterBottom>
          You can also show your support by{" "}
          <Link
            target="_blank"
            rel="noopener"
            href="https://github.com/ekzhang/setwithfriends"
          >
            starring the project on GitHub
          </Link>
          .
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DonateDialog;
