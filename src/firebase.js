import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";
import "firebase/functions";

import config from "./config";

firebase.initializeApp(config.firebase);
firebase.analytics();

export const authProvider = new firebase.auth.GoogleAuthProvider();

const functions = firebase.functions();
export const createGame = functions.httpsCallable("createGame");
export const customerPortal = functions.httpsCallable("customerPortal");
export const finishGame = functions.httpsCallable("finishGame");

export default firebase;
