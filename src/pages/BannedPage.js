import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

function BannedPage({ time }) {
  const date = new Date(time);
  return (
    <Container style={{ padding: 16 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Banned
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Due to a violation of the site's code of conduct,{" "}
        <strong>you have been banned until {date.toLocaleString()}</strong>.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Please take some time to cool off. If you have questions about this,
        contact a moderator on{" "}
        <Link target="_blank" rel="noopener" href="https://discord.gg/XbjJyc9">
          Discord
        </Link>
        .
      </Typography>
    </Container>
  );
}

export default BannedPage;
