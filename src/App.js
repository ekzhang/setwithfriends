import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import "./styles.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import RoomPage from "./pages/RoomPage";
import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";
import LoadingPage from "./pages/LoadingPage";
import IndexPage from "./pages/IndexPage";
import NotFoundPage from "./pages/NotFoundPage";
import { generateColor, generateName } from "./util";

function App() {
  const [uid, setUid] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!uid) {
      firebase
        .auth()
        .signInAnonymously()
        .catch(error => {
          alert("Unable to connect to the server. Please try again later.");
        });
    }
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setUid(user.uid);
      } else {
        // User is signed out.
        setUid(null);
      }
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      return;
    }
    const userRef = firebase.database().ref(`/users/${uid}`);
    function update(snapshot) {
      if (snapshot.exists()) {
        setUser({ ...snapshot.val(), id: uid });
      } else {
        userRef.set({
          games: {},
          color: generateColor(),
          name: generateName()
        });
      }
    }
    userRef.on("value", update);
    return () => {
      userRef.off("value", update);
    };
  }, [uid]);

  return (
    <>
      <CssBaseline />
      {!user ? (
        <LoadingPage />
      ) : (
        <Router>
          <Switch>
            <Route path="/" exact component={IndexPage} />
            <Route
              path="/lobby"
              render={() => <LobbyPage user={user}></LobbyPage>}
            />
            <Route
              path="/room/:id"
              render={({ match }) => (
                <RoomPage user={user} gameId={match.params.id} />
              )}
            />
            <Route
              path="/game/:id"
              render={({ match }) => (
                <GamePage user={user} gameId={match.params.id} />
              )}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
