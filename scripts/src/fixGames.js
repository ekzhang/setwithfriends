import { getDatabase } from "firebase-admin/database";
import PQueue from "p-queue";

import { databaseIterator } from "./utils.js";

/**
 * Fix games that have `enableHint` in game modes that did not support hints.
 *
 * This is a retroactive migration script for version 3.5.0, where we're
 * enabling hints for all game modes and therefore need a way to track in the
 * database which games actually had hints on.
 *
 * About 0.2% of historical games needed to be updated.
 */
export async function fixGames() {
  let count = 0;
  const queue = new PQueue({ concurrency: 200 });

  for await (const [gameId, game] of databaseIterator("games")) {
    if (++count % 100000 === 0) {
      console.log(`Processed ${count} games...`);
    }
    const { enableHint, users, access, mode } = game.val();
    // See hasHint() function in util.js
    if (
      enableHint &&
      users &&
      Object.keys(users).length === 1 &&
      access === "private" &&
      (mode === "setchain" || mode === "ultraset")
    ) {
      console.log(`Fixing game ${gameId}...`);
      // Change this to `true` when you're ready to do a non-dry run.
      // eslint-disable-next-line no-constant-condition
      if (false) {
        await queue.onEmpty();
        queue.add(getDatabase().ref(`games/${gameId}/enableHint`).set(false));
      }
    }
  }

  await queue.onIdle();
  console.log("Completed all games!");
}
