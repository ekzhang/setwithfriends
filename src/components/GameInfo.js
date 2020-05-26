import React from "react";
import useFirebaseRef from "../hooks/useFirebaseRef";

function GameInfo(props) {
  const { id, render } = props;
  const [game, loading] = useFirebaseRef(`games/${id}`);
  return !loading && render ? render(game) : null;
}

export default GameInfo;
