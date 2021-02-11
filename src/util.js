import animals from "./utils/animals.json";
import moment from "moment";
import Filter from "bad-words";
import red from "@material-ui/core/colors/red";
import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";
import deepPurple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";
import blue from "@material-ui/core/colors/blue";
import lightBlue from "@material-ui/core/colors/lightBlue";
import cyan from "@material-ui/core/colors/cyan";
import teal from "@material-ui/core/colors/teal";
import green from "@material-ui/core/colors/green";
import lightGreen from "@material-ui/core/colors/lightGreen";
import lime from "@material-ui/core/colors/lime";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";
import deepOrange from "@material-ui/core/colors/deepOrange";

export const filter = new Filter();

// See: https://github.com/ekzhang/setwithfriends/issues/49
filter.removeWords("queer", "queers", "queerz", "qweers", "qweerz", "lesbian");

// See: https://github.com/ekzhang/setwithfriends/issues/71
filter.removeWords("wang");

export const colors = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  amber,
  orange,
  deepOrange,
};

export const modes = {
  normal: {
    name: "Normal",
    color: "purple",
    description: "Find 3 cards that form a Set.",
    setType: "Set",
  },
  setchain: {
    name: "Set-Chain",
    color: "teal",
    description: "In every Set, you have to use 1 card from the previous Set.",
    setType: "Set",
  },
  ultraset: {
    name: "UltraSet",
    color: "pink",
    description:
      "Find 4 cards such that the first pair and the second pair form a Set with the same additional card.",
    setType: "UltraSet",
  },
};

export const standardLayouts = {
  QWERTY: {
    verticalLayout: "123qweasdzxcrtyfghvbnuiojkl",
    horizontalLayout: "qazwsxedcrfvtgbyhnujmik,ol.",
    orientationChangeKey: ";",
    layoutChangeKey: "'",
  },
  AZERTY: {
    verticalLayout: '&é"azeqsdwxcrtyfghvbnuiojkl',
    horizontalLayout: "aqwzsxedcrfvtgbyhnuj,ik;ol:",
    orientationChangeKey: "m",
    layoutChangeKey: "ù",
  },
  QWERTZ: {
    verticalLayout: "123qweasdyxcrtzfghvbnuiojkl",
    horizontalLayout: "qaywsxedcrfvtgbzhnujmik,ol.",
    orientationChangeKey: "p",
    layoutChangeKey: "-",
  },
  Dvorak: {
    verticalLayout: "123',.aoe;qjpyfuidkxbgcrhtn",
    horizontalLayout: "'a;,oq.ejpukyixfdbghmctwrnv",
    orientationChangeKey: "s",
    layoutChangeKey: "-",
  },
  Colemak: {
    verticalLayout: "123qwfarszxcpgjtdhvbkluynei",
    horizontalLayout: "qazwrxfscptvgdbjhklnmue,yi.",
    orientationChangeKey: "o",
    layoutChangeKey: "'",
  },
  Workman: {
    verticalLayout: "123qdrashzxmwbjtgycvkfupneo",
    horizontalLayout: "qazdsxrhmwtcbgvjykfnlue,po.",
    orientationChangeKey: "i",
    layoutChangeKey: "'",
  },
};

export function generateCards() {
  const deck = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push(`${i}${j}${k}${l}`);
        }
      }
    }
  }
  return deck;
}

export function generateColor() {
  const colorsArray = Object.keys(colors);
  return colorsArray[Math.floor(Math.random() * colorsArray.length)];
}

export function checkSet(a, b, c) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

/** Returns the unique card c such that {a, b, c} form a set. */
export function conjugateCard(a, b) {
  const zeroCode = "0".charCodeAt(0);
  let c = "";
  for (let i = 0; i < 4; i++) {
    const sum = a.charCodeAt(i) - zeroCode + b.charCodeAt(i) - zeroCode;
    const lastNum = (3 - (sum % 3)) % 3;
    c += String.fromCharCode(zeroCode + lastNum);
  }
  return c;
}

export function checkSetUltra(a, b, c, d) {
  if (conjugateCard(a, b) === conjugateCard(c, d)) return [a, b, c, d];
  if (conjugateCard(a, c) === conjugateCard(b, d)) return [a, c, b, d];
  if (conjugateCard(a, d) === conjugateCard(b, c)) return [a, d, b, c];
  return null;
}

export function findSet(deck, gameMode = "normal", old) {
  const deckSet = new Set(deck);
  const ultraConjugates = {};
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      const c = conjugateCard(deck[i], deck[j]);
      if (
        gameMode === "normal" ||
        (gameMode === "setchain" && old.length === 0)
      ) {
        if (deckSet.has(c)) {
          return [deck[i], deck[j], c];
        }
      } else if (gameMode === "setchain") {
        if (old.includes(c)) {
          return [c, deck[i], deck[j]];
        }
      } else if (gameMode === "ultraset") {
        if (c in ultraConjugates) {
          return [...ultraConjugates[c], deck[i], deck[j]];
        }
        ultraConjugates[c] = [deck[i], deck[j]];
      }
    }
  }
  return null;
}

