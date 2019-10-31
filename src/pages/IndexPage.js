import React, { Component } from "react";
import firebase from "../firebase";
import { generateColor } from "../util";

import { Redirect } from "react-router";
import { Form, InputGroup, FormControl, Container, Button } from 'react-bootstrap';
import generate from 'project-name-generator';

class IndexPage extends Component {
  state = { value: "", redirect: null };

  handleChangeName = event => {
    this.setState({ value: event.target.value });
  };

  createGame = evt => {
    evt.preventDefault();
    if (!this.state.value) {
      alert("Please enter a name");
      return;
    }

    const newGameId = generate({ number: true }).dashed;

    let newColor = generateColor();
    let uid = this.props.uid;

    firebase
      .database()
      .ref("/" + newGameId)
      .set({
        meta: {
          status: "lobby",
          admin: uid,
          userColors: {
            [uid]: newColor
          },
          userNames: {
            [uid]: this.state.value
          },
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
      <Container>
        <h1>Realtime Set</h1>
        {/* You are user: {this.props.uid} */}
        <Form onSubmit={this.createGame}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              value={this.state.value}
              onChange={this.handleChangeName}
              required
            />
          </InputGroup>
          <Button type="submit">Create Game</Button>
        </Form>
      </Container>
    );
  }
}

export default IndexPage;
