import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

import firebase from "../firebase";
import { generateShuffledCards, hasHint, modes } from "../util";

const useStyles = makeStyles(() => ({
  settings: { display: "flex", flexDirection: "column", alignItems: "center" },
}));

const hintTip =
  "Practice mode where you can get hints to help you find Sets. " +
  "Only available in private games with a single player, and not counted in total stats.";

function GameSettings({ game, gameId, userId }) {
  const classes = useStyles();

  function handleChangeMode(event) {
    const newMode = event.target.value;
    firebase.database().ref(`games/${gameId}/mode`).set(newMode);
    firebase.database().ref(`gameData/${gameId}`).update({
      // Deck must be regenerated when changing mode to/from Set Jr
      deck: generateShuffledCards(newMode),
    });
  }

  function toggleHint() {
    firebase.database().ref(`games/${gameId}/enableHint`).set(!game.enableHint);
  }

  const gameMode = game.mode || "normal";

  return (
    <div className={classes.settings}>
      <RadioGroup row value={gameMode} onChange={handleChangeMode}>
        {["normal", "setjr", "setchain", "ultraset"].map((mode) => (
          <Tooltip
            key={mode}
            arrow
            placement="left"
            title={modes[mode].description}
          >
            <FormControlLabel
              value={mode}
              control={<Radio />}
              disabled={userId !== game.host}
              label={modes[mode].name}
            />
          </Tooltip>
        ))}
      </RadioGroup>
      {(gameMode === "normal" || gameMode === "setjr") && (
        <Tooltip arrow placement="left" title={hintTip}>
          <FormControlLabel
            control={<Switch checked={hasHint(game)} onChange={toggleHint} />}
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