export function splitDeck(deck, gameMode = "normal", minBoardSize = 12, old) {
  let len = Math.min(deck.length, minBoardSize);
  while (len < deck.length && !findSet(deck.slice(0, len), gameMode, old))
    len += 3 - (len % 3);
  return [deck.slice(0, len), deck.slice(len)];
}

export function removeCard(deck, c) {
  let i = deck.indexOf(c);
  return [...deck.slice(0, i), ...deck.slice(i + 1)];
}

export function generateName() {
  return "Anonymous " + animals[Math.floor(Math.random() * animals.length)];
}

function hasDuplicates(used, cards) {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] === cards[j]) return true;
    }
    if (used[cards[i]]) return true;
  }
  return false;
}

function removeCards(internalGameState, cards) {
  const { current, used } = internalGameState;
  let canPreserve = true;
  for (const c of cards) {
    if (current.indexOf(c) >= 12) canPreserve = false;
    used[c] = true;
  }
  if (current.length < 12 + cards.length) canPreserve = false;

  if (canPreserve) {
    // Try to preserve card locations, if possible
    const d = current.splice(12, cards.length);
    for (let i = 0; i < cards.length; i++) {
      current[current.indexOf(cards[i])] = d[i];
    }
  } else {
    // Otherwise, just remove the cards
    for (const card of cards) {
      current.splice(current.indexOf(card), 1);
    }
  }
}

function processValidEvent(internalGameState, event, cards) {
  const { scores, history } = internalGameState;
  scores[event.user] = (scores[event.user] || 0) + 1;
  history.push(event);
  removeCards(internalGameState, cards);
}

function processEventNormal(internalGameState, event) {
  const { current, used } = internalGameState;
  const cards = [event.c1, event.c2, event.c3];
  if (hasDuplicates(used, cards)) return;
  processValidEvent(internalGameState, event, cards);

  const minSize = Math.max(internalGameState.boardSize - 3, 12);
  const boardSize = splitDeck(current, "normal", minSize)[0].length;
  internalGameState.boardSize = boardSize;
}

function processEventChain(internalGameState, event) {
  const { used, history, current } = internalGameState;
  const { c1, c2, c3 } = event;

  let ok = c1 !== c2 && c2 !== c3 && c1 !== c3 && !used[c2] && !used[c3];
  if (history.length) {
    // One card (c1) should be taken from the previous set
    let prev = history[history.length - 1];
    ok &&= [prev.c1, prev.c2, prev.c3].includes(c1);
  } else {
    ok &&= !used[c1];
  }
  if (!ok) return;

  const cards = history.length === 0 ? [c1, c2, c3] : [c2, c3];
  processValidEvent(internalGameState, event, cards);

  const minSize = Math.max(internalGameState.boardSize - cards.length, 12);
  const old = [c1, c2, c3];
  const boardSize = splitDeck(current, "setchain", minSize, old)[0].length;
  internalGameState.boardSize = boardSize;
}

function processEventUltra(internalGameState, event) {
  const { used, current } = internalGameState;
  const cards = [event.c1, event.c2, event.c3, event.c4];
  if (hasDuplicates(used, cards)) return;
  processValidEvent(internalGameState, event, cards);

  const minSize = Math.max(internalGameState.boardSize - 4, 12);
  const boardSize = splitDeck(current, "ultraset", minSize)[0].length;
  internalGameState.boardSize = boardSize;
}

export function computeState(gameData, gameMode = "normal") {
  const scores = {}; // scores of all users
  const used = {}; // set of cards that have been taken
  const history = []; // list of valid events in time order
  const current = gameData.deck.slice(); // remaining cards in the game
  const internalGameState = {
    used,
    current,
    scores,
    history,
    // Initial deck split
    boardSize: splitDeck(current, gameMode, 12, [])[0].length,
  };

  if (gameData.events) {
    const events = Object.entries(gameData.events)
      .sort(([k1, e1], [k2, e2]) => {
        return e1.time !== e2.time ? e1.time - e2.time : k1 < k2;
      })
      .map(([_k, e]) => e);
    for (const event of events) {
      if (gameMode === "normal") processEventNormal(internalGameState, event);
      if (gameMode === "setchain") processEventChain(internalGameState, event);
      if (gameMode === "ultraset") processEventUltra(internalGameState, event);
    }
  }

  return { current, scores, history, boardSize: internalGameState.boardSize };
}

export function formatTime(t, hideSubsecond) {
  t = Math.max(t, 0);
  const hours = Math.floor(t / (3600 * 1000));
  const rest = t % (3600 * 1000);
  const format = hideSubsecond ? "mm:ss" : "mm:ss.SS";
  return (hours ? `${hours}:` : "") + moment(rest).format(format);
}

/** Returns true if a game actually has hints enabled. */
export function hasHint(game) {
  return (
    game.enableHint &&
    game.users &&
    Object.keys(game.users).length === 1 &&
    game.access === "private" &&
    (game.mode || "normal") === "normal"
  );
}
