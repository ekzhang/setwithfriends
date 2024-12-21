import WhatshotIcon from "@mui/icons-material/Whatshot";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import firebase from "../firebase";
import useMoment from "../hooks/useMoment";
import useStorage from "../hooks/useStorage";

function DonateDialog({ active }) {
  const navigate = useNavigate();

  const [viewed, setViewed] = useStorage("donate-time", "0");
  const time = useMoment(30000);
  const recentlyViewed = time
    .clone()
    .subtract(1, "days")
    .isBefore(Number(viewed));
  const handleClose = () => setViewed(time.valueOf().toString());
  const handleDonate = () => {
    firebase.analytics().logEvent("donate_dialog_click");
    navigate("/donate");
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
            underline="hover"
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
