export function generateDeck() {
  const deck = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push([i, j, k, l]);
        }
      }
    }
  }
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
};

export function checkSet(a, b, c) {
  for (let i = 0; i < 4; i++) {
    if ((a[i] + b[i] + c[i]) % 3 !== 0) return false;
  }
  return true;
}

export function equal(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export function findCard(deck, c) {
  for (let i = 0; i < deck.length; i++) {
    if (equal(deck[i], c)) return i;
  }
  return -1;
}

export function removeCard(deck, c) {
  let i = findCard(deck, c);
  return [...deck.slice(0, i), ...deck.slice(i + 1)];
}
