import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import Stripe from "stripe";
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2020-08-27",
});

import { generateDeck, replayEvents, findSet } from "./game";

const MAX_GAME_ID_LENGTH = 64;
const MAX_UNFINISHED_GAMES_PER_HOUR = 4;

/** Ends the game with the correct time */
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
        "argument `gameId` to be finished at `/games/:gameId`."
    );
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const gameData = await admin
    .database()
    .ref(`gameData/${gameId}`)
    .once("value");
  const gameModeRef = await admin
    .database()
    .ref(`games/${gameId}/mode`)
    .once("value");
  const gameMode = gameModeRef.val() || "normal";

  const { lastSet, deck, finalTime } = replayEvents(gameData, gameMode);

  if (findSet(Array.from(deck), gameMode, lastSet)) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The requested game has not yet ended."
    );
  }

  // Success! The game has ended, so we do an idempotent update.
  await admin.database().ref(`games/${gameId}`).update({
    status: "done",
    endedAt: finalTime,
  });
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

export const customerPortal = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function must be called while authenticated."
    );
  }

  const user = await admin.auth().getUser(context.auth.uid);
  if (!user.email) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function must be called by an authenticated user with email."
    );
  }

  const customerResponse = await stripe.customers.list({ email: user.email });
  if (!customerResponse.data.length) {
    throw new functions.https.HttpsError(
      "not-found",
      `A subscription with email ${user.email} was not found.`
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
  } catch (error) {
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
      subscription.customer as string
    )) as Stripe.Response<Stripe.Customer>;

    if (email) {
      const user = await admin
        .auth()
        .getUserByEmail(email)
        .catch(() => null);

      if (user) {
        const newState = event.type === "customer.subscription.created";
        await admin.database().ref(`users/${user.uid}/patron`).set(newState);
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
