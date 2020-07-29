import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyCeKQ4rauZ_fq1rEIPJ8m5XfppwjtmTZBY",
  authDomain: "setwithfriends.com",
  databaseURL: "https://setwithfriends.firebaseio.com",
  projectId: "setwithfriends",
  storageBucket: "setwithfriends.appspot.com",
  messagingSenderId: "970544876139",
  appId: "1:970544876139:web:06295fe4079007f76abf2e",
  measurementId: "G-QDX193SN7R",
};

firebase.initializeApp(config);
firebase.analytics();

export const authProvider = new firebase.auth.GoogleAuthProvider();

export const createGame = firebase.functions().httpsCallable("createGame");

export default firebase;
