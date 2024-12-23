import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { type DataSnapshot, getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import * as functions from "firebase-functions/v1";
import PQueue from "p-queue";
import Stripe from "stripe";

import { GameMode, findSet, generateDeck, replayEvents } from "./game";
import { databaseIterator, gzip } from "./utils";

initializeApp(); // Sets the default Firebase app.

const stripe = process.env.FUNCTIONS_EMULATOR
  ? (null as any)
  : new Stripe(functions.config().stripe.secret, {
      apiVersion: "2024-12-18.acacia",
    });

const MAX_GAME_ID_LENGTH = 64;
const MAX_UNFINISHED_GAMES_PER_HOUR = 4;

// Rating system parameters.
const SCALING_FACTOR = 800;
const BASE_RATING = 1200;

type TransactionResult = {
  committed: boolean;
  snapshot: DataSnapshot;
};

/** Ends the game with the correct time and updates ratings */
export const finishGame = functions.https.onCall(async (data, context) => {
  const gameId = data.gameId;
  if (
    !(typeof gameId === "string") ||
    gameId.length === 0 ||
    gameId.length > MAX_GAME_ID_LENGTH
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        "argument `gameId` to be finished at `/games/:gameId`.",
    );
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated.",
    );
  }

  const gameData = await getDatabase().ref(`gameData/${gameId}`).once("value");
  const gameSnap = await getDatabase().ref(`games/${gameId}`).once("value");
  if (!gameSnap.exists()) {
    throw new functions.https.HttpsError(
      "not-found",
      `The game with gameId ${gameId} was not found in the database.`,
    );
  }

  const gameMode = (gameSnap.child("mode").val() as GameMode) || "normal";

  const { lastSet, deck, finalTime, scores } = replayEvents(gameData, gameMode);

  if (findSet(Array.from(deck), gameMode, lastSet)) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The requested game has not yet ended.",
    );
  }

  // The game has ended, so we attempt to do an atomic update.
  // Safety: Events can only be appended to the game, so the final time must remain the same.
  const { committed, snapshot }: TransactionResult = await getDatabase()
    .ref(`games/${gameId}`)
    .transaction((game) => {
      if (game.status !== "ingame") {
        // Someone beat us to the atomic update, so we cancel the transaction.
        return;
      }
      game.status = "done";
      game.endedAt = finalTime;
      return game;
    });

  if (!committed) {
    return;
  }

  // Check if hints are enabled; and if so, ignore the game in statistics
  if (
    snapshot.child("enableHint").val() &&
    snapshot.child("users").numChildren() === 1 &&
    snapshot.child("access").val() === "private" &&
    gameMode === "normal"
  ) {
    return;
  }

  /**
   * Update statistics and ratings of players involved based on an extension of
   * the Elo system.
   */

  // Retrieve userIds of players in the game.
  const players: string[] = [];
  snapshot.child("users").forEach(function (childSnap) {
    if (childSnap.key !== null) {
      players.push(childSnap.key);
    }
  });

  // Add scores for players without a single set.
  for (const player of players) {
    scores[player] ??= 0;
  }

  // Differentiate between solo and multiplayer games.
  const variant = players.length === 1 ? "solo" : "multiplayer";
  const time = finalTime - gameSnap.child("startedAt").val();
  const topScore = Math.max(...Object.values(scores));

  // Update statistics for all users
  const userStats: Record<string, any> = {};
  await Promise.all(
    players.map(async (player) => {
      const result: TransactionResult = await getDatabase()
        .ref(`userStats/${player}/${gameMode}/${variant}`)
        .transaction((stats) => {
          stats ??= {}; // tslint:disable-line no-parameter-reassignment
          stats.finishedGames = (stats.finishedGames ?? 0) + 1;
          stats.totalSets = (stats.totalSets ?? 0) + scores[player];
          if (scores[player] === topScore) {
            stats.wonGames = (stats.wonGames ?? 0) + 1;
            stats.fastestTime = Math.min(stats.fastestTime ?? Infinity, time);
          }
          stats.totalTime = (stats.totalTime ?? 0) + time;
          return stats;
        });
      // Save these values for use in rating calculation
      userStats[player] = result.snapshot.val();
    }),
  );

  // If the game is solo, we skip rating calculation.
  if (variant === "solo") {
    return;
  }

  // Retrieve old ratings from the database.
  const ratings: Record<string, number> = {};
  for (const player of players) {
    const ratingSnap = await getDatabase()
      .ref(`userStats/${player}/${gameMode}/rating`)
      .once("value");
    const rating = ratingSnap.exists() ? ratingSnap.val() : BASE_RATING;
    ratings[player] = rating;
  }

  // Compute expected ratio for each player.
  const likelihood: Record<string, number> = {};
  let totalLikelihood = 0;
  for (const player of players) {
    likelihood[player] = Math.pow(10, ratings[player] / SCALING_FACTOR);
    totalLikelihood += likelihood[player];
  }

  // Compute achieved ratio for each player.
  const achievedRatio: Record<string, number> = {};
  const setCount = Object.values(scores).reduce((a, b) => a + b);
  for (const player of players) {
    achievedRatio[player] = scores[player] / setCount;
  }

  // Compute new rating for each player.
  const updates: Record<string, number> = {};
  for (const player of players) {
    /**
     * Adapt the learning rate to the experience of a player and the
     * corresponding certainty of the rating system based on the number of
     * games played.
     */
    const gameCount = userStats[player].finishedGames as number;
    const learningRate = Math.max(256 / (1 + gameCount / 20), 64);

    const newRating =
      ratings[player] +
      learningRate *
        (achievedRatio[player] - likelihood[player] / totalLikelihood);

    updates[`${player}/${gameMode}/rating`] = newRating;
  }
  await getDatabase().ref("userStats").update(updates);
});

