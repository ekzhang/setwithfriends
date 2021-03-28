import { memo } from "react";

import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import SetCard from "./SetCard";
import User from "./User";
import { conjugateCard, formatTime, modes } from "../util";

const useStyles = makeStyles((theme) => ({
  logEntry: {
    marginBottom: "0.35em",
    padding: "0 12px",
    textAlign: "center",
    background: theme.setFoundEntry,
  },
  logEntryText: {
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
  ultraSetCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function ChatCards({ item, gameMode, startedAt }) {
  const classes = useStyles();

  return (
    <Tooltip arrow placement="left" title={formatTime(item.time - startedAt)}>
      <div className={classes.logEntry}>
        <div className={classes.logEntryText}>
          <Typography variant="subtitle2" style={{ marginRight: "0.2em" }}>
            {modes[gameMode].setType} found by
          </Typography>
          <User
            component={Typography}
            noWrap={true}
            variant="subtitle2"
            id={item.user}
          />
        </div>
        {(gameMode === "normal" || gameMode === "setchain") && (
          <div>
            <SetCard size="sm" value={item.c1} />
            <SetCard size="sm" value={item.c2} />
            <SetCard size="sm" value={item.c3} />
          </div>
        )}
        {gameMode === "ultraset" && (
          <div className={classes.ultraSetCards}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SetCard size="sm" value={item.c1} />
              <SetCard size="sm" value={item.c2} />
            </div>
            <SetCard size="sm" value={conjugateCard(item.c1, item.c2)} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SetCard size="sm" value={item.c3} />
              <SetCard size="sm" value={item.c4} />
            </div>
          </div>
        )}
      </div>
    </Tooltip>
  );
}

export default memo(ChatCards);
