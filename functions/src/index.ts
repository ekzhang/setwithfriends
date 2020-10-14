import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

const MAX_GAME_ID_LENGTH = 64;
const MAX_UNFINISHED_GAMES_PER_HOUR = 4;

/** Ends the game with the correct time */
export const finishGame = functions.https.onCall(async (data, context) => {
  const gameId = data.gameId;
  if(
    !(typeof gameId === "string") ||
    gameId.length === 0 ||
    gameId.length > MAX_GAME_ID_LENGTH
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        "argument `gameId` to be created at `/games/:gameId`."
    );
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  let finalTime = 0;
  await admin
  .database()
  .ref(`gameData/${gameId}/events`)
  .limitToLast(1)
  .once("value", function(snapshot){
    for(const p in snapshot.val())
      finalTime = snapshot.val()[p].time;
  }, function(err){
    console.error(err);
  });

  return {"endedAt":finalTime};
});

/** Create a new game in the database */
export const createGame = functions.https.onCall(async (data, context) => {
  const gameId = data.gameId;
  const access = data.access || "public";
  if (
    !(typeof gameId === "string") ||
    gameId.length === 0 ||
    gameId.length > MAX_GAME_ID_LENGTH
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        "argument `gameId` to be created at `/games/:gameId`."
    );
  }
  if (
    !(typeof access === "string") ||
    (access !== "private" && access !== "public")
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        'argument `access` given value "public" or "private".'
    );
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const userId = context.auth.uid;

  const oneHourAgo = Date.now() - 3600000;
  const recentGameIds = await admin
    .database()
    .ref(`userGames/${userId}`)
    .orderByValue()
    .startAt(oneHourAgo)
    .once("value");

  const recentGames = await Promise.all(
    Object.keys(recentGameIds.val() || {}).map((recentGameId) =>
      admin.database().ref(`games/${recentGameId}`).once("value")
    )
  );

  let unfinishedGames = 0;
  for (const snap of recentGames) {
    if (
      snap.child("host").val() === userId &&
      snap.child("status").val() !== "done" &&
      snap.child("access").val() === "public"
    ) {
      ++unfinishedGames;
    }
  }

  const gameRef = admin.database().ref(`games/${gameId}`);
  const { committed, snapshot } = await gameRef.transaction((currentData) => {
    if (currentData === null) {
      if (
        unfinishedGames >= MAX_UNFINISHED_GAMES_PER_HOUR &&
        access === "public"
      ) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Too many unfinished public games were recently created."
        );
      }
      return {
        host: userId,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        status: "waiting",
        access,
      };
    } else {
      return;
    }
  });
  if (!committed) {
    throw new functions.https.HttpsError(
      "already-exists",
      "The requested `gameId` already exists."
    );
  }

  // After this point, the game has successfully been created.
  // We update the database asynchronously in three different places:
  //   1. /gameData/:gameId
  //   2. /stats/gameCount
  //   3. /publicGames (if access is public)
  const updates: Array<Promise<any>> = [];
  updates.push(
    admin.database().ref(`gameData/${gameId}`).set({
      deck: generateDeck(),
    })
  );
  updates.push(
    admin
      .database()
      .ref("stats/gameCount")
      .transaction((count) => (count || 0) + 1)
  );
  if (access === "public") {
    updates.push(
      admin
        .database()
        .ref("publicGames")
        .child(gameId)
        .set(snapshot?.child("createdAt").val())
    );
  }

  await Promise.all(updates);
  return snapshot?.val();
});

function generateDeck() {
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

/** Periodically remove stale user connections */
export const clearConnections = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const onlineUsers = await admin
      .database()
      .ref("users")
      .orderByChild("connections")
      .startAt(false)
      .once("value");
    const actions: Array<Promise<void>> = [];
    let numUsers = 0;
    onlineUsers.forEach((snap) => {
      ++numUsers;
      if (Math.random() < 0.1) {
        console.log(`Clearing connections for ${snap.ref.toString()}`);
        actions.push(snap.ref.child("connections").remove());
      }
    });
    actions.push(admin.database().ref("stats/onlineUsers").set(numUsers));
    await Promise.all(actions);
  });
