import { memo } from "react";

import SetCard from "./SetCard";

function UltraSetChatCards({ item }) {
  let fifth = "";
  for (let i = 0; i < 4; i++) {
    let mod = item.c1.charCodeAt(i) + item.c2.charCodeAt(i);
    fifth += String.fromCharCode(48 + ((3 - (mod % 3)) % 3));
  }
  return (
    <div>
      <SetCard size="sm" value={item.c1} />
      <SetCard size="sm" value={item.c2} />
      &mdash;
      <SetCard size="sm" value={fifth} />
      &mdash;
      <SetCard size="sm" value={item.c3} />
      <SetCard size="sm" value={item.c4} />
    </div>
  );
}

export default memo(UltraSetChatCards);
