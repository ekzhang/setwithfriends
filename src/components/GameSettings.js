import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Box } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

import firebase from "../firebase";

const useStyles = makeStyles((theme) => ({
  modeSelection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
}));

function GameSettings({ game, gameId, userId }) {
  const classes = useStyles();

  function handleChangeMode(event) {
    firebase.database().ref(`games/${gameId}/mode`).set(event.target.value);
  }

  function toggleHint() {
    firebase.database().ref(`games/${gameId}/enableHint`).set(!game.enableHint);
  }

  return (
    <Box>
      <Box>
        <RadioGroup
          className={classes.modeSelection}
          value={game.mode}
          onChange={handleChangeMode}
          row
        >
          {[
            ["normal", "Normal"],
            ["ultraset", "UltraSet"],
            ["setchain", "Set-Chain"],
          ].map(([value, label]) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              disabled={userId !== game.host}
              label={label}
            />
          ))}
        </RadioGroup>
      </Box>
      <Box pl={2}>
        {game.mode === "normal" && (
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
            label="Enable Hint"
            disabled={
              Object.keys(game.users || {}).length > 1 ||
              game.access !== "private"
            }
          />
        )}
      </Box>
    </Box>
  );
}

export default GameSettings;
