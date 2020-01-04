import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Link as RouterLink } from "react-router-dom";

function AboutPage() {
  return (
    <Container>
      <Box m={3}>
        <Typography variant="h4" align="center">
          About
        </Typography>
        <Paper style={{ padding: 14, width: 640, margin: "12px auto" }}>
          <Typography variant="body1" gutterBottom>
            Set with Friends was made by{" "}
            <Link href="https://github.com/ekzhang">Eric Zhang</Link> and{" "}
            <Link href="https://github.com/cynthiakedu">Cynthia Du</Link> as a
            fun side project. The source code and technical details are
            available on Github at{" "}
            <Link href="https://github.com/ekzhang/setwithfriends">
              ekzhang/setwithfriends
            </Link>
            . We would appreciate stars, forks, and any comments or suggestions!
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

export default AboutPage;
