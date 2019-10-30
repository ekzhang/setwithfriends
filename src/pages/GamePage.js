import React, { Component } from "react";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";
import SetGame from "../components/InGamePage";
import Lobby from "../components/LobbyPage";
import NormalUserEnter from "../components/NormalUserEnter";
import {
  generateDeck,
  generateColor,
  findCard,
  removeCard,
  checkSet
} from "../util";

class GamePage extends Component {
  state = { readFromFB: false, gameInfo: null };

  componentDidMount() {
    var gameInfoRef = firebase.database().ref("/" + this.props.match.params.id);
    gameInfoRef.on("value", snapshot => {
      this.setState({ gameInfo: snapshot.val(), readFromFB: true });
    });
  }

  enterGame = userName => {
    if (!userName) {
      alert("Please enter a name");
      return;
    }
    let gameInfo = this.state.gameInfo;
    let usedColorsCopy = JSON.parse(gameInfo.meta.usedColors);
    let newColor = generateColor(usedColorsCopy);
    usedColorsCopy.push(newColor);
    var updates = {};
    updates["/userColors/" + this.props.uid] = newColor;
    updates["/userNames/" + this.props.uid] = userName;
    updates["/usedColors/"] = JSON.stringify(usedColorsCopy);
    updates["/users/" + this.props.uid] = "hey";
    firebase
      .database()
      .ref("/" + this.props.match.params.id + "/meta")
      .update(updates);
  };

  startGame = () => {
    var updates = {};
    updates["/meta/status"] = "inGame";
    updates["/deck/"] = generateDeck();
    updates["/count/"] = 12;
    for (let x in this.state.gameInfo.meta.userNames) {
      updates["/cards/" + x] = JSON.stringify([]);
      updates["/scores/" + x] = 0;
    }
    firebase
      .database()
      .ref("/" + this.props.match.params.id)
      .update(updates);
  };

  add3 = () => {
    let { count, deck } = this.state.gameInfo;
    firebase
      .database()
      .ref("/" + this.props.match.params.id + "/count")
      .set(Math.min(count + 3, deck.length));
  };

  select = card => {
    let gameInfo = this.state.gameInfo;
    let gameId = this.props.match.params.id;
    let { deck: deckF, count: countF } = this.state.gameInfo;
    let currentScore = gameInfo.scores[this.props.uid];
    let currentColor = gameInfo.meta.userColors[this.props.uid];
    let sF = JSON.parse(gameInfo.cards[this.props.uid]);
    if (findCard(sF, card) !== -1) {
      sF = removeCard(sF, card);
    } else {
      sF = [...sF, card];
    }
    if (sF.length === 3) {
      // Check for sets
      if (checkSet(...sF)) {
        deckF = removeCard(deckF, sF[0]);
        deckF = removeCard(deckF, sF[1]);
        deckF = removeCard(deckF, sF[2]);
        countF = Math.max(countF - 3, 12);
        firebase
          .database()
          .ref("/" + gameId + "/scores/" + this.props.uid)
          .set(parseInt(currentScore) + 3);
        firebase
          .database()
          .ref("/" + gameId + "/freeze/")
          .set({
            freeze: true,
            uid: this.props.uid,
            goodCards: sF,
            color: currentColor
          })
          .then(
            setTimeout(() => {
              for (let x in gameInfo.cards) {
                firebase
                  .database()
                  .ref("/" + gameId + "/cards/" + x)
                  .set(JSON.stringify([]));
              }
              var updates = {};
              updates["/deck/"] = deckF;
              updates["/count/"] = countF;
              updates["/freeze/"] = { freeze: false, goodCards: [] };
              firebase
                .database()
                .ref("/" + gameId + "/")
                .update(updates);
            }, 3000)
          );
      } else {
        alert("Not a set!");
      }
      sF = [];
    }
    firebase
      .database()
      .ref("/" + gameId + "/cards/" + this.props.uid)
      .set(JSON.stringify(sF));
    this.setState({ selected: sF });
  };

  render() {
    if (!this.state.readFromFB) {
      return <div>Loading...</div>;
    }
    var { status: gameStatus } = this.state.gameInfo.meta;
    var users = Object.keys(this.state.gameInfo.meta.userNames);
    if (gameStatus === "inGame") {
      if (users.includes(this.props.uid)) {
        return (
          <SetGame
            uid={this.props.uid}
            gameId={this.props.match.params.id}
            gameInfo={this.state.gameInfo}
            onSelect={this.select}
            onAdd3={this.add3}
          ></SetGame>
        );
      } else {
        return <div>Game already started</div>;
      }
    } else if (users.includes(this.props.uid)) {
      return (
        <Lobby
          uid={this.props.uid}
          onStartGame={this.startGame}
          gameId={this.props.match.params.id}
          gameInfo={this.state.gameInfo}
        />
      );
    } else {
      return (
        <NormalUserEnter
          uid={this.props.uid}
          onEnter={this.enterGame}
          gameInfo={this.state.gameInfo}
        />
      );
    }
  }
}

export default withRouter(GamePage);
