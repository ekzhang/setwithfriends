import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import cowImage from "../assets/cow_404.png";

function NotFoundPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Not Found
      </Typography>
      <img
        src={cowImage}
        alt="404"
        style={{ display: "block", maxWidth: "100%", margin: "0 auto" }}
      />
      <Typography variant="body1" align="center">
        <Link component={RouterLink} to="/" gutterBottom>
          Return to home
        </Link>
      </Typography>
    </Container>
  );
}

export default NotFoundPage;
