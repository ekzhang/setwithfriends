import React, { Component } from "react";
import "./styles.css";
import firebase from "./firebase";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import IndexPage from "./pages/IndexPage";

class App extends Component {
  state = { uid: null };

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        //TODO: catch error
      });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.setState({ uid: user.uid });
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });
  }

  render() {
    if (!this.state.uid) return "Loading...";
    return (
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <IndexPage uid={this.state.uid}></IndexPage>}
          />
          <Route
            path="/:id"
            render={props => <GamePage uid={this.state.uid} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
