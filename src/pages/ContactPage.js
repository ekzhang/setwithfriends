import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

function ContactPage() {
  return (
    <Container>
      <Box m={3}>
        <Typography variant="h4" align="center">
          Contact
        </Typography>
        <Paper style={{ padding: 14, width: 640, margin: "12px auto" }}>
          <Typography variant="body1" gutterBottom>
            Issues and pull requests can be submitted through{" "}
            <Link href="https://github.com/ekzhang/setwithfriends">Github</Link>
            . You can also contact the authors by email at{" "}
            <Link href="mailto:ekzhang1@gmail.com">ekzhang1@gmail.com</Link> and{" "}
            <Link href="mailto:cynthiakedu@gmail.com">
              cynthiakedu@gmail.com
            </Link>
            .
          </Typography>
        </Paper>
        <Typography variant="body1" align="center">
          <Link component={RouterLink} to="/">
            Return to home
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default ContactPage;
