import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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
