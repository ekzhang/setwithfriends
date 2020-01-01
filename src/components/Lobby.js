import React, { Component } from "react";

class Lobby extends Component {
  render() {
    var admin = this.props.gameInfo.meta.admin;
    var userNames = this.props.gameInfo.meta.userNames;
    var colors = this.props.gameInfo.meta.userColors;
    var users = Object.keys(this.props.gameInfo.meta.userNames);

    var gameId = this.props.gameId;
    return (
      <div>
        You are user:{" "}
        <div
          style={{
            display: " inline",
            backgroundColor: `${colors[this.props.uid]}`
          }}
        >
          {userNames[this.props.uid]}
        </div>{" "}
        <p>Status: {admin === this.props.uid ? "admin" : "normal user"}</p>
        <p>Lobby: {gameId}</p>
        <p>Current users:</p>
        <div>
          {users.map(user => (
            <div key={user}>
              <div
                style={{
                  display: " inline",
                  backgroundColor: `${colors[user]}`
                }}
              >
                {userNames[user]}
              </div>
            </div>
          ))}
        </div>
        {admin === this.props.uid && (
          <button onClick={this.props.onStartGame}>Start game</button>
        )}
      </div>
    );
  }
}

export default Lobby;
