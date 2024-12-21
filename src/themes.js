import { grey, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
    grey: {
      main: grey[300],
      dark: grey[400],
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    action: {
      hover: "#363636",
    },
    background: {
      panel: "#303030",
      paper: "#262626",
      default: "#161616",
    },
    success: {
      light: "#81c784",
      main: "#a5d6a7",
      dark: "#82c483",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          color: "#fff",
          caretColor: "#fff",
          backgroundColor: "#262626",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "6px 12px", // Match v4 default padding
          lineHeight: "24.5px",
        },
      },
    },
  },
  custom: {
    pie: {
      noGames: "rgba(0, 0, 0, 0.12)",
    },
    setCard: {
      purple: "#ff47ff",
      green: "#00b803",
      red: "#ffb047",
      background: "#404040",
    },
    alarm: red[700],
    profileTable: {
      row: "#282828",
    },
    setFoundEntry: "rgba(130, 170, 100, 0.15)",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    // These values are ported from the default theme in Material UI v4 for
    // compatibility with the original site after upgrading to MUI 5.
    primary: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
      contrastText: "#fff",
    },
    grey: {
      main: grey[300],
      dark: grey[400],
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    background: {
      panel: "#fafafa",
      paper: "#fff",
      default: "#fafafa",
    },
    success: {
      light: "#81c784",
      main: "#4caf50",
      dark: "#388e3c",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          color: "black",
          caretColor: "black",
          backgroundColor: "#fff",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "6px 12px", // Match v4 default padding
          lineHeight: "24.5px",
        },
      },
    },
  },
  custom: {
    pie: {
      noGames: "rgba(0, 0, 0, 0.12)",
    },
    setCard: {
      purple: "#800080",
      green: "#008002",
      red: "#ff0101",
      background: "#fff",
    },
    alarm: red[700],
    profileTable: {
      row: "#fff",
    },
    setFoundEntry: "rgba(130, 170, 100, 0.15)",
  },
});
