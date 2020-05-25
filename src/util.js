import animals from "./utils/animals.json";

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
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 90%, 35%)`;
}

export function checkSet(a, b, c) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

export function findSet(deck) {
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      for (let k = j + 1; k < deck.length; k++) {
        if (checkSet(deck[i], deck[j], deck[k]))
          return [deck[i], deck[j], deck[k]];
      }
    }
  }
  return null;
}

export function splitDeck(deck) {
  let len = Math.min(deck.length, 12);
  while (len < deck.length && !findSet(deck.slice(0, len))) len += 3;
  return [deck.slice(0, len), deck.slice(len)];
}

export function removeCard(deck, c) {
  let i = deck.indexOf(c);
  return [...deck.slice(0, i), ...deck.slice(i + 1)];
}

export function trim(str, maxlen) {
  if (str.length <= maxlen) return str;
  return str.substring(0, maxlen) + "…";
}

export function generateName() {
  // Source: https://a-z-animals.com/animals/
  return "Anonymous " + animals[Math.floor(Math.random() * animals.length)];
}

export function computeState(gameData) {
  const scores = {}; // scores of all users
  const used = {}; // set of cards that have been taken
  const history = []; // list of valid events in time order
  const current = gameData.deck.slice();
  if (gameData.events) {
    const events = Object.values(gameData.events).sort((e1, e2) => {
      return e1.time - e2.time;
    });
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
