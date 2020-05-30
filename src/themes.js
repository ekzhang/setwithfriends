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
      hover: "#424242",
    },
    success: {
      light: "#c4e3c4",
      main: "#a5d6a7",
      dark: "#82c483",
    },
    background: {
      panel: "#343434",
      paper: "#262626",
      default: "#202020",
    },
  },
  input: {
    textColor: "#fff",
    caretColor: "#fff",
    background: "#262626",
  },
  pie: {
    noGames: "#757575",
  },
  setCard: {
    purple: "#ff47ff",
    green: "#00B803",
    red: "#ff0101",
  },
  alarm: red[700],
});

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
  input: {
    textColor: "black",
    caretColor: "black",
    background: "#fff",
  },
  pie: {
    noGames: "#757575",
  },
  setCard: {
    purple: "#800080",
    green: "#008002",
    red: "#ff0101",
  },
  alarm: red[700],
});
