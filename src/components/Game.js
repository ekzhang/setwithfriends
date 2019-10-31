import React, { Component } from "react";
import Card from "./Card";
import { findCard, trim } from "../util";
import { Button } from "react-bootstrap";

class Game extends Component {
  render() {
    var colors = this.props.gameInfo.meta.userColors;
    var userNames = this.props.gameInfo.meta.userNames;

    var { deck, count, scores, freeze } = this.props.gameInfo;
    var selected = JSON.parse(this.props.gameInfo.cards[this.props.uid]);
    const cards = deck.slice(0, count);
    return (
      <div className="pt-3">
        {scores && (
          <div className="scoreboard">
            <h5>Scoreboard</h5>
            <ul className="list-unstyled">
              {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([uid, score]) => (
                <li>
                  <span className="color-block mr-1" style={{ background: colors[uid] }}></span>
                  <span className="font-weight-bold">{trim(userNames[uid], 20)}{this.props.uid === uid && " (You)"}</span>
                  {": "}
                  <span>{score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h1>Set Game</h1>
        <p>
          <b>Remaining cards:</b> {deck.length}
        </p>

        <div className="card-container">
          {cards.map((c, i) => (
            <Card
              value={c}
              key={i}
              freeze={freeze ? freeze.freeze : false}
              freezeColor={
                freeze && freeze.goodCards
                  ? findCard(freeze.goodCards, c) !== -1
                    ? freeze.color
                    : ""
                  : "#fff"
              }
              selected={findCard(selected, c) !== -1}
              onClick={() => this.props.onSelect(c)}
            />
          ))}
        </div>
        <div className="m-3">
          <Button variant="outline-secondary" onClick={this.props.onAdd3}>Add 3</Button>
        </div>
      </div>
    );
  }
}

export default Game;
