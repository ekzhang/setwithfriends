import React, { useState, useEffect } from "react";

import { Link as RouterLink, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { animated, useTransition, config } from "react-spring";

const useStyles = makeStyles({
  indexMenu: {
    margin: 26,
    "& a": {
      margin: 12
    }
  },
  container: {
    padding: 80,
    height: "100%",
    textAlign: "center"
  }
});

function IndexPage() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const transitions = useTransition(!redirect, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff
  });

  useEffect(() => {
    function handleKeyDown(evt) {
      if (evt.code === "Enter" || evt.code === "Space") {
        setRedirect(true);
      }
    }
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return redirect && transitions.length === 1 ? (
    <Redirect to="/lobby" />
  ) : (
    transitions.map(
      ({ item, key, props }) =>
        item && (
          <animated.div key={key} style={props}>
            <Container className={classes.container}>
              <Typography variant="h2" gutterBottom>
                Set with Friends
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setRedirect(true)}
              >
                <Typography>Enter</Typography>
              </Button>
              <Typography variant="subtitle1">
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
              </Typography>
            </Container>
          </animated.div>
        )
    )
  );
}

export default IndexPage;
