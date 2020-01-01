import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import "./styles.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";
import LoadingPage from "./pages/LoadingPage";
import IndexPage from "./pages/IndexPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        alert("Unable to connect to server. Please try again later.")
      });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setUid(user.uid);
      } else {
        // User is signed out.
        setUid(null);
      }
    });
  });

  return (
    <>
      <CssBaseline />
      {!uid ?
        <LoadingPage /> :
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              component={IndexPage}
            />
            <Route
              path="/lobby"
              render={() => <LobbyPage uid={uid}></LobbyPage>}
            />
            <Route
              path="/game/:id"
              render={({ match }) => <GamePage uid={uid} gameId={match.params.id} />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      }
    </>
  );
}

export default App;
