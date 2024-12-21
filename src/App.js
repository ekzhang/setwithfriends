import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ConnectionsTracker from "./components/ConnectionsTracker";
import Navbar from "./components/Navbar";
import WelcomeDialog from "./components/WelcomeDialog";
import { SettingsContext, UserContext } from "./context";
import firebase from "./firebase";
import useStorage from "./hooks/useStorage";
import AboutPage from "./pages/AboutPage";
import BannedPage from "./pages/BannedPage";
import ConductPage from "./pages/ConductPage";
import DonatePage from "./pages/DonatePage";
import GamePage from "./pages/GamePage";
import HelpPage from "./pages/HelpPage";
import LegalPage from "./pages/LegalPage";
import LoadingPage from "./pages/LoadingPage";
import LobbyPage from "./pages/LobbyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RoomPage from "./pages/RoomPage";
import "./styles.css";
import { darkTheme, lightTheme } from "./themes";
import { generateColor, generateName } from "./util";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [themeType, setThemeType] = useStorage("theme", "light");
  const [customLightTheme, setCustomLightTheme] = useState(lightTheme);
  const [customDarkTheme, setCustomDarkTheme] = useState(darkTheme);
  const [customColors, setCustomColors] = useStorage("customColors", "{}");
  const [keyboardLayout, setKeyboardLayout] = useStorage(
    "keyboardLayout",
    "QWERTY",
  );
  const [volume, setVolume] = useStorage("volume", "on");

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setAuthUser({ ...user._delegate });
      } else {
        // User is signed out.
        setAuthUser(null);
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
    if (!authUser) {
      setUser(null);
      return;
    }
    const userRef = firebase.database().ref(`/users/${authUser.uid}`);
    function update(snapshot) {
      if (snapshot.child("name").exists()) {
        setUser({
          ...snapshot.val(),
          id: authUser.uid,
          authUser,
          setAuthUser,
        });
      } else {
        userRef.update({
          color: generateColor(),
          name: generateName(),
        });
      }
    }
    userRef.on("value", update);
    return () => {
      userRef.off("value", update);
    };
  }, [authUser]);

  useEffect(() => {
    const parsedCustoms = JSON.parse(customColors);
    if (parsedCustoms.light) {
      setCustomLightTheme({
        ...lightTheme,
        setCard: { ...lightTheme.custom.setCard, ...parsedCustoms.light },
      });
    }
    if (parsedCustoms.dark) {
      setCustomDarkTheme({
        ...darkTheme,
        setCard: { ...darkTheme.custom.setCard, ...parsedCustoms.dark },
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={themeType === "light" ? customLightTheme : customDarkTheme}
      >
        <BrowserRouter>
          <CssBaseline />
          {!user ? (
            <LoadingPage />
          ) : user.banned && Date.now() < user.banned ? (
            <BannedPage time={user.banned} />
          ) : (
            <UserContext.Provider value={user}>
              <SettingsContext.Provider
                value={{ keyboardLayout, setKeyboardLayout, volume, setVolume }}
              >
                <ConnectionsTracker />
                <WelcomeDialog />
                <Navbar
                  themeType={themeType}
                  handleChangeTheme={handleChangeTheme}
                  customColors={JSON.parse(customColors)}
                  handleCustomColors={handleCustomColors}
                />
                <Routes>
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/conduct" element={<ConductPage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/legal" element={<LegalPage />} />
                  <Route path="/" element={<LobbyPage />} />
                  <Route path="/room/:id" element={<RoomPage />} />
                  <Route path="/game/:id" element={<GamePage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </SettingsContext.Provider>
            </UserContext.Provider>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
