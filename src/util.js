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
    verticalLayout: "123qweasdzxcrtyfghvbn",
    horizontalLayout: "qazwsxedcrfvtgbyhnujm",
    orientationChangeKey: ";",
  },
  AZERTY: {
    verticalLayout: '1é"azeqsdwxcrtyfghvbn',
    horizontalLayout: "aqwzsxedcrfvtgbyhnuj;",
    orientationChangeKey: "m",
  },
  QWERTZ: {
    verticalLayout: "123qweasdyxcrtzfghvbn",
    horizontalLayout: "qaywsxedcrfvtgbzhnujm",
    orientationChangeKey: "p",
  },
  Dvorak: {
    verticalLayout: "123',.aoe;qjpyfuidkxb",
    horizontalLayout: "'a;,oq.ejpukyixfdbghm",
    orientationChangeKey: "s",
  },
  Colemak: {
    verticalLayout: "123qwfarszxcpgjtdhvbk",
    horizontalLayout: "qazwrxfscptvgdbjhklnm",
    orientationChangeKey: "o",
  },
  Workman: {
    verticalLayout: "123qdrashzxmwbjtgycvk",
    horizontalLayout: "qazdsxrhmwtcbgvjykfnl",
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

export function checkSetUltra(a, b, c, d) {
  for (let i = 1; i < 4; i++) {
    let ok = true;
    for (let j = 0; j < 4; j++) {
      let mod = [0, 0];
      for (let k = 0; k < 4; k++) {
        if (k === 0 || k === i) mod[0] += arguments[k].charCodeAt(j);
        else mod[1] += arguments[k].charCodeAt(j);
      }
      if (mod[0] % 3 !== mod[1] % 3) ok = false;
    }
    if (ok) {
      let ret = [a, arguments[i]];
      for (let j = 1; j < 4; j++) {
        if (j !== i) ret.push(arguments[j]);
      }
      return ret;
    }
  }
  return null;
}

export function findSet(deck, gameMode = "normal", old = []) {
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      if (gameMode === "setchain") {
        for (let k = 0; k < old.length; k++) {
          if (checkSet(deck[i], deck[j], old[k])) {
            return [old[k], deck[i], deck[j]];
          }
        }
      }
      for (let k = j + 1; k < deck.length; k++) {
        if (
          gameMode === "normal" ||
          (gameMode === "setchain" && old.length === 0)
        ) {
          if (checkSet(deck[i], deck[j], deck[k])) {
            return [deck[i], deck[j], deck[k]];
          }
          continue;
        }
        if (gameMode === "ultraset") {
          for (let l = k + 1; l < deck.length; l++) {
            if (checkSetUltra(deck[i], deck[j], deck[k], deck[l])) {
              return [deck[i], deck[j], deck[k], deck[l]];
            }
          }
        }
      }
    }
  }
  return null;
}

