import React, { Component } from "react";

class NormalUserEnter extends Component {
  state = { value: "" };

  handleChangeName = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div>
        Normal User Enter
        <div>Your username: {this.props.uid}</div>
        <form>
          <label htmlFor="fname">Name</label>
          <input
            type="text"
            name="firstname"
            value={this.state.value}
            onChange={this.handleChangeName}
            required
          ></input>
        </form>
        <div
          className="enterGameButton"
          onClick={() => this.props.onEnter(this.state.value)}
        >
          Enter game
        </div>
      </div>
    );
  }
}

export default NormalUserEnter;
