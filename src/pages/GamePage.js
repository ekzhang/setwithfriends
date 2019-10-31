import React, { Component } from "react";
import firebase from "../firebase";
import Game from "../components/Game";
import Lobby from "../components/Lobby";
import NormalUserEnter from "../components/NormalUserEnter";
import {
  generateDeck,
  generateColor,
  findCard,
  removeCard,
  checkSet
} from "../util";
import Loading from "../components/Loading";

class GamePage extends Component {
  state = { readFromFB: false, gameInfo: null };

  componentDidMount() {
    var gameInfoRef = firebase.database().ref("/" + this.props.gameId);
    gameInfoRef.on("value", snapshot => {
      this.setState({ gameInfo: snapshot.val(), readFromFB: true });
    });
  }

  enterGame = userName => {
    if (!userName) {
      alert("Please enter a name");
      return;
    }
    let newColor = generateColor();
    var updates = {};
    updates["/userColors/" + this.props.uid] = newColor;
    updates["/userNames/" + this.props.uid] = userName;
    updates["/users/" + this.props.uid] = true;
    firebase
      .database()
      .ref("/" + this.props.gameId + "/meta")
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
      .ref("/" + this.props.gameId)
      .update(updates);
  };

  add3 = () => {
    let { count, deck } = this.state.gameInfo;
    firebase
      .database()
      .ref("/" + this.props.gameId + "/count")
      .set(Math.min(count + 3, deck.length));
  };

  select = card => {
    let gameInfo = this.state.gameInfo;
    let gameId = this.props.gameId;
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
      return <Loading />;
    }
    var { status: gameStatus } = this.state.gameInfo.meta;
    var users = Object.keys(this.state.gameInfo.meta.userNames);
    if (gameStatus === "inGame") {
      if (users.includes(this.props.uid)) {
        return (
          <Game
            uid={this.props.uid}
            gameId={this.props.gameId}
            gameInfo={this.state.gameInfo}
            onSelect={this.select}
            onAdd3={this.add3}
          />
        );
      } else {
        return <div>Game already started</div>;
      }
    } else if (users.includes(this.props.uid)) {
      return (
        <Lobby
          uid={this.props.uid}
          onStartGame={this.startGame}
          gameId={this.props.gameId}
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

export default GamePage;
