import { memo } from "react";
import ResponsiveSetCard from "./ResponsiveSetCard";

function LastSet({ history, answer, selected, onClick }) {
  if (history.length === 0) return;
  const item = history[history.length - 1];
  return (
    <div>
      {[item.c1, item.c2, item.c3].map((card, idx) => (
        <ResponsiveSetCard
          key={idx}
          value={card}
          width={150}
          background={answer === card ? "lightBlue" : " "}
          active={selected.includes(card)}
          onClick={() => onClick(card)}
        />
      ))}
    </div>
  );
}

export default memo(LastSet);
