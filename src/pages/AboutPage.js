import React from "react";

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
          Set with Friends was developed by{" "}
          <Link href="https://github.com/ekzhang">Eric Zhang</Link> and{" "}
          <Link href="https://github.com/cynthiakedu">Cynthia Du</Link> as a
          side project in early 2020. We love the game, and our goal was to
          bridge the distance between friends by creating the simplest interface
          for playing Set online. The source code and technical details are
          available on GitHub at{" "}
          <Link href="https://github.com/ekzhang/setwithfriends">
            ekzhang/setwithfriends
          </Link>
          . We would appreciate stars, forks, and any comments or suggestions!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Also, thanks to our code contributors{" "}
          <Link href="https://github.com/tarehart">Tyler Arehart</Link>,{" "}
          <Link href="https://github.com/stevenhao">Steven Hao</Link>,{" "}
          <Link href="https://github.com/eparadise">Eliza Paradise</Link>, and{" "}
          <Link href="https://github.com/wenley">Wenley Tong</Link>, as well as
          the many others who reported bugs and provided feedback.
        </Typography>
      </Paper>
      <Typography variant="body1" align="center" gutterBottom>
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default AboutPage;
