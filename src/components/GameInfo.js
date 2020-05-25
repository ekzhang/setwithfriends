import React from "react";
import useFirebaseRef from "../hooks/useFirebaseRef";

function GameInfo(props) {
  const { id, style, render } = props;
  const [game, loading] = useFirebaseRef(`games/${id}`);
  if (loading) {
    return null;
  }
  return render ? render(game) : <></>;
}

export default GameInfo;
