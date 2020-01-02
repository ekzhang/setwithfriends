import React, { useState, useEffect } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  indexMenu: {
    margin: 26,
    "& a": {
      margin: 12
    }
  },
  container: {
    padding: 40,
    height: "100%",
    textAlign: "center"
  }
});

function IndexPage() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    function handleKeyDown(evt) {
      if (evt.code === "Enter" || evt.code === "Space") setRedirect(true);
    }

    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (redirect) return <Redirect to="/lobby" />;

  return (
    <Container className={classes.container}>
      <Typography variant="h3" component="h2" gutterBottom>
        Set with Friends
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setRedirect(true)}
      >
        Enter
      </Button>
      <div className={classes.indexMenu}>
        <Link component={RouterLink} to="/help">
          Help
        </Link>
        <Link component={RouterLink} to="/about">
          About
        </Link>
        <Link component={RouterLink} to="/contact">
          Contact
        </Link>
      </div>
    </Container>
  );
}

export default IndexPage;
