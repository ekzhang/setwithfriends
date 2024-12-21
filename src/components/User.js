import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useNavigate } from "react-router-dom";

import useFirebaseRef from "../hooks/useFirebaseRef";
import useStats from "../hooks/useStats";
import { colors } from "../util";

const useStyles = makeStyles((theme) => ({
  patronIcon: {
    cursor: "pointer",
    "&:hover": {
      filter: `drop-shadow(0.1rem 0rem 0.2rem)`,
    },
  },
  rating: {
    display: "inline-block",
    width: "3em",
    marginRight: "0.5em",
    borderRadius: "5px",
    color: "white",
    backgroundColor: "dodgerblue",
    fontSize: "1em",
    textAlign: "center",
  },
}));

function User({
  id,
  style,
  component,
  render,
  forcePatron,
  showRating,
  ...other
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const classes = useStyles();

  const [user, loading] = useFirebaseRef(`users/${id}`);
  const [stats, loadingStats] = useStats(showRating ? id : null);

  if (loading) {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/donate");
  };

  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        color: colors.hasOwnProperty(user.color)
          ? colors[user.color][theme.palette.mode === "dark" ? 100 : 900]
          : "inherit",
        fontWeight: 500,
        ...style,
      }}
      {...other}
    >
      {showRating && (
        <span className={classes.rating}>
          {loadingStats ? "⋯" : Math.round(stats[showRating].rating)}
        </span>
      )}
      {(user.patron || forcePatron) && (
        <WhatshotIcon
          className={classes.patronIcon}
          onClick={handleClick}
          fontSize="inherit"
          style={{
            display: "inline",
            position: "relative",
            left: "-0.1em",
            top: "0.15em",
            color: "inherit",
          }}
        />
      )}
      <span>{user.name}</span>
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
