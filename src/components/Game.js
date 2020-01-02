import React, { useEffect, useState } from "react";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Motion, spring } from "react-motion";

import { removeCard, checkSet, splitDeck, findSet } from "../util";
import SetCard from "../components/SetCard";

const useStyles = makeStyles({
  gameContainer: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      position: "absolute"
    }
  }
});

function Game({ game, spectating, onSet }) {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [game]);

  const cardWidth = 172,
    cardHeight = 112;

  const cards = {};
  if (game.history) {
    for (const event of Object.values(game.history)) {
      const { user, cards: set } = event;
      for (const c of set) {
        cards[c] = {
          positionX: 2.5 * cardWidth,
          positionY: 0,
          opacity: 0,
          color: game.meta.users[user].color,
          active: false
        };
      }
    }
  }
  const [board, deck] = splitDeck(game.deck);
  const rows = board.length / 3;
  for (let i = 0; i < board.length; i++) {
    const r = Math.floor(i / 3),
      c = i % 3;
    cards[board[i]] = {
      positionX: (c - 1) * cardWidth,
      positionY: (r - (rows - 1) / 2) * cardHeight,
      opacity: 1,
      active: true
    };
  }
  for (const c of deck) {
    cards[c] = {
      positionX: -2.5 * cardWidth,
      positionY: 0,
      opacity: 0,
      active: false
    };
  }

  const springConfig = {
    stiffness: 64,
    damping: 14
  };

  function handleClick(card) {
    if (spectating) return;
    if (selected.includes(card)) {
      setSelected(removeCard(selected, card));
    } else {
      const vals = [...selected, card];
      if (vals.length === 3) {
        if (checkSet(...vals)) {
          onSet(vals);
        } else {
          alert("Not a set!");
        }
        setSelected([]);
      } else {
        setSelected(vals);
      }
    }
  }

  function cheat() {
    onSet(findSet(board));
  }

  return (
    <div className={classes.gameContainer}>
      <div
        style={{
          transform: `translate(${-2 * cardWidth}px, ${0}px)`
        }}
      >
        <Paper elevation={2} style={{ padding: 16 }}>
          <Typography variant="h3">{deck.length}</Typography>
        </Paper>
      </div>
      {Object.entries(cards).map(([card, pos]) => (
        <Motion
          key={card}
          defaultStyle={{ x: -cardWidth * 2.5, y: 0, opacity: 0 }}
          style={{
            x: spring(pos.positionX, springConfig),
            y: spring(pos.positionY, springConfig),
            opacity: spring(pos.opacity, springConfig)
          }}
        >
          {style => (
            <div
              style={{
                transform: `translate(${style.x}px, ${style.y}px)`,
                opacity: style.opacity,
                visibility: style.opacity > 0 ? "visible" : "hidden"
              }}
            >
              <SetCard
                value={card}
                color={pos.color}
                selected={selected.includes(card)}
                onClick={pos.active ? () => handleClick(card) : null}
              />
            </div>
          )}
        </Motion>
      ))}
      {spectating && (
        <div
          style={{
            transform: `translate(${0}px, ${-(rows / 2) * cardHeight - 24}px)`
          }}
        >
          <Paper>
            <Typography variant="h6">(Spectating...)</Typography>
          </Paper>
        </div>
      )}
      <button style={{ display: "none" }} onClick={cheat}>
        Cheat
      </button>
    </div>
  );
}

export default Game;
