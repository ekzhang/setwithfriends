import { useContext } from "react";

import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { lightGreen } from "@material-ui/core/colors";
import { animated, useSprings } from "react-spring";
import useSound from "use-sound";

import { generateCards, standardLayouts } from "../util";
import ResponsiveSetCard from "../components/ResponsiveSetCard";
import useDimensions from "../hooks/useDimensions";
import useKeydown from "../hooks/useKeydown";
import useStorage from "../hooks/useStorage";
import { SettingsContext } from "../context";
import layoutSfx from "../assets/layoutChangeSound.mp3";

const gamePadding = 8;
const cardArray = generateCards();

function Game({
  deck,
  boardSize,
  onClick,
  onClear,
  selected,
  gameMode,
  answer,
  lastSet,
}) {
  const [layoutOrientation, setLayoutOrientation] = useStorage(
    "layout",
    "portrait"
  );
  const [cardOrientation, setCardOrientation] = useStorage(
    "orientation",
    "vertical"
  );
  const { keyboardLayout, volume } = useContext(SettingsContext);
  const keyboardLayoutDesc = standardLayouts[keyboardLayout];
  const isHorizontal = cardOrientation === "horizontal";
  const isLandscape = layoutOrientation === "landscape";
  const [gameDimensions, gameEl] = useDimensions();
  const [playLayout] = useSound(layoutSfx);

  let board = deck.slice(0, boardSize);
  const unplayed = deck.slice(boardSize);
  if (gameMode === "setchain") {
    board = [...lastSet, ...board];
  }

  const lineSpacing =
    gameMode === "setchain" && lastSet.length ? 2 * gamePadding : 0;

  // Calculate widths and heights in pixels to fit cards in the game container
  // (The default value for `gameWidth` is a hack since we don't know the
  //  actual dimensions of the game container on initial render)
  const gameWidth = gameDimensions ? gameDimensions.width : 200;
  const numCards = board.length;

  const rows = isLandscape ? 3 : Math.max(Math.ceil(numCards / 3), 4);
  const cols = isLandscape ? Math.max(Math.ceil(numCards / 3), 4) : 3;

  let cardWidth, cardHeight, gameHeight;
  if (!isHorizontal) {
    if (!isLandscape) {
      cardWidth = Math.floor((gameWidth - 2 * gamePadding) / cols);
      cardHeight = Math.round(cardWidth / 1.6);
      gameHeight = cardHeight * rows + 2 * gamePadding + lineSpacing;
    } else {
      cardWidth = Math.floor(
        (gameWidth - 2 * gamePadding - lineSpacing) / cols
      );
      cardHeight = Math.round(cardWidth / 1.6);
      gameHeight = cardHeight * rows + 2 * gamePadding;
    }
  } else {
    if (!isLandscape) {
      cardHeight = Math.floor((gameWidth - 2 * gamePadding) / cols);
      cardWidth = Math.round(cardHeight * 1.6);
      gameHeight = cardWidth * rows + 2 * gamePadding + lineSpacing;
    } else {
      cardHeight = Math.floor(
        (gameWidth - 2 * gamePadding - lineSpacing) / cols
      );
      cardWidth = Math.round(cardHeight * 1.6);
      gameHeight = cardWidth * rows + 2 * gamePadding;
    }
  }

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
    let positionX, positionY;
    let r, c;
    if (!isLandscape) {
      [r, c] = [Math.floor(i / 3), i % 3];
    } else {
      [r, c] = [i % 3, Math.floor(i / 3)];
    }
    if (!isHorizontal) {
      positionX = cardWidth * c + gamePadding;
      positionY = cardHeight * r + gamePadding;
    } else {
      const delta = (cardWidth - cardHeight) / 2; // accounting for rotation
      positionX = cardHeight * c + gamePadding - delta;
      positionY = cardWidth * r + gamePadding + delta;
    }
    if (!isLandscape) {
      positionY = positionY + (i >= 3 ? lineSpacing : 0);
    } else {
      positionX = positionX + (i >= 3 ? lineSpacing : 0);
    }
    cards[board[i]] = {
      positionX,
      positionY,
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

  const rotateAmount = isHorizontal ? "90deg" : "0deg";

  const springProps = useSprings(
    cardArray.length,
    cardArray.map((c) => ({
      to: {
        transform: `translate(${cards[c].positionX}px, ${cards[c].positionY}px) rotate(${rotateAmount})`,
        opacity: cards[c].opacity,
      },
      config: {
        tension: 64,
        friction: 14,
      },
    }))
  );

  // Keyboard shortcuts
  const shortcuts = isLandscape
    ? keyboardLayoutDesc.horizontalLayout
    : keyboardLayoutDesc.verticalLayout;
  useKeydown((event) => {
    const { key } = event;
    if (key === "Escape") {
      event.preventDefault();
      onClear();
    } else if (key.length === 1 && shortcuts.includes(key.toLowerCase())) {
      event.preventDefault();
      const index = shortcuts.indexOf(key.toLowerCase());
      if (index < board.length) {
        onClick(board[index]);
      }
    } else if (key.toLowerCase() === keyboardLayoutDesc.orientationChangeKey) {
      event.preventDefault();
      if (volume === "on") playLayout();
      setCardOrientation(isHorizontal ? "vertical" : "horizontal");
    } else if (key.toLowerCase() === keyboardLayoutDesc.layoutChangeKey) {
      event.preventDefault();
      if (volume === "on") playLayout();
      setLayoutOrientation(isLandscape ? "portrait" : "landscape");
    }
  });

  const lastSetLineStyle = isLandscape
    ? {
        left: `${
          (isHorizontal ? cardHeight : cardWidth) +
          gamePadding +
          lineSpacing / 2
        }px`,
      }
    : {
        top: `${
          (isHorizontal ? cardWidth : cardHeight) +
          gamePadding +
          lineSpacing / 2
        }px`,
      };

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
            isLandscape && lastSet.length
              ? `${gamePadding + (isHorizontal ? cardHeight : cardWidth) / 2}px`
              : 0,
          bottom: gamePadding,
          width: "100%",
        }}
      >
        <strong>{unplayed.length}</strong> cards remaining in the deck
      </Typography>
      {gameMode === "setchain" && lastSet.length ? (
        <Divider
          orientation={isLandscape ? "vertical" : "horizontal"}
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
