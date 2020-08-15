import React from "react";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { lightGreen } from "@material-ui/core/colors";
import { animated, useSprings } from "react-spring";

import { generateCards, splitDeck } from "../util";
import ResponsiveSetCard from "../components/ResponsiveSetCard";
import useDimensions from "../hooks/useDimensions";
import useKeydown from "../hooks/useKeydown";
import useStorage from "../hooks/useStorage";

const gamePadding = 8;
const cardArray = generateCards();

function Game({ deck, onClick, onClear, selected }) {
  const [layout, setLayout] = useStorage("layout", "vertical");
  const isHorizontal = layout === "horizontal";
  const [gameDimensions, gameEl] = useDimensions();
  const [board, unplayed] = splitDeck(deck);

  // Calculate widths and heights in pixels to fit cards in the game container
  // (The default value for `gameWidth` is a hack since we don't know the
  //  actual dimensions of the game container on initial render)
  const gameWidth = gameDimensions ? gameDimensions.width : 200;
  const numCards = board.length;
  const rows = isHorizontal ? 3 : Math.max(numCards / 3, 4);
  const cols = isHorizontal ? Math.max(numCards / 3, 4) : 3;
  const cardWidth = Math.floor((gameWidth - 2 * gamePadding) / cols);
  const cardHeight = Math.round(cardWidth / 1.6);

  const gameHeight = cardHeight * rows + 2 * gamePadding;

  // Compute coordinate positions of each card, in and out of play
  const cards = {};
  for (const c of cardArray) {
    cards[c] = {
      positionX: gameWidth,
      positionY: gameHeight / 2 - cardHeight / 2,
      opacity: 0,
      background: lightGreen[100],
      inplay: false,
    };
  }
  for (let i = 0; i < board.length; i++) {
    const [r, c] = isHorizontal
      ? [i % 3, Math.floor(i / 3)]
      : [Math.floor(i / 3), i % 3];
    cards[board[i]] = {
      positionX: cardWidth * c + gamePadding,
      positionY: cardHeight * r + gamePadding,
      opacity: 1,
      inplay: true,
    };
  }
  for (const c of unplayed) {
    cards[c] = {
      positionX: -cardWidth,
      positionY: gameHeight / 2 - cardHeight / 2,
      opacity: 0,
      inplay: false,
    };
  }

  const springProps = useSprings(
    cardArray.length,
    cardArray.map((c) => ({
      to: {
        transform: `translate(${cards[c].positionX}px, ${cards[c].positionY}px)`,
        opacity: cards[c].opacity,
      },
      config: {
        tension: 64,
        friction: 14,
      },
    }))
  );

  // Keyboard shortcuts
  const verticalShortcuts = "123qweasdzxcrtyfghvbn";
  const horizontalShortcuts = "qazwsxedcrfvtgbyhnujm";
  const shortcuts = isHorizontal ? horizontalShortcuts : verticalShortcuts;
  useKeydown(({ key }) => {
    if (key === "Escape") {
      onClear();
    } else if (key.length === 1 && shortcuts.includes(key.toLowerCase())) {
      const index = shortcuts.indexOf(key.toLowerCase());
      if (index < board.length) {
        onClick(board[index]);
      }
    } else if (key === ";") {
      setLayout(isHorizontal ? "vertical" : "horizontal");
    }
  });

  return (
    <Paper
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: gameHeight + 19,
        transition: "height 0.75s",
      }}
      ref={gameEl}
    >
      <Typography
        variant="caption"
        align="center"
        style={{
          position: "absolute",
          bottom: gamePadding,
          width: "100%",
        }}
      >
        <strong>{unplayed.length}</strong> cards remaining in the deck
      </Typography>
      {cardArray.map((card, idx) => (
        <animated.div
          key={card}
          style={{
            position: "absolute",
            ...springProps[idx],
            visibility: springProps[idx].opacity.interpolate((x) =>
              x > 0 ? "visible" : "hidden"
            ),
          }}
        >
          <ResponsiveSetCard
            value={card}
            width={cardWidth}
            background={cards[card].background}
            active={selected.includes(card)}
            onClick={cards[card].inplay ? () => onClick(card) : null}
          />
        </animated.div>
      ))}
    </Paper>
  );
}

export default Game;
