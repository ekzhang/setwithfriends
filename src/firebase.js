import "firebase/compat/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/functions";

// import "firebase/compat/storage";

import config, { isDev } from "./config";

firebase.initializeApp(config.firebase);
if (isDev) {
  firebase
    .auth()
    .useEmulator("http://localhost:9099", { disableWarnings: true });
  firebase.database().useEmulator("localhost", 9000);
  firebase.functions().useEmulator("localhost", 5001);
  // firebase.storage().useEmulator("localhost", 9199);
} else {
  firebase.analytics();
}

export const authProvider = new firebase.auth.GoogleAuthProvider();

const functions = firebase.functions();
export const createGame = functions.httpsCallable("createGame");
export const customerPortal = functions.httpsCallable("customerPortal");
export const finishGame = functions.httpsCallable("finishGame");

export default firebase;
