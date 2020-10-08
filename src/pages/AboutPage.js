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
          for playing Set online.
        </Typography>
        <Typography variant="body1" gutterBottom>
          The source code and technical details are available on{" "}
          <Link href="https://github.com/ekzhang/setwithfriends">GitHub</Link>.
          We are open to contributors from all backgrounds, whether you're a
          seasoned programmer or just want to learn more about web development.
          Please see the repository for detailed instructions.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>
            If you have comments or suggestions, the best way to reach us is by{" "}
            <Link href="https://github.com/ekzhang/setwithfriends/issues">
              filing an issue
            </Link>
            .
          </strong>{" "}
          You can also contact the authors by email at{" "}
          <Link href="mailto:ekzhang1@gmail.com">ekzhang1@gmail.com</Link> and{" "}
          <Link href="mailto:cynthiakedu@gmail.com">cynthiakedu@gmail.com</Link>
          .
        </Typography>
        <hr style={{ margin: "1em 0" }} />
        <Typography variant="body1" gutterBottom>
          Thanks to our code contributors{" "}
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
