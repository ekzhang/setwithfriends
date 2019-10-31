import React, { Component } from "react";
import firebase from "./firebase";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import IndexPage from "./pages/IndexPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";
import Loading from "./components/Loading";

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
        this.setState({ uid: null});
      }
    });
  }

  render() {
    if (!this.state.uid) return <Loading />;
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
            render={({ match }) => <GamePage uid={this.state.uid} gameId={match.params.id} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
