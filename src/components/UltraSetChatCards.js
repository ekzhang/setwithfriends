import { memo } from "react";

import { makeStyles } from "@material-ui/core/styles";

import SetCard from "./SetCard";
import { conjugateCard } from "../util";

const useStyles = makeStyles(() => ({
  cards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function UltraSetChatCards({ item }) {
  const classes = useStyles();

  let fifth = conjugateCard(item.c1, item.c2);
  return (
    <div className={classes.cards}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SetCard size="sm" value={item.c1} />
        <SetCard size="sm" value={item.c2} />
      </div>
      <SetCard size="sm" value={fifth} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SetCard size="sm" value={item.c3} />
        <SetCard size="sm" value={item.c4} />
      </div>
    </div>
  );
}

export default memo(UltraSetChatCards);
