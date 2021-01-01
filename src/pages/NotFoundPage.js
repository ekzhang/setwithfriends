import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InternalLink from "../components/InternalLink";
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
        style={{ display: "block", maxWidth: "100%", margin: "0 auto 8px" }}
      />
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

export default NotFoundPage;
