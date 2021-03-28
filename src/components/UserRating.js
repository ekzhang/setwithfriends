import { styled } from "@material-ui/core/styles";

import useStats from "../hooks/useStats";

const Badge = styled("div")({
  display: "inline-block",
  width: "2.5rem",
  borderRadius: "5px",
  color: "white",
  backgroundColor: "dodgerblue",
  fontSize: "0.85rem",
  textAlign: "center",
});

/** Component providing a badge that shows a user's rating for a game mode.  */
function Rating({ userId, gameMode }) {
  const [stats, loading] = useStats(userId);
  return <Badge>{loading ? "⋯" : Math.round(stats[gameMode].rating)}</Badge>;
}

export default Rating;
