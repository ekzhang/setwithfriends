import React, { Component } from "react";

class NormalUserEnter extends Component {
  state = { value: "" };

  handleChangeName = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onEnter(this.state.value);
  };

  render() {
    return (
      <div>
        Normal User Enter
        <div>Your username: {this.props.uid}</div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="fname">Name</label>
          <input
            id="fname"
            type="text"
            name="firstname"
            value={this.state.value}
            onChange={this.handleChangeName}
            required
          ></input>
          <input type="submit" class="enterGameButton" value="Enter game" />
        </form>
      </div>
    );
  }
}

export default NormalUserEnter;
