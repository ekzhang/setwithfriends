import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import makeStyles from "@mui/styles/makeStyles";

import firebase from "../firebase";
import { hasHint, modes } from "../util";

const useStyles = makeStyles(() => ({
  settings: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingInline: 4,
  },
}));

const hintTip =
  "Practice mode where you can get hints to help you find Sets. " +
  "Only available in private games with a single player, and not counted in total stats.";

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
      <RadioGroup
        row
        sx={{ justifyContent: "center" }}
        value={gameMode}
        onChange={handleChangeMode}
      >
        {Object.keys(modes).map((mode) => (
          <Tooltip
            key={mode}
            arrow
            placement="left"
            title={modes[mode].description}
          >
            <FormControlLabel
              value={mode}
              control={<Radio size="small" sx={{ width: 32, height: 32 }} />}
              disabled={userId !== game.host}
              label={modes[mode].name}
              slotProps={{ typography: { variant: "body2" } }}
            />
          </Tooltip>
        ))}
      </RadioGroup>
      {["normal", "setjr"].includes(gameMode) && (
        <Tooltip arrow placement="left" title={hintTip}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={hasHint(game)}
                onChange={toggleHint}
              />
            }
            label="Enable Hints"
            disabled={
              Object.keys(game.users || {}).length > 1 ||
              game.access !== "private"
            }
            slotProps={{ typography: { variant: "body2" } }}
            sx={{ my: 0.25 }}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default GameSettings;
