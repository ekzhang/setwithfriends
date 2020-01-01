import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>Not Found</Typography>
      <Typography variant="body1" align="center">
        <Link component={RouterLink} to="/">Return to home</Link>
      </Typography>
    </Container>
  )
}

export default NotFoundPage;
