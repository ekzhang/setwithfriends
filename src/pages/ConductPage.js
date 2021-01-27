import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import InternalLink from "../components/InternalLink";

function ConductPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Conduct
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body1" gutterBottom>
          <em>
            When using this site and associated communities (including the
            official Discord server), we expect you to hold yourself to the
            following code of conduct.
          </em>
        </Typography>
        <Typography component="div" variant="body1" gutterBottom>
          <ul style={{ paddingInlineStart: 30 }}>
            <li>
              We are committed to providing a friendly, safe and welcoming
              environment for all, regardless of age, gender, sexual
              orientation, ability, ethnicity, socioeconomic status, and
              religion (or lack thereof).
            </li>
            <li>
              Please avoid using overtly sexual aliases or other nicknames that
              might detract from a friendly, safe and welcoming environment for
              all.
            </li>
            <li>
              Please be kind and courteous. There’s no need to be mean or rude.
            </li>
            <li>
              We will exclude you from interaction if you insult, demean or
              harass anyone. That is not welcome behavior. No matter who you
              are, if you feel you have been or are being harassed or made
              uncomfortable, please contact a moderator immediately.
            </li>
            <li>
              Likewise, any spamming, trolling, flaming, baiting or other
              attention-stealing behavior is not welcome. (Note that this
              applies to repeatedly asking for others to join a game in a short
              amount of time.)
            </li>
            <li>
              Keep conversations on topic. Do not chat about large news events,
              such as politics, large sports events, or other unrelated topics.
              There are many places on the internet to hold these conversations,
              and we encourage you to take them elsewhere.
            </li>
            <li>
              Remember that you share the public chat with many others. It is a
              good place to find people, but if you want to have one-on-one
              conversations or small talk, you are encouraged to do so in game
              chat rooms.
            </li>
            <li>
              A public chat is not a good place to post any personal
              information; neither here, nor on other websites on the internet.
              Please make sure you only share personal information in private
              with people you know and trust.
            </li>
            <li>
              Only links to games on this site are appropriate in the public
              chat. Links to any other website should be shared in private.
            </li>
            <li>
              Do not use computer-aided tools (i.e., bots) for finding sets
              except in private rooms, with other players who specifically agree
              to it.
            </li>
            <li>
              Content is moderated at our discretion; this applies both to the
              above rules and any other content that we deem inappropriate for
              this website.
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Questions? Please join the{" "}
          <Link
            target="_blank"
            rel="noopener"
            href="https://discord.gg/XbjJyc9"
          >
            official Discord server
          </Link>{" "}
          and contact a moderator.
        </Typography>
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

export default ConductPage;
