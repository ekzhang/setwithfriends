import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { Link as RouterLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container>
      <Box m={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Not Found
        </Typography>
        <Typography variant="body1" align="center">
          <Link component={RouterLink} to="/">
            Return to home
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default NotFoundPage;
