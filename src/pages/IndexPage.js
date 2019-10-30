import React, { Component } from "react";
import firebase from "../firebase";
import { generateColor } from "../util";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router";

class CreateGamePage extends Component {
  state = { value: "", redirect: null };

  handleChangeName = event => {
    this.setState({ value: event.target.value });
  };

  createGame = async evt => {
    evt.preventDefault();
    if (!this.state.value) {
      alert("Please enter a name");
      return;
    }
    const snapshot = await firebase
      .database()
      .ref("/")
      .once("value");

    let newGameId =
      snapshot.val() == null ? 0 : Object.keys(snapshot.val()).length;
    let newColor = generateColor([]);
    let uid = this.props.uid;

    firebase
      .database()
      .ref("/" + newGameId)
      .set({
        meta: {
          status: "lobby",
          admin: this.props.uid,
          userColors: {
            [uid]: newColor
          },
          userNames: {
            [uid]: this.state.value
          },
          usedColors: JSON.stringify([newColor]),
          users: {
            [uid]: "hey"
          }
        },
        freeze: {
          freeze: false
        }
      });

    this.setState({ redirect: `/${newGameId}` });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    return (
      <div>
        You are user: {this.props.uid}
        <form onSubmit={this.createGame}>
          <label htmlFor="fname">Name</label>
          <input
            type="text"
            name="firstname"
            value={this.state.value}
            onChange={this.handleChangeName}
            required
          ></input>

          <input
            type="submit"
            value="Create Game"
            className="startGameButton"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(CreateGamePage);
