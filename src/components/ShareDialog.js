import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

import useStorage from "../hooks/useStorage";
import useMoment from "../hooks/useMoment";
import firebase from "../firebase";

const useStyles = makeStyles({
  socialBtns: {
    padding: "4px 0",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > button": {
      margin: 2,
    },
  },
});

function ShareDialog({ active }) {
  const classes = useStyles();
  const [viewed, setViewed] = useStorage("share-time", "0");
  const time = useMoment(30000);
  const recentlyViewed = time
    .clone()
    .subtract(1, "days")
    .isBefore(Number(viewed));
  const handleClose = () => setViewed(time.valueOf().toString());
  const logShare = (method) =>
    firebase.analytics().logEvent("share", { method });
  return (
    <Dialog open={active && !recentlyViewed} onClose={handleClose}>
      <DialogTitle>Help Us Grow!</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Are you enjoying our site? Please consider sharing the link with
          friends, using the social media buttons below.
        </Typography>
        <div className={classes.socialBtns}>
          <FacebookShareButton
            url="https://setwithfriends.com"
            hashtag="#setwithfriends"
            beforeOnClick={() => logShare("facebook")}
          >
            <FacebookIcon size={36} round />
          </FacebookShareButton>
          <TwitterShareButton
            url="https://setwithfriends.com"
            title="Set with Friends"
            hashtags={["setwithfriends"]}
            beforeOnClick={() => logShare("twitter")}
          >
            <TwitterIcon size={36} round />
          </TwitterShareButton>
          <WhatsappShareButton
            url="https://setwithfriends.com"
            title="Set with Friends"
            separator=" - "
            beforeOnClick={() => logShare("whatsapp")}
          >
            <WhatsappIcon size={36} round />
          </WhatsappShareButton>
          <RedditShareButton
            url="https://setwithfriends.com"
            title="Set with Friends"
            beforeOnClick={() => logShare("reddit")}
          >
            <RedditIcon size={36} round />
          </RedditShareButton>
          <EmailShareButton
            url="https://setwithfriends.com"
            subject="Set with Friends"
            body="Set with Friends"
            separator=" - "
            beforeOnClick={() => logShare("email")}
          >
            <EmailIcon size={36} round />
          </EmailShareButton>
        </div>
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

export default ShareDialog;
