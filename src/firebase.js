import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";
import "firebase/functions";

const config = {
  development: {
    apiKey: "AIzaSyB6jICg__HEdtZRcSoIoeUMau41jvKNwvU",
    authDomain: "setwithfriends-dev.web.app",
    databaseURL: "https://setwithfriends-dev.firebaseio.com",
    projectId: "setwithfriends-dev",
    storageBucket: "setwithfriends-dev.appspot.com",
    messagingSenderId: "369319422608",
    appId: "1:369319422608:web:b9038b38a1bd598048c615",
    measurementId: "G-GN0204W8F7",
  },
  production: {
    apiKey: "AIzaSyCeKQ4rauZ_fq1rEIPJ8m5XfppwjtmTZBY",
    authDomain: "setwithfriends.com",
    databaseURL: "https://setwithfriends.firebaseio.com",
    projectId: "setwithfriends",
    storageBucket: "setwithfriends.appspot.com",
    messagingSenderId: "970544876139",
    appId: "1:970544876139:web:06295fe4079007f76abf2e",
    measurementId: "G-QDX193SN7R",
  },
};

firebase.initializeApp(config[process.env.REACT_APP_ENV || "development"]);
firebase.analytics();

export const authProvider = new firebase.auth.GoogleAuthProvider();

export const createGame = firebase.functions().httpsCallable("createGame");
export const finishGame = firebase.functions().httpsCallable("finishGame");

export default firebase;