export function splitDeck(deck, gameMode = "normal", old = []) {
  let len = Math.min(deck.length, 12);
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

export function computeState(gameData, gameMode = "normal") {
  if (gameMode === "normal") {
    return computeStateNormal(gameData);
  } else if (gameMode === "ultraset") {
    return computeStateUltra(gameData);
  } else if (gameMode === "setchain") {
    return computeStateChain(gameData);
  }
}

function computeStateNormal(gameData) {
  const scores = {}; // scores of all users
  const used = {}; // set of cards that have been taken
  const history = []; // list of valid events in time order
  const current = gameData.deck.slice();
  if (gameData.events) {
    const events = Object.entries(gameData.events)
      .sort(([k1, e1], [k2, e2]) => {
        return e1.time !== e2.time ? e1.time - e2.time : k1 < k2;
      })
      .map(([_k, e]) => e);
    for (const event of events) {
      const { user, c1, c2, c3 } = event;
      if (
        c1 !== c2 &&
        c2 !== c3 &&
        c3 !== c1 &&
        !used[c1] &&
        !used[c2] &&
        !used[c3]
      ) {
        used[c1] = used[c2] = used[c3] = true;
        scores[user] = (scores[user] || 0) + 1;
        history.push(event);
        if (
          current.indexOf(c1) < 12 &&
          current.indexOf(c2) < 12 &&
          current.indexOf(c3) < 12 &&
          current.length >= 15
        ) {
          // Try to preserve card locations, if possible
          const [d1, d2, d3] = current.splice(12, 3);
          current[current.indexOf(c1)] = d1;
          current[current.indexOf(c2)] = d2;
          current[current.indexOf(c3)] = d3;
        } else {
          // Otherwise, just remove the cards
          current.splice(current.indexOf(c1), 1);
          current.splice(current.indexOf(c2), 1);
          current.splice(current.indexOf(c3), 1);
        }
      }
    }
  }
  return { current, scores, history };
}

function computeStateChain(gameData) {
  const scores = {}; // scores of all users
  const used = {}; // set of cards that have been taken
  const history = []; // list of valid events in time order
  const current = gameData.deck.slice();
  if (gameData.events) {
    const events = Object.entries(gameData.events)
      .sort(([k1, e1], [k2, e2]) => {
        return e1.time !== e2.time ? e1.time - e2.time : k1 < k2;
      })
      .map(([_k, e]) => e);

    for (const event of events) {
      const { user, c1, c2, c3 } = event;
      let isFirst = history.length === 0;

      let ok = c1 !== c2 && c2 !== c3 && c1 !== c3;
      ok &&= !used[c2] && !used[c3];
      if (history.length) {
        //One card (c1) should be taken from the previous set
        const prevEvent = history[history.length - 1];
        const prev = [prevEvent.c1, prevEvent.c2, prevEvent.c3];
        ok &&= prev.includes(c1);
      }

      if (ok) {
        used[c1] = used[c2] = used[c3] = true;
        scores[user] = (scores[user] || 0) + 1;
        history.push(event);
        if (
          (isFirst || current.indexOf(c1) < 12) &&
          current.indexOf(c2) < 12 &&
          current.indexOf(c3) < 12 &&
          current.length >= 15
        ) {
          // Try to preserve card locations, if possible
          if (isFirst) {
            const [d1] = current.splice(12, 1);
            current[current.indexOf(c1)] = d1;
          }
          const [d2, d3] = current.splice(12, 2);
          current[current.indexOf(c2)] = d2;
          current[current.indexOf(c3)] = d3;
        } else {
          // Otherwise, just remove the cards
          if (isFirst) current.splice(current.indexOf(c1), 1);
          current.splice(current.indexOf(c2), 1);
          current.splice(current.indexOf(c3), 1);
        }
      }
    }
  }
  return { current, scores, history };
}

function computeStateUltra(gameData) {
  const scores = {}; //scores of all users
  const used = {}; //set of cards that have been taken
  const history = []; //list of valid events in time order
  const current = gameData.deck.slice();
  if (gameData.events) {
    const events = Object.entries(gameData.events)
      .sort(([k1, e1], [k2, e2]) => {
        return e1.time !== e2.time ? e1.time - e2.time : k1 < k2;
      })
      .map(([_k, e]) => e);
    for (const event of events) {
      const { user, c1, c2, c3, c4 } = event;
      let ok = c1 !== c2 && c2 !== c3 && c1 !== c3;
      ok &&= c1 !== c4 && c2 !== c4 && c3 !== c4;
      ok &&= !used[c1] && !used[c2] && !used[c3] && !used[c4];
      if (ok) {
        used[c1] = used[c2] = used[c3] = used[c4] = true;
        scores[user] = (scores[user] || 0) + 1;
        history.push(event);
        if (
          current.indexOf(c1) < 12 &&
          current.indexOf(c2) < 12 &&
          current.indexOf(c3) < 12 &&
          current.indexOf(c4) < 12 &&
          current.length >= 16
        ) {
          // Try to preserve card locations, if possible
          const [d1, d2, d3, d4] = current.splice(12, 4);
          current[current.indexOf(c1)] = d1;
          current[current.indexOf(c2)] = d2;
          current[current.indexOf(c3)] = d3;
          current[current.indexOf(c4)] = d4;
        } else {
          // Otherwise, just remove the cards
          current.splice(current.indexOf(c1), 1);
          current.splice(current.indexOf(c2), 1);
          current.splice(current.indexOf(c3), 1);
          current.splice(current.indexOf(c4), 1);
        }
      }
    }
  }
  return { current, scores, history };
}

export function formatTime(t, hideSubsecond) {
  t = Math.max(t, 0);
  const hours = Math.floor(t / (3600 * 1000));
  const rest = t % (3600 * 1000);
  const format = hideSubsecond ? "mm:ss" : "mm:ss.SS";
  return (hours ? `${hours}:` : "") + moment(rest).format(format);
}
