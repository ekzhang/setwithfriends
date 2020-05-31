import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#c5cae9",
      main: "#8c9eff",
      dark: "#536dfe",
    },
    secondary: {
      light: "#ff80ac",
      main: "#ff4284",
      dark: "#c51162",
    },
    error: {
      light: "#f8a5c1",
      main: "#f48fb1",
      dark: "#f06694",
    },
    action: {
      hover: "#363636",
    },
    success: {
      light: "#c4e3c4",
      main: "#a5d6a7",
      dark: "#82c483",
    },
    background: {
      panel: "#303030",
      paper: "#262626",
      default: "#161616",
    },
  },
  input: {
    textColor: "#fff",
    caretColor: "#fff",
    background: "#262626",
  },
  pie: {
    noGames: "#rgba(0, 0, 0, 0.12)",
  },
  setCard: {
    purple: "#ff47ff",
    green: "#00B803",
    red: "#ff0101",
  },
  alarm: red[700],
  profileTable: {
    row: "#282828",
  },
});

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      panel: "#fafafa",
      paper: "#fff",
      default: "#fafafa",
    },
  },
  input: {
    textColor: "black",
    caretColor: "black",
    background: "#fff",
  },
  pie: {
    noGames: "rgba(0, 0, 0, 0.12)",
  },
  setCard: {
    purple: "#800080",
    green: "#008002",
    red: "#ff0101",
  },
  alarm: red[700],
  profileTable: {
    row: "#fff",
  },
});
