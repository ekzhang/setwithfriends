import * as admin from "firebase-admin";

interface GameEvent {
  time: number;
  user: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
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

/** Check if three cards form a set. */
export function checkSet(a: string, b: string, c: string) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

/** Check if four cards form an ultraset */
export function checkSetUltra(a: string, b: string, c: string, d: string) {
  for (let i = 1; i < 4; i++) {
    let ok = true;
    for (let j = 0; j < 4; j++) {
      const mod = [0, 0];
      for (let k = 0; k < 4; k++) {
        if (k === 0 || k === i) mod[0] += arguments[k].charCodeAt(j);
        else mod[1] += arguments[k].charCodeAt(j);
      }
      if (mod[0] % 3 !== mod[1] % 3) ok = false;
    }
    if (ok) {
      const ret = [a, arguments[i]];
      for (let j = 1; j < 4; j++) {
        if (j !== i) ret.push(arguments[j]);
      }
      return ret;
    }
  }
  return null;
}

/** Find a set in an unordered collection of cards, if any, depending on mode. */
export function findSet(
  deck: string[],
  gameMode = "normal",
  old: string[] = []
) {
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      if (gameMode === "setchain") {
        for (let k of old) {
          if (checkSet(deck[i], deck[j], k)) {
            return [k, deck[i], deck[j]];
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
  for (let c of cards) deck.delete(c);
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
  const cards = [event.c1, event.c2, event.c3, event.c4];
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
  gameMode = "normal"
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
