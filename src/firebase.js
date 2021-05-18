import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";
import "firebase/functions";

import config, { isDev } from "./config";

firebase.initializeApp(config.firebase);
if (isDev) {
  firebase
    .auth()
    .useEmulator("http://localhost:9099", { disableWarnings: true });
  firebase.database().useEmulator("localhost", 9000);
  firebase.functions().useEmulator("localhost", 5001);
} else {
  firebase.analytics();
}

export const authProvider = new firebase.auth.GoogleAuthProvider();

const functions = firebase.functions();
export const createGame = functions.httpsCallable("createGame");
export const customerPortal = functions.httpsCallable("customerPortal");
export const finishGame = functions.httpsCallable("finishGame");

export default firebase;
