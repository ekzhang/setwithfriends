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

export function generateDeck() {
  const deck = generateCards();
  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

export function generateColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 60%)`;
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

export function computeState(game) {
  const scoreMap = {};
  for (const uid of Object.keys(game.meta.users)) {
    scoreMap[uid] = 0;
  }
  const used = {};
  const history = [];
  if (game.history) {
    for (const event of Object.values(game.history)) {
      const [a, b, c] = event.cards;
      if (!used[a] && !used[b] && !used[c]) {
        used[a] = used[b] = used[c] = true;
        scoreMap[event.user] += 1;
        history.push(event);
      }
    }
  }
  history.sort((e1, e2) => {
    return e1.time - e2.time;
  });
  const scores = Object.entries(scoreMap).sort(([u1, s1], [u2, s2]) => {
    if (s1 !== s2) return s2 - s1;
    return u1 < u2 ? -1 : 1;
  });
  const deck = [];
  for (const c of game.deck || []) {
    if (!used[c]) deck.push(c);
  }
  return { deck, scores, history };
}
