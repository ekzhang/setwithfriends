import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

if (window.screen.width > 1280)
  document
    .getElementById("viewport")
    .setAttribute("content", "width=device-width,initial-scale=1");

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
