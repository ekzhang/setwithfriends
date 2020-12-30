import { memo } from "react";

import { makeStyles } from "@material-ui/core/styles";

import SetCard from "./SetCard";

const useStyles = makeStyles(() => ({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
  },
  midDash: {
    height: "50%",
    width: "8px",
    borderBottom: "1px solid black",
  },
}));

function UltraSetChatCards({ item }) {
  const classes = useStyles();

  let fifth = "";
  for (let i = 0; i < 4; i++) {
    let mod = item.c1.charCodeAt(i) + item.c2.charCodeAt(i);
    fifth += String.fromCharCode(48 + ((3 - (mod % 3)) % 3));
  }
  return (
    <div className={classes.cardContainer}>
      <SetCard size="sm" value={item.c1} />
      <SetCard size="sm" value={item.c2} />
      <div>
        <div className={classes.midDash} />
      </div>
      <SetCard size="sm" value={fifth} />
      <div>
        <div className={classes.midDash} />
      </div>
      <SetCard size="sm" value={item.c3} />
      <SetCard size="sm" value={item.c4} />
    </div>
  );
}

export default memo(UltraSetChatCards);
