import * as admin from "firebase-admin";

interface GameEvent {
  time: number;
  user: string;
  c1: string;
  c2: string;
  c3: string;
}

/** Generates a random 81-card deck using a Fisher-Yates shuffle. */
export function generateDeck() {
  const deck: Array<string> = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push(`${i}${j}${k}${l}`);
        }
      }
    }
  }
  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

/**
 * Compute remaining cards (arbitrary order) left in the deck after some
 * events, as well as the time of the final valid event.
 */
export function replayEvents(gameData: admin.database.DataSnapshot) {
  const events: GameEvent[] = [];
  gameData.child("events").forEach((e) => {
    events.push(e.val());
  });
  // Array.sort() is guaranteed to be stable in Node.js, and the latest ES spec
  events.sort((e1, e2) => e1.time - e2.time);

  const deck: Set<string> = new Set(gameData.child("deck").val());
  let finalTime = 0;
  for (const { c1, c2, c3, time } of events) {
    // Check is event is valid
    if (
      c1 !== c2 &&
      c2 !== c3 &&
      c3 !== c1 &&
      deck.has(c1) &&
      deck.has(c2) &&
      deck.has(c3)
    ) {
      deck.delete(c1);
      deck.delete(c2);
      deck.delete(c3);
      finalTime = time;
    }
  }

  return { deck, finalTime };
}

/** Check if three cards form a set. */
export function checkSet(a: string, b: string, c: string) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

/** Find a set in an unordered collection of cards, if any. */
export function findSet(deck: string[]) {
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