/** Create a new game in the database */
export const createGame = functions.https.onCall(async (data, context) => {
  const gameId = data.gameId;
  const access = data.access || "public";
  const mode = data.mode || "normal";
  const enableHint = data.enableHint || false;

  if (
    !(typeof gameId === "string") ||
    gameId.length === 0 ||
    gameId.length > MAX_GAME_ID_LENGTH ||
    !gameId.match(/^[a-zA-Z0-9_-]+$/)
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        "argument `gameId` to be created at `/games/:gameId`.",
    );
  }
  if (
    !(typeof access === "string") ||
    (access !== "private" && access !== "public")
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        'argument `access` given value "public" or "private".',
    );
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated.",
    );
  }

  const userId = context.auth.uid;

  const oneHourAgo = Date.now() - 3600 * 1000;
  const recentGameIds = await getDatabase()
    .ref(`userGames/${userId}`)
    .orderByValue()
    .startAt(oneHourAgo)
    .once("value");

  const recentGames = await Promise.all(
    Object.keys(recentGameIds.val() || {}).map((recentGameId) =>
      getDatabase().ref(`games/${recentGameId}`).once("value"),
    ),
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

  const gameRef = getDatabase().ref(`games/${gameId}`);
  const { committed, snapshot } = await gameRef.transaction((currentData) => {
    if (currentData === null) {
      if (
        unfinishedGames >= MAX_UNFINISHED_GAMES_PER_HOUR &&
        access === "public"
      ) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Too many unfinished public games were recently created.",
        );
      }
      return {
        host: userId,
        // Hack: In Firebase v13, `admin.database.ServerValue.TIMESTAMP`
        // does not work anymore from TypeScript.
        createdAt: { ".sv": "timestamp" },
        status: "waiting",
        access,
        mode,
        enableHint,
      };
    } else {
      return;
    }
  });
  if (!committed) {
    throw new functions.https.HttpsError(
      "already-exists",
      "The requested `gameId` already exists.",
    );
  }

  // After this point, the game has successfully been created.
  // We update the database asynchronously in three different places:
  //   1. /gameData/:gameId
  //   2. /stats/gameCount
  //   3. /publicGames (if access is public)
  const updates: Array<Promise<any>> = [];
  updates.push(
    getDatabase().ref(`gameData/${gameId}`).set({
      deck: generateDeck(),
    }),
  );
  updates.push(
    getDatabase()
      .ref("stats/gameCount")
      .transaction((count) => (count || 0) + 1),
  );
  if (access === "public") {
    updates.push(
      getDatabase()
        .ref("publicGames")
        .child(gameId)
        .set(snapshot?.child("createdAt").val()),
    );
  }

  await Promise.all(updates);
  return snapshot.val();
});

