import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { UserContext } from "../context";
import firebase from "../firebase";

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
    const con = connectionRef;
    if (con) {
      firebase.analytics().setCurrentScreen(location.pathname);
      firebase.analytics().logEvent("screen_view");
      const update = (snap) => {
        if (snap.val() !== location.pathname) {
          con.set(location.pathname);
        }
      };
      con.on("value", update);
      return () => con.off("value", update);
    }
  }, [location, connectionRef]);

  return null;
}

export default ConnectionsTracker;
