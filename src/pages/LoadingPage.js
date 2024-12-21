import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";

import Loading from "../components/Loading";

const useStyles = makeStyles({
  loadingContainer: {
    padding: 48,
    textAlign: "center",
  },
});

function LoadingPage() {
  const styles = useStyles();
  return (
    <Container className={styles.loadingContainer}>
      <Loading />
    </Container>
  );
}

export default LoadingPage;