/** Generate a link to the customer portal. */
export const customerPortal = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function must be called while authenticated.",
    );
  }

  const user = await getAuth().getUser(context.auth.uid);
  if (!user.email) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function must be called by an authenticated user with email.",
    );
  }

  const customerResponse = await stripe.customers.list({ email: user.email });
  if (!customerResponse.data.length) {
    throw new functions.https.HttpsError(
      "not-found",
      `A subscription with email ${user.email} was not found.`,
    );
  }

  const portalResponse = await stripe.billingPortal.sessions.create({
    customer: customerResponse.data[0].id,
    return_url: data.returnUrl,
  });
  return portalResponse.url;
});

/** Periodically remove stale user connections */
export const clearConnections = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const onlineUsers = await getDatabase()
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
    actions.push(getDatabase().ref("stats/onlineUsers").set(numUsers));
    await Promise.all(actions);
  });

/** Webhook that handles Stripe customer events. */
export const handleStripe = functions.https.onRequest(async (req, res) => {
  const payload = req.rawBody;
  const sig = req.get("stripe-signature");

  if (!sig) {
    res.status(400).send("Webhook Error: Missing stripe-signature");
    return;
  }

  const { endpoint_secret } = functions.config().stripe;
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpoint_secret);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  console.log(`Received ${event.type}: ${JSON.stringify(event.data)}`);
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const { email } = (await stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Response<Stripe.Customer>;

    if (email) {
      const user = await getAuth()
        .getUserByEmail(email)
        .catch(() => null);

      if (user) {
        const newState = event.type === "customer.subscription.created";
        await getDatabase().ref(`users/${user.uid}/patron`).set(newState);
        console.log(`Processed ${email} (${user.uid}): newState = ${newState}`);
      } else {
        console.log(`Failed to find user: ${email}`);
      }
    } else {
      console.log("Subscription event received with no email, ignoring");
    }
  }

  res.status(200).end();
});

/**
 * Archive a game state from RTDB to GCS, reducing the storage tier.
 * Returns whether the state was found in the database.
 */
async function archiveGameState(gameId: string): Promise<boolean> {
  const snap = await getDatabase().ref(`gameData/${gameId}`).get();
  if (!snap.exists()) {
    return false; // Game state is not present in the database, maybe racy?
  }

  const jsonBlob = JSON.stringify(snap.val());
  const gzippedBlob = await gzip.compress(jsonBlob);

  await getStorage()
    .bucket()
    .file(`gameData/${gameId}.json.gz`)
    .save(gzippedBlob);

  // After archiving, we remove the game state from the database.
  await getDatabase().ref(`gameData/${gameId}`).remove();
  return true;
}

/** Restore a game state in GCS to RTDB so it can be read from the client. */
async function restoreGameState(gameId: string): Promise<boolean> {
  const file = getStorage().bucket().file(`gameData/${gameId}.json.gz`);
  let gzippedBlob: Buffer;
  try {
    [gzippedBlob] = await file.download();
  } catch (error: any) {
    // File was not present.
    if (error.code === 404) return false;
    throw error;
  }
  const jsonBlob = await gzip.decompress(gzippedBlob);

  const gameData = JSON.parse(jsonBlob.toString());
  await getDatabase().ref(`gameData/${gameId}`).set(gameData);
  return true;
}

/** Try to fetch a game state that's not present, restoring if needed. */
export const fetchStaleGame = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated.",
    );
  }

  const gameId = data.gameId;
  if (
    !(typeof gameId === "string") ||
    gameId.length === 0 ||
    gameId.length > MAX_GAME_ID_LENGTH
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with argument `gameId` to be fetched at `/games/:gameId`.",
    );
  }

  try {
    const restored = await restoreGameState(gameId);
    return { restored };
  } catch (error: any) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/** Archive stale game states to GCS for cost savings. */
export const archiveStaleGames = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .pubsub.schedule("every 1 hours")
  .onRun(async (context) => {
    const cutoff = Date.now() - 30 * 86400 * 1000; // 30 days ago
    const queue = new PQueue({ concurrency: 50 });

    for await (const [gameId] of databaseIterator("gameData")) {
      await queue.add(async () => {
        const game = await getDatabase().ref(`games/${gameId}`).get();
        if (game.val().createdAt < cutoff) {
          console.log(`Archiving stale game state for ${gameId}`);
          await archiveGameState(gameId);
        }
      });
    }

    await queue.onIdle();
  });
