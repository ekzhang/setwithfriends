import React, { useState, useEffect } from "react";

import Game from "../components/Game";
import Lobby from "../components/Lobby";
import NormalUserEnter from "../components/NormalUserEnter";
import { findCard, removeCard, checkSet } from "../util";
import Loading from "../components/Loading";
import firebase from "../firebase";

function GamePage({ user, gameId }) {
  return <h1>game page</h1>;
}

export default GamePage;
