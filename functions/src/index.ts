import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

const MAX_GAME_ID_LENGTH = 64;

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

  const gameRef = admin.database().ref(`games/${gameId}`);
  const { committed, snapshot } = await gameRef.transaction((currentData) => {
    if (currentData === null) {
      return {
        deck: generateDeck(),
        host: context.auth!.uid,
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
  await admin
    .database()
    .ref("stats/gameCount")
    .transaction((count) => (count || 0) + 1);
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
