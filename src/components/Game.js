import React, { useEffect, useState } from "react";

import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { animated, useSprings } from "react-spring";

import { generateCards, removeCard, checkSet, splitDeck } from "../util";
import ResponsiveSetCard from "../components/ResponsiveSetCard";
import SnackContent from "./SnackContent";
import useDimensions from "../hooks/useDimensions";

const gamePadding = 8;
const cardArray = generateCards();

function Game({ deck, spectating, onSet }) {
  const [gameDimensions, gameEl] = useDimensions();
  const [selected, setSelected] = useState([]);
  const [snack, setSnack] = useState({ open: false });

  // Reset card selection on update to game
  useEffect(() => {
    setSelected([]);
  }, [deck]);

  // Calculate widths and heights in pixels to fit cards in the game container
  // (The default value for `gameWidth` is a hack since we don't know the
  //  actual dimensions of the game container on initial render)
  const gameWidth = gameDimensions ? gameDimensions.width : 200;
  const cardWidth = Math.floor((gameWidth - 2 * gamePadding) / 3);
  const cardHeight = Math.round(cardWidth / 1.6);

  const [board, unplayed] = splitDeck(deck);
  const rows = board.length / 3;
  const gameHeight = cardHeight * rows + 2 * gamePadding;

  // Compute coordinate positions of each card, in and out of play
  const cards = {};
  for (const c of cardArray) {
    cards[c] = {
      positionX: gameWidth,
      positionY: gameHeight / 2 - cardHeight / 2,
      opacity: 0,
      background: "#90ee90",
      inplay: false,
    };
  }
  for (let i = 0; i < board.length; i++) {
    const r = Math.floor(i / 3),
      c = i % 3;
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

  function handleClick(card) {
    if (spectating) {
      setSnack({
        open: true,
        variant: "warning",
        message: "You are spectating!",
      });
      return;
    }
    setSelected((selected) => {
      if (selected.includes(card)) {
        return removeCard(selected, card);
      } else {
        const vals = [...selected, card];
        if (vals.length === 3) {
          if (checkSet(...vals)) {
            onSet(vals);
            setSnack({
              open: true,
              variant: "success",
              message: "Found a set!",
            });
          } else {
            setSnack({
              open: true,
              variant: "error",
              message: "Not a set!",
            });
          }
          return [];
        } else {
          return vals;
        }
      }
    });
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") return;
    setSnack({ ...snack, open: false });
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snack.open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackContent
          variant={snack.variant || "info"}
          message={snack.message || ""}
          onClose={handleClose}
        />
      </Snackbar>
      <Paper
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: gameHeight + 19,
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
              onClick={cards[card].inplay ? () => handleClick(card) : null}
            />
          </animated.div>
        ))}
      </Paper>
    </>
  );
}

export default Game;
