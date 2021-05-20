import admin from "firebase-admin";

const batchSize = 1000;

/**
 * Recalculate statistics for all users based on their game history.
 *
 * Run this twice, before and after the v3.2.1 release, as well as any future
 * release that changes the statistics calculated for each user.
 *
 * Warning: This script is extremely CPU and memory-intensive. Past iterations
 * blew through the maximum Node.js heap allocation size, so I had to batch the
 * calculations to be efficient.
 */
export async function calcStats() {
  console.log("Loading users...");
  const users = await admin.database().ref("users").orderByKey().get();
  const userIds = Object.keys(users.val());
  console.log("Done loading users!");

  for (let i = 0; i < userIds.length; i += batchSize) {
    console.log(`Progress: ${i}/${userIds.length}`);
    const startTime = Date.now();

    await Promise.all(
      userIds.slice(i, i + batchSize).map(async (userId) => {
        const games = await admin
          .database()
          .ref(`userGames/${userId}`)
          .once("value");

        if (process.env.VERBOSE)
          console.log(`[${userId}] Found ${games.numChildren()} games...`);
        if (games.numChildren() === 0) {
          return;
        }

        const stats = {};
        for (const mode of ["normal", "setchain", "ultraset"]) {
          stats[mode] = {};
          for (const variant of ["solo", "multiplayer"]) {
            stats[mode][variant] = {};
          }
        }

        await Promise.all(
          Object.keys(games.val()).map(async (gameId) => {
            const game = await admin.database().ref(`games/${gameId}`).get();
            if (game.child("status").val() !== "done") {
              if (process.env.VERBOSE)
                console.log(`[${userId}] Skipping ongoing game ${gameId}`);
              return;
            }
            const gameData = await admin
              .database()
              .ref(`gameData/${gameId}`)
              .get();

            if (process.env.VERBOSE)
              console.log(`[${userId}] Adding game ${gameId}`);

            const gameMode = game.child("mode").val() || "normal";
            const { finalTime, scores } = replayEvents(gameData, gameMode);

            // Check if hints are enabled; and if so, ignore the game in statistics
            if (
              game.child("enableHint").val() &&
              game.child("users").numChildren() === 1 &&
              game.child("access").val() === "private" &&
              gameMode === "normal"
            ) {
              return;
            }

            // Retrieve userIds of players in the game.
            const players = [];
            game.child("users").forEach(function (childSnap) {
              if (childSnap.key !== null) {
                players.push(childSnap.key);
              }
            });

            if (!players.includes(userId)) {
              // Database inconsistency between userGames and games/*/users
              return;
            }

            // Add scores for players without a single set.
            for (const player of players) {
              scores[player] = scores[player] || 0;
            }

            // Differentiate between solo and multiplayer games.
            const variant = players.length === 1 ? "solo" : "multiplayer";
            const time = finalTime - game.child("startedAt").val();
            const topScore = Math.max(...Object.values(scores));

            // Update statistics
            const obj = stats[gameMode][variant];
            obj.finishedGames = (obj.finishedGames || 0) + 1;
            obj.totalSets = (obj.totalSets || 0) + scores[userId];
            if (scores[userId] === topScore) {
              obj.wonGames = (obj.wonGames || 0) + 1;
              obj.fastestTime = Math.min(obj.fastestTime || Infinity, time);
            }
            obj.totalTime = (obj.totalTime || 0) + time;
          })
        );

        if (process.env.VERBOSE)
          console.log(`[${userId}] Finished: ${JSON.stringify(stats)}`);

        const updates = {};
        for (const mode of ["normal", "setchain", "ultraset"]) {
          for (const variant of ["solo", "multiplayer"]) {
            updates[`${mode}/${variant}`] = stats[mode][variant];
          }
        }
        await admin.database().ref(`userStats/${userId}`).update(updates);
      })
    );

    const elapsed = Date.now() - startTime;
    console.log(`  -> took ${elapsed}ms`);
  }
}

//
// The functions below are from `functions/src/game.ts`, with types removed.
//

/** Check if cards are valid (all distinct and exist in deck) */
function isValid(deck, cards) {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] === cards[j]) return false;
    }
    if (!deck.has(cards[i])) return false;
  }
  return true;
}

/** Delete cards from deck */
function deleteCards(deck, cards) {
  for (const c of cards) deck.delete(c);
}

/** Replay game event for normal mode */
function replayEventNormal(deck, event) {
  const cards = [event.c1, event.c2, event.c3];
  if (!isValid(deck, cards)) return false;
  deleteCards(deck, cards);
  return true;
}

/** Replay game event for setchain mode */
function replayEventChain(history, deck, event) {
  const { c1, c2, c3 } = event;

  // Check validity
  let ok = c1 !== c2 && c2 !== c3 && c1 !== c3;
  ok = ok && deck.has(c2) && deck.has(c3);
  if (history.length) {
    // One card (c1) should be taken from the previous set
    const prevEvent = history[history.length - 1];
    const prev = [prevEvent.c1, prevEvent.c2, prevEvent.c3];
    ok = ok && prev.includes(c1);
  }
  if (!ok) return;

  const cards = history.length === 0 ? [c1, c2, c3] : [c2, c3];
  deleteCards(deck, cards);
  return true;
}

/** Replay game event for ultraset mode */
function replayEventUltra(deck, event) {
  const cards = [event.c1, event.c2, event.c3, event.c4];
  if (!isValid(deck, cards)) return false;
  deleteCards(deck, cards);
  return true;
}

/**
 * Compute remaining cards (arbitrary order) left in the deck after some
 * events, as well as the time of the final valid event.
 */
export function replayEvents(gameData, gameMode) {
  const events = [];
  gameData.child("events").forEach((e) => {
    events.push(e.val());
  });
  // Array.sort() is guaranteed to be stable in Node.js, and the latest ES spec
  events.sort((e1, e2) => e1.time - e2.time);

  const deck = new Set(gameData.child("deck").val());
  const history = [];
  const scores = {};
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
      scores[event.user] = (scores[event.user] || 0) + 1;
      finalTime = event.time;
    }
  }

  let lastSet = [];
  if (gameMode === "setchain" && history.length > 0) {
    const lastEvent = history[history.length - 1];
    lastSet = [lastEvent.c1, lastEvent.c2, lastEvent.c3];
  }

  return { lastSet, deck, finalTime, scores };
}
