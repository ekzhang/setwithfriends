import React, { useEffect, useState } from "react";

import Box from "@material-ui/core/Box";
import { Motion, spring } from "react-motion";

import { removeCard, checkSet, splitDeck } from "../util";
import SetCard from "../components/SetCard";

function Game({ game, onSet }) {
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
          positionX: cardWidth * 2.5,
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
      positionX: -cardWidth * 2.5,
      positionY: 0,
      opacity: 0,
      active: false
    };
  }

  const springConfig = {
    stiffness: 50,
    damping: 12
  };

  function handleClick(card) {
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

  return (
    <>
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
            <Box
              position="absolute"
              style={{
                transform: `translate(${style.x}px, ${style.y}px)`,
                opacity: style.opacity
              }}
            >
              <SetCard
                value={card}
                color={pos.color}
                selected={selected.includes(card)}
                onClick={pos.active ? () => handleClick(card) : null}
              />
            </Box>
          )}
        </Motion>
      ))}
    </>
  );
}

export default Game;
