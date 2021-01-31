import { useContext } from "react";

import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { lightGreen } from "@material-ui/core/colors";
import { animated, useSprings } from "react-spring";

import { generateCards, splitDeck, standardLayouts } from "../util";
import ResponsiveSetCard from "../components/ResponsiveSetCard";
import useDimensions from "../hooks/useDimensions";
import useKeydown from "../hooks/useKeydown";
import useStorage from "../hooks/useStorage";
import { KeyboardContext } from "../context";

const gamePadding = 8;
const cardArray = generateCards();

function Game({ deck, onClick, onClear, selected, gameMode, answer, lastSet }) {
  const [layoutOrientation, setLayoutOrientation] = useStorage(
    "layout",
    "vertical"
  );
  const keyboardLayout = standardLayouts[useContext(KeyboardContext)[0]];
  const isHorizontal = layoutOrientation === "horizontal";
  const [gameDimensions, gameEl] = useDimensions();
  const [board, unplayed] = splitDeck(deck, gameMode, lastSet);
  if (gameMode === "setchain") {
    board.splice(0, 0, ...lastSet);
  }

  const lineSpacing =
    gameMode === "setchain" && lastSet.length ? 2 * gamePadding : 0;

  // Calculate widths and heights in pixels to fit cards in the game container
  // (The default value for `gameWidth` is a hack since we don't know the
  //  actual dimensions of the game container on initial render)
  const gameWidth = gameDimensions ? gameDimensions.width : 200;
  const numCards = board.length;

  const rows = isHorizontal ? 3 : Math.max(Math.ceil(numCards / 3), 4);
  const cols = isHorizontal ? Math.max(Math.ceil(numCards / 3), 4) : 3;
  const cardWidth = Math.floor(
    (gameWidth - 2 * gamePadding - (isHorizontal ? lineSpacing : 0)) / cols
  );
  const cardHeight = !isHorizontal
    ? Math.round(cardWidth / 1.6)
    : Math.round(cardWidth / 1);

  const gameHeight = !isHorizontal
    ? cardHeight * rows + 2 * gamePadding + (!isHorizontal ? lineSpacing : 0)
    : cardHeight * rows + 8 * gamePadding;

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
      positionX:
        cardWidth * c +
        gamePadding +
        (isHorizontal && i >= 3 ? lineSpacing : 0),
      positionY:
        cardHeight * r +
        gamePadding +
        (!isHorizontal && i >= 3 ? lineSpacing : 0),
      background:
        answer && answer.includes(board[i])
          ? "rgba(0, 0, 255, 0.15)"
          : "initial",
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
  const shortcuts = isHorizontal
    ? keyboardLayout.horizontalLayout
    : keyboardLayout.verticalLayout;
  useKeydown(({ key }) => {
    if (key === "Escape") {
      onClear();
    } else if (key.length === 1 && shortcuts.includes(key.toLowerCase())) {
      const index = shortcuts.indexOf(key.toLowerCase());
      if (index < board.length) {
        onClick(board[index]);
      }
    } else if (key === keyboardLayout.orientationChangeKey) {
      setLayoutOrientation(isHorizontal ? "vertical" : "horizontal");
    }
  });

  const lastSetLineStyle = isHorizontal
    ? { left: `${cardWidth + gamePadding + lineSpacing / 2}px` }
    : { top: `${cardHeight + gamePadding + lineSpacing / 2}px` };

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
          left:
            isHorizontal && lastSet.length
              ? `${gamePadding + cardWidth / 2}px`
              : 0,
          bottom: gamePadding,
          width: "100%",
        }}
      >
        <strong>{unplayed.length}</strong> cards remaining in the deck
      </Typography>
      {gameMode === "setchain" && lastSet.length ? (
        <Divider
          orientation={isHorizontal ? "vertical" : "horizontal"}
          variant="fullWidth"
          absolute={true}
          style={lastSetLineStyle}
        />
      ) : null}
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
            isHorizontal={isHorizontal}
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
