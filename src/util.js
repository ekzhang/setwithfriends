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

export const standardLayouts = {
  QWERTY: {
    verticalLayout: "123qweasdzxcrtyfghvbnuiojkl",
    horizontalLayout: "qazwsxedcrfvtgbyhnujmik,ol.",
    orientationChangeKey: ";",
  },
  AZERTY: {
    verticalLayout: '&é"azeqsdwxcrtyfghvbnuiojkl',
    horizontalLayout: "aqwzsxedcrfvtgbyhnuj,ik;ol:",
    orientationChangeKey: "m",
  },
  QWERTZ: {
    verticalLayout: "123qweasdyxcrtzfghvbnuiojkl",
    horizontalLayout: "qaywsxedcrfvtgbzhnujmik,ol.",
    orientationChangeKey: "p",
  },
  Dvorak: {
    verticalLayout: "123',.aoe;qjpyfuidkxbgcrhtn",
    horizontalLayout: "'a;,oq.ejpukyixfdbghmctwrnv",
    orientationChangeKey: "s",
  },
  Colemak: {
    verticalLayout: "123qwfarszxcpgjtdhvbkluynei",
    horizontalLayout: "qazwrxfscptvgdbjhklnmue,yi.",
    orientationChangeKey: "o",
  },
  Workman: {
    verticalLayout: "123qdrashzxmwbjtgycvkfupneo",
    horizontalLayout: "qazdsxrhmwtcbgvjykfnlue,po.",
    orientationChangeKey: "i",
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

export function splitDeck(deck, gameMode = "normal", mnAmt = 12, old) {
  let len = Math.min(deck.length, mnAmt);
  while (len < deck.length && !findSet(deck.slice(0, len), gameMode, old))
    len += 3;
  return [deck.slice(0, len), deck.slice(len)];
}

export function removeCard(deck, c) {
  let i = deck.indexOf(c);
  return [...deck.slice(0, i), ...deck.slice(i + 1)];
}

export function generateName() {
  return "Anonymous " + animals[Math.floor(Math.random() * animals.length)];
}

function isValid(used, cards) {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] === cards[j]) return false;
    }
    if (used[cards[i]]) return false;
  }
  return true;
}

function removeCards(gameState, cards) {
  const { current, used } = gameState;
  let canPreserve = true;
  for (const c of cards) {
    if (current.indexOf(c) >= 12) canPreserve = false;
    used[c] = true;
  }
  if (current.length < gameState.boardSz + cards.length) canPreserve = false;

  if (canPreserve) {
    // Try to preserve card locations, if possible
    const d = current.splice(gameState.boardSz, cards.length);
    for (let i = 0; i < cards.length; i++) {
      current[current.indexOf(cards[i])] = d[i];
    }
  } else {
    // Otherwise, just remove the cards
    for (const card of cards) {
      current.splice(current.indexOf(card), 1);
      gameState.boardSz--;
    }
  }
}

function processValidEvent(gameState, event, cards) {
  const { scores, history } = gameState;
  scores[event.user] = (scores[event.user] || 0) + 1;
  history.push(event);
  removeCards(gameState, cards);
}

function processEventNormal(gameState, event) {
  const { used } = gameState;
  const cards = [event.c1, event.c2, event.c3];
  if (!isValid(used, cards)) return false;
  processValidEvent(gameState, event, cards);
  return true;
}

function processEventChain(gameState, event) {
  const { used, history } = gameState;
  const { c1, c2, c3 } = event;

  let ok = c1 !== c2 && c2 !== c3 && c1 !== c3;
  ok &&= !used[c2] && !used[c3];
  if (history.length) {
    //One card (c1) should be taken from the previous set
    const prevEvent = history[history.length - 1];
    const prev = [prevEvent.c1, prevEvent.c2, prevEvent.c3];
    ok &&= prev.includes(c1);
  }
  if (!ok) return false;

  const cards = history.length === 0 ? [c1, c2, c3] : [c2, c3];
  processValidEvent(gameState, event, cards);
  return true;
}

function processEventUltra(gameState, event) {
  const { used } = gameState;
  const cards = [event.c1, event.c2, event.c3, event.c4];
  if (!isValid(used, cards)) return false;
  processValidEvent(gameState, event, cards);
  return true;
}

export function computeState(gameData, gameMode = "normal", step = -1) {
  const scores = {}; // scores of all users
  const used = {}; // set of cards that have been taken
  const history = []; // list of valid events in time order
  const current = gameData.deck.slice();
  let board, unplayed;
  const gameState = { used, current, scores, history, boardSz: 12 };
  [board, unplayed] = splitDeck(current, gameMode, gameState.boardSz, []);
  gameState.boardSz = board.length;

  if (gameData.events) {
    const events = Object.entries(gameData.events)
      .sort(([k1, e1], [k2, e2]) => {
        return e1.time !== e2.time ? e1.time - e2.time : k1 < k2;
      })
      .map(([_k, e]) => e);
    let idx = 0;
    for (const event of events) {
      if (idx === step) break;

      let isValid;
      if (gameMode === "normal") isValid = processEventNormal(gameState, event);
      if (gameMode === "setchain")
        isValid = processEventChain(gameState, event);
      if (gameMode === "ultraset")
        isValid = processEventUltra(gameState, event);
      if (isValid) {
        idx++;
        const { c1, c2, c3 } = event;

        gameState.boardSz = Math.max(
          12,
          3 * Math.ceil(gameState.boardSz / 3.0)
        );
        [board, unplayed] = splitDeck(current, gameMode, gameState.boardSz, [
          c1,
          c2,
          c3,
        ]);
        gameState.boardSz = board.length;
      }
    }
  }
  return { current, scores, history, board, unplayed };
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
