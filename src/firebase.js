import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";
import "firebase/functions";

import config from "./config";

firebase.initializeApp(config.firebase);
firebase.analytics();

export const authProvider = new firebase.auth.GoogleAuthProvider();

export const createGame = firebase.functions().httpsCallable("createGame");
export const finishGame = firebase.functions().httpsCallable("finishGame");

export default firebase;
