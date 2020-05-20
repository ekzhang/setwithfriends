import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";

const config = {
  apiKey: "AIzaSyB6jICg__HEdtZRcSoIoeUMau41jvKNwvU",
  authDomain: "setwithfriends-dev.firebaseapp.com",
  databaseURL: "https://setwithfriends-dev.firebaseio.com",
  projectId: "setwithfriends-dev",
  storageBucket: "setwithfriends-dev.appspot.com",
  messagingSenderId: "369319422608",
  appId: "1:369319422608:web:b9038b38a1bd598048c615",
  measurementId: "G-GN0204W8F7",
};

firebase.initializeApp(config);
firebase.analytics();

export default firebase;
