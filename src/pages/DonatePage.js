import { useContext, useState } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import InternalLink from "../components/InternalLink";
import User from "../components/User";
import firebase, { customerPortal } from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import { UserContext } from "../context";
import { patronCheckout } from "../stripe";

function DonatePage() {
  const user = useContext(UserContext);
  const email = user.authUser.email;

  const [loadingPortal, setLoadingPortal] = useState(false);
  const [gameCount, loadingGameCount] = useFirebaseRef("/stats/gameCount");

  const handleDonate = async () => {
    firebase.analytics().logEvent("begin_checkout", {
      currency: "USD",
      value: 5.0,
    });
    const result = await patronCheckout(email);
    if (result.error) {
      alert(result.error.message);
    }
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const redirect = await customerPortal({
        returnUrl: window.location.href,
      });
      window.location = redirect.data;
    } catch (error) {
      alert(error.toString());
      setLoadingPortal(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        {user.patron ? "Thanks for donating!" : "Become a Patron"}
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body1" gutterBottom>
          Hi there! We are Eric and Cynthia, lead developers of Set with
          Friends.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <em>Set with Friends</em> is an online, real-time multiplayer card
          game. It's <strong>free, forever, for everyone</strong>. We want to
          make it as easy as possible to have fun playing Set online{" "}
          {!loadingGameCount && (
            <>
              (over <strong>{gameCount.toLocaleString()}</strong> games have
              been played)
            </>
          )}
          , and we don't run ads. All of our code is open source and developed
          entirely by volunteers.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you enjoy using this site, please consider supporting us by
          donating and becoming a patron. In addition to helping us pay for
          ultra-fast servers and ongoing development, you'll gain access to some{" "}
          cosmetic perks:
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
          <ul>
            <li>
              Bragging rights with a patron icon next to your name (e.g.,{" "}
              <User id={user.id} forcePatron />
              ).
            </li>
            <li>
              Freedom to create a name without limiting to just letters,
              numbers, and punctuation.
            </li>
            <li>
              Exclusive setting to choose the color of your username &mdash;
              pick whatever you like!
            </li>
            <li>More to come soon!</li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you have any questions or need assistance with payment,{" "}
          <InternalLink to="/about">reach out to us</InternalLink>.
        </Typography>
        {user.patron ? (
          <>
            <hr />
            <Typography
              variant="body1"
              style={{ fontStyle: "italic", fontWeight: "bold" }}
              gutterBottom
            >
              Thank you for your support! We have successfully processed your
              payment; your account ({email}) is now registered as a patron.
            </Typography>
            <Button
              variant="outlined"
              onClick={handlePortal}
              fullWidth
              style={{ marginTop: 8 }}
              disabled={loadingPortal}
            >
              Manage billing
            </Button>
          </>
        ) : email ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDonate}
            fullWidth
            style={{ marginTop: 8 }}
          >
            <WhatshotIcon style={{ marginRight: "0.2em" }} /> Become a patron
          </Button>
        ) : (
          <Typography variant="body1" style={{ fontStyle: "italic" }}>
            It looks like you're playing anonymously right now. If you'd like to
            become a patron, please link your Google account from the settings
            menu, so you can log in at any time.
          </Typography>
        )}
      </Paper>
      <Typography
        variant="body1"
        align="center"
        style={{ marginTop: 12, paddingBottom: 12 }}
      >
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default DonatePage;
