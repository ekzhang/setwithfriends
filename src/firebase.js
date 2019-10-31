import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDcyJ8xRKr6anHhxP34n2OFQgUbB5LXGxc",
  authDomain: "set-game-a0ca5.firebaseapp.com",
  databaseURL: "https://set-game-a0ca5.firebaseio.com",
  projectId: "set-game-a0ca5",
  storageBucket: "set-game-a0ca5.appspot.com",
  messagingSenderId: "676769431894",
  appId: "1:676769431894:web:76456039d2f4be912896f7",
  measurementId: "G-PT86NMCNSG"
};

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();
