import SecurityIcon from "@mui/icons-material/Security";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import useFirebaseRef from "../hooks/useFirebaseRef";
import useStats from "../hooks/useStats";
import { colors } from "../util";

const useStyles = makeStyles(() => ({
  inlineIcon: {
    fontSize: "inherit",
    display: "inline",
    position: "relative",
    left: "-0.1em",
    top: "0.15em",
    color: "inherit",
  },
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
  showIcon,
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

  const handlePatronClick = (e) => {
    e.preventDefault();
    navigate("/donate");
  };

  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        color: Object.hasOwn(colors, user.color)
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
      {showIcon &&
        (user.admin ? (
          // Moderator icon takes precedence over patron icon.
          <SecurityIcon className={classes.inlineIcon} />
        ) : user.patron || forcePatron ? (
          <WhatshotIcon
            className={clsx(classes.inlineIcon, classes.patronIcon)}
            onClick={handlePatronClick}
          />
        ) : null)}
      <span>{user.name}</span>
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
