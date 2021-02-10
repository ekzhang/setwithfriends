import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import InternalLink from "../components/InternalLink";

function AboutPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        About
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body1" gutterBottom>
          Set with Friends was started by{" "}
          <Link href="https://github.com/ekzhang">Eric Zhang</Link> and{" "}
          <Link href="https://github.com/cynthiakedu">Cynthia Du</Link> in early
          2020. We love the game, and our goal was to bridge the distance
          between friends by creating the simplest, free interface for playing
          Set online.
        </Typography>
        <Typography variant="body1" gutterBottom>
          The code powering this site is completely open source and available on{" "}
          <Link href="https://github.com/ekzhang/setwithfriends">GitHub</Link>.
          We are happy to provide mentorship for contributors from all
          backgrounds, whether you're a seasoned programmer or just want to
          learn more about web development.
        </Typography>
        <Typography variant="body1" gutterBottom>
          This site would not be possible without many people's help: the{" "}
          <Link href="https://github.com/ekzhang/setwithfriends/graphs/contributors">
            volunteer developers
          </Link>{" "}
          who contribute code to add features and fix bugs, the{" "}
          <Link href="https://www.patreon.com/setwithfriends">patrons</Link> who
          help keep the site running, and many others who reported bugs and
          provided feedback.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
            If you have suggestions, the best way to reach us is by{" "}
            <Link href="https://github.com/ekzhang/setwithfriends/issues">
              filing an issue
            </Link>
            .
          </strong>{" "}
          For questions about payment, please email us at{" "}
          <Link href="mailto:ekzhang1@gmail.com">ekzhang1@gmail.com</Link> and{" "}
          <Link href="mailto:cynthiakedu@gmail.com">cynthiakedu@gmail.com</Link>
          .
        </Typography>
      </Paper>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body2">
          Sounds used from{" "}
          <Link href="https://notificationsounds.com/terms-of-use">
            notificationsounds.com
          </Link>
          &nbsp;are provided under a{" "}
          <Link href="https://creativecommons.org/licenses/by/4.0/legalcode">
            Creative Commons Attribution license
          </Link>
          .
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

export default AboutPage;
