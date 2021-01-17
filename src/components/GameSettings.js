import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

import firebase from "../firebase";

const useStyles = makeStyles(() => ({
  settings: { display: "flex", flexDirection: "column", alignItems: "center" },
}));

const hintTip =
  "Practice mode where you can get hints to help you find Sets. " +
  "Only available in private games with a single player, and not counted in total stats.";

const modeInfo = {
  normal: {
    displayName: "Normal",
    description: "Find 3 cards that form a Set.",
  },
  setchain: {
    displayName: "Set-Chain",
    description: "In every Set, you have to use 1 card from the previous Set.",
  },
  ultraset: {
    displayName: "UltraSet",
    description:
      "Find 4 cards such that the first pair and the second pair form a Set with the same additional card.",
  },
};

function GameSettings({ game, gameId, userId }) {
  const classes = useStyles();

  function handleChangeMode(event) {
    firebase.database().ref(`games/${gameId}/mode`).set(event.target.value);
  }

  function toggleHint() {
    firebase.database().ref(`games/${gameId}/enableHint`).set(!game.enableHint);
  }

  const gameMode = game.mode || "normal";

  return (
    <div className={classes.settings}>
      <RadioGroup row value={gameMode} onChange={handleChangeMode}>
        {["normal", "setchain", "ultraset"].map((mode) => (
          <Tooltip
            key={mode}
            arrow
            placement="left"
            title={modeInfo[mode].description}
          >
            <FormControlLabel
              value={mode}
              control={<Radio />}
              disabled={userId !== game.host}
              label={modeInfo[mode].displayName}
            />
          </Tooltip>
        ))}
      </RadioGroup>
      {gameMode === "normal" && (
        <Tooltip arrow placement="left" title={hintTip}>
          <FormControlLabel
            control={
              <Switch
                checked={
                  game.enableHint &&
                  Object.keys(game.users || {}).length <= 1 &&
                  game.access === "private"
                }
                onChange={toggleHint}
              />
            }
            label="Enable Hints"
            disabled={
              Object.keys(game.users || {}).length > 1 ||
              game.access !== "private"
            }
          />
        </Tooltip>
      )}
    </div>
  );
}

export default GameSettings;
