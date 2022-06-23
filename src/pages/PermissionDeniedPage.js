import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InternalLink from "../components/InternalLink";

function PermissionDeniedPage() {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Permission denied
      </Typography>
      <Typography align="center" gutterBottom>
        You do not have the proper permissions to view this page. Please contact
        a moderator if you think that you should have access.
      </Typography>
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

export default PermissionDeniedPage;
