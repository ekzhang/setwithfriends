import assert from "assert";
import { getDatabase } from "firebase-admin/database";

/** Fix games that have `endedAt === 0` due to a site migration bug in v3.0.0. */
export async function fixGames() {
  const badGames = await getDatabase()
    .ref("games")
    .orderByChild("endedAt")
    .equalTo(0)
    .once("value");

  for (const [gameId, game] of Object.entries(badGames.val())) {
    console.log(`Fixing game ${gameId}...`);
    console.log({ [gameId]: game });
    assert.strictEqual(game.status, "done");
    const events = await getDatabase()
      .ref(`gameData/${gameId}/events`)
      .once("value");
    let lastTime = 0;
    events.forEach((event) => {
      lastTime = event.val().time;
    });
    console.log(`Setting endedAt = ${lastTime}...`);
    await getDatabase().ref(`games/${gameId}/endedAt`).set(lastTime);
    console.log("Done.\n");
  }

  console.log("Completed all games!");
}
