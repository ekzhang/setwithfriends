import { useContext } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import InternalLink from "../components/InternalLink";
import firebase from "../firebase";
import useFirebaseRef from "../hooks/useFirebaseRef";
import { UserContext } from "../context";
import { patronCheckout } from "../stripe";

function DonatePage() {
  const user = useContext(UserContext);
  const email = firebase.auth().currentUser.email;

  const [gameCount, loadingGameCount] = useFirebaseRef("/stats/gameCount");

  const handleDonate = async () => {
    firebase.analytics().logEvent("begin_checkout", {
      currency: "USD",
      value: 5.0,
    });
    const result = await patronCheckout();
    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Become a Patron
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body1" gutterBottom>
          Hi there! We are Eric and Cynthia, lead developers of Set with
          Friends.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <em>Set with Friends</em> is an online, real-time multiplayer card
          game. It's <strong>free, forever, for everyone</strong>
          {!loadingGameCount && (
            <>
              , and over <strong>{gameCount.toLocaleString()}</strong> games
              have been played
            </>
          )}
          . We want to make it as easy as possible to have fun playing Set
          online, and we don't run ads. All of our code is open source and
          developed entirely by volunteers.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you enjoy using this site, please consider supporting us by
          donating and becoming a patron! In addition to helping us pay for
          ultra-fast servers and ongoing development, you'll gain access to some{" "}
          <strong>awesome perks</strong>:
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
          <ul>
            <li>
              Ability to create <em>private rooms</em>. These are invite-only
              and don't show up in the lobby &mdash; no more random people
              joining your family game night!
            </li>
            <li>
              Bragging rights with a <em>hot icon</em> next to your name (e.g.,{" "}
              <span
                style={{
                  fontWeight: 500,
                }}
              >
                <WhatshotIcon
                  fontSize="inherit"
                  style={{ marginBottom: "-0.2rem" }}
                />{" "}
                {user.name}
              </span>
              ).
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you have any questions or need assistance with payment, reach out
          to us.
        </Typography>
        {email ? (
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
      <Typography variant="body1" align="center" style={{ margin: 12 }}>
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default DonatePage;
