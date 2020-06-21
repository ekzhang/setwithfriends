import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import InternalLink from "../components/InternalLink";

function ContactPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Contact
      </Typography>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        <Typography variant="body1" gutterBottom>
          Issues and pull requests can be submitted through{" "}
          <Link href="https://github.com/ekzhang/setwithfriends">GitHub</Link>.
          You can also contact the authors by email at{" "}
          <Link href="mailto:ekzhang1@gmail.com">ekzhang1@gmail.com</Link> and{" "}
          <Link href="mailto:cynthiakedu@gmail.com">cynthiakedu@gmail.com</Link>
          .
        </Typography>
      </Paper>
      <Typography variant="body1" align="center">
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default ContactPage;
