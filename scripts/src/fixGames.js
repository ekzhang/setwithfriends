import assert from "assert";
import admin from "firebase-admin";

/** Fix games that have `endedAt === 0` due to a site migration bug in v3.0.0. */
export async function fixGames() {
  const badGames = await admin
    .database()
    .ref("games")
    .orderByChild("endedAt")
    .equalTo(0)
    .once("value");

  for (const [gameId, game] of Object.entries(badGames.val())) {
    console.log(`Fixing game ${gameId}...`);
    console.log({ [gameId]: game });
    assert.strictEqual(game.status, "done");
    const events = await admin
      .database()
      .ref(`gameData/${gameId}/events`)
      .once("value");
    let lastTime = 0;
    events.forEach((event) => {
      lastTime = event.val().time;
    });
    console.log(`Setting endedAt = ${lastTime}...`);
    await admin.database().ref(`games/${gameId}/endedAt`).set(lastTime);
    console.log("Done.\n");
  }

  console.log("Completed all games!");
}
