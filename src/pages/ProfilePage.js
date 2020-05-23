import React from "react";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import User from "../components/User";

function ProfilePage({ match }) {
  return (
    <Container>
      <Paper style={{ padding: 8 }}>
        <User component={Typography} variant="h4" id={match.params.id} />
      </Paper>
    </Container>
  );
}

export default ProfilePage;
