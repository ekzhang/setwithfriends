import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import ResponsiveSetCard from "../components/ResponsiveSetCard";
import useDimensions from "../hooks/useDimensions";

const displayPadding = 8;

function LastSet({ deck, onClick, selected, answer }) {
  const [displayDimensions, displayEl] = useDimensions();

  // Calculate widths and heights in pixels to fit cards in the display container
  // (The default value for `displayWidth` is a hack since we don't know the
  //  actual dimensions of the display container on initial render)
  const displayWidth = displayDimensions ? displayDimensions.width : 200;
  const cardWidth = Math.floor((displayWidth - 2 * displayPadding) / 3);
  const cardHeight = Math.round(cardWidth / 1.6);

  const displayHeight = cardHeight + 2 * displayPadding;

  return (
    <Paper
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: displayHeight + 19,
        transition: "height 0.75s",
      }}
      ref={displayEl}
    >
      <Typography
        variant="caption"
        align="center"
        style={{
          position: "absolute",
          bottom: displayPadding,
          width: "100%",
        }}
      >
        <div>Previous Set</div>
      </Typography>
      <div
        style={{
          position: "absolute",
          top: displayPadding,
        }}
      >
        {deck.map((card) => (
          <ResponsiveSetCard
            key={card}
            value={card}
            width={cardWidth}
            background={
              answer && answer.includes(card) ? "rgb(0,0,255, 0.15)" : "initial"
            }
            active={selected.includes(card)}
            onClick={() => onClick(card)}
          />
        ))}
      </div>
    </Paper>
  );
}

export default LastSet;
