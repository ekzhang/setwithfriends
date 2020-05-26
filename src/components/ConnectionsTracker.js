import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import firebase from "../firebase";
import { UserContext } from "../context";

function ConnectionsTracker() {
  const user = useContext(UserContext);
  const [connectionRef, setConnectionRef] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const connectionsRef = firebase
      .database()
      .ref(`users/${user.id}/connections`);
    const lastOnlineRef = firebase
      .database()
      .ref(`users/${user.id}/lastOnline`);
    const connectedRef = firebase.database().ref(".info/connected");

    function onConnectedUpdate(snap) {
      if (snap.val() === true) {
        const con = connectionsRef.push();
        con.onDisconnect().remove();
        setConnectionRef(con);

        lastOnlineRef
          .onDisconnect()
          .set(firebase.database.ServerValue.TIMESTAMP);
      }
    }

    connectedRef.on("value", onConnectedUpdate);
    return () => {
      connectedRef.off("value", onConnectedUpdate);
    };
  }, [user.id]);

  useEffect(() => {
    if (connectionRef) {
      connectionRef.set(location.pathname);
      firebase.analytics().setCurrentScreen(location.pathname);
      firebase.analytics().logEvent("screen_view");
    }
  }, [location, connectionRef]);

  return null;
}

export default ConnectionsTracker;
