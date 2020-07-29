import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import "./styles.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { generateColor, generateName } from "./util";
import { UserContext } from "./context";
import useStorage from "./hooks/useStorage";
import ConnectionsTracker from "./components/ConnectionsTracker";
import WelcomeDialog from "./components/WelcomeDialog";
import Navbar from "./components/Navbar";
import RoomPage from "./pages/RoomPage";
import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";
import LoadingPage from "./pages/LoadingPage";
import NotFoundPage from "./pages/NotFoundPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import { lightTheme, darkTheme } from "./themes";

function App() {
  const [uid, setUid] = useState(null);
  const [user, setUser] = useState(null);
  const [themeType, setThemeType] = useStorage("theme", "light");
  const [customLightTheme, setCustomLightTheme] = useState(lightTheme);
  const [customDarkTheme, setCustomDarkTheme] = useState(darkTheme);
  const [customColors, setCustomColors] = useStorage("customColors", "{}");

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUid(user.uid);
      } else {
        // User is signed out.
        setUid(null);
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            alert("Unable to connect to the server. Please try again later.");
          });
      }
    });
  }, []);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      return;
    }
    const userRef = firebase.database().ref(`/users/${uid}`);
    function update(snapshot) {
      if (snapshot.child("name").exists()) {
        setUser({ ...snapshot.val(), id: uid });
      } else {
        userRef.update({
          games: {},
          color: generateColor(),
          name: generateName(),
        });
      }
    }
    userRef.on("value", update);
    return () => {
      userRef.off("value", update);
    };
  }, [uid]);

  useEffect(() => {
    const parsedCustoms = JSON.parse(customColors);
    if (parsedCustoms.light) {
      setCustomLightTheme({
        ...lightTheme,
        setCard: { ...lightTheme.setCard, ...parsedCustoms.light },
      });
    }
    if (parsedCustoms.dark) {
      setCustomDarkTheme({
        ...darkTheme,
        setCard: { ...darkTheme.setCard, ...parsedCustoms.dark },
      });
    }
  }, [customColors]);

  const handleChangeTheme = () => {
    setThemeType(themeType === "light" ? "dark" : "light");
  };

  const handleCustomColors = (custom) => {
    setCustomColors(JSON.stringify(custom));
  };

  return (
    <ThemeProvider
      theme={themeType === "light" ? customLightTheme : customDarkTheme}
    >
      <BrowserRouter>
        <CssBaseline />
        {!user ? (
          <LoadingPage />
        ) : (
          <UserContext.Provider value={user}>
            <ConnectionsTracker />
            <WelcomeDialog />
            <Navbar
              themeType={themeType}
              handleChangeTheme={handleChangeTheme}
              customColors={JSON.parse(customColors)}
              handleCustomColors={handleCustomColors}
            />
            <Switch>
              <Route exact path="/help" component={HelpPage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/contact" component={ContactPage} />
              <Route exact path="/" component={LobbyPage} />
              <Route exact path="/room/:id" component={RoomPage} />
              <Route exact path="/game/:id" component={GamePage} />
              <Route exact path="/profile/:id" component={ProfilePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </UserContext.Provider>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
