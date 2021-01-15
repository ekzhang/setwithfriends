import * as admin from "firebase-admin";

interface GameEvent {
  time: number;
  user: string;
  c1: string;
  c2: string;
  c3: string;
  c4?: string;
}

type GameMode = "normal" | "setchain" | "ultraset";

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

/** Check if three cards form a set. */
export function checkSet(a: string, b: string, c: string) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

/** Returns the unique card c such that {a, b, c} form a set. */
function conjugateCard(a: string, b: string) {
  const zeroCode = "0".charCodeAt(0);
  let c = "";
  for (let i = 0; i < 4; i++) {
    const sum = a.charCodeAt(i) - zeroCode + b.charCodeAt(i) - zeroCode;
    const lastNum = (3 - (sum % 3)) % 3;
    c += String.fromCharCode(zeroCode + lastNum);
  }
  return c;
}

/** Check if four cards form an ultraset */
export function checkSetUltra(a: string, b: string, c: string, d: string) {
  if (conjugateCard(a, b) === conjugateCard(c, d)) return [a, b, c, d];
  if (conjugateCard(a, c) === conjugateCard(b, d)) return [a, c, b, d];
  if (conjugateCard(a, d) === conjugateCard(b, c)) return [a, d, b, c];
  return null;
}

/** Find a set in an unordered collection of cards, if any, depending on mode. */
export function findSet(deck: string[], gameMode: GameMode, old?: string[]) {
  const deckSet = new Set(deck);
  const ultraConjugates: Record<string, [string, string]> = {};
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      const c = conjugateCard(deck[i], deck[j]);
      if (
        gameMode === "normal" ||
        (gameMode === "setchain" && old!.length === 0)
      ) {
        if (deckSet.has(c)) {
          return [deck[i], deck[j], c];
        }
      } else if (gameMode === "setchain") {
        if (old!.includes(c)) {
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

/** Check if cards are valid (all distinct and exist in deck) */
function isValid(deck: Set<string>, cards: string[]) {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] === cards[j]) return false;
    }
    if (!deck.has(cards[i])) return false;
  }
  return true;
}

/** Delete cards from deck */
function deleteCards(deck: Set<string>, cards: string[]) {
  for (const c of cards) deck.delete(c);
}

/** Replay game event for normal mode*/
function replayEventNormal(deck: Set<string>, event: GameEvent) {
  const cards = [event.c1, event.c2, event.c3];
  if (!isValid(deck, cards)) return false;
  deleteCards(deck, cards);
  return true;
}

/** Replay game event for setchain mode */
function replayEventChain(
  history: GameEvent[],
  deck: Set<string>,
  event: GameEvent
) {
  const { c1, c2, c3 } = event;

  //Check validity
  let ok = c1 !== c2 && c2 !== c3 && c1 !== c3;
  ok &&= deck.has(c2) && deck.has(c3);
  if (history.length) {
    //One card (c1) should be taken from the previous set
    const prevEvent = history[history.length - 1];
    const prev = [prevEvent.c1, prevEvent.c2, prevEvent.c3];
    ok &&= prev.includes(c1);
  }
  if (!ok) return;

  const cards = history.length === 0 ? [c1, c2, c3] : [c2, c3];
  deleteCards(deck, cards);
  return true;
}

/** Replay game event for ultraset mode*/
function replayEventUltra(deck: Set<string>, event: GameEvent) {
  const cards = [event.c1, event.c2, event.c3, event.c4!];
  if (!isValid(deck, cards)) return false;
  deleteCards(deck, cards);
  return true;
}

/**
 * Compute remaining cards (arbitrary order) left in the deck after some
 * events, as well as the time of the final valid event.
 */
export function replayEvents(
  gameData: admin.database.DataSnapshot,
  gameMode: GameMode
) {
  const events: GameEvent[] = [];
  gameData.child("events").forEach((e) => {
    events.push(e.val());
  });
  // Array.sort() is guaranteed to be stable in Node.js, and the latest ES spec
  events.sort((e1, e2) => e1.time - e2.time);

  const deck: Set<string> = new Set(gameData.child("deck").val());
  const history: GameEvent[] = [];
  let finalTime = 0;
  for (const event of events) {
    let eventValid = false;
    if (gameMode === "normal" && replayEventNormal(deck, event))
      eventValid = true;
    if (gameMode === "setchain" && replayEventChain(history, deck, event))
      eventValid = true;
    if (gameMode === "ultraset" && replayEventUltra(deck, event))
      eventValid = true;
    if (eventValid) {
      history.push(event);
      finalTime = event.time;
    }
  }

  let lastSet: string[] = [];
  if (gameMode === "setchain" && history.length > 0) {
    const lastEvent = history[history.length - 1];
    lastSet = [lastEvent.c1, lastEvent.c2, lastEvent.c3];
  }

  return { lastSet, deck, finalTime };
}
