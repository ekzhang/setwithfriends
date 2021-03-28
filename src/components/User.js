import { useHistory } from "react-router-dom";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import useFirebaseRef from "../hooks/useFirebaseRef";
import { colors } from "../util";

const useStyles = makeStyles((theme) => ({
  patronIcon: {
    cursor: "pointer",
    "&:hover": {
      filter: `drop-shadow(0.1rem 0rem 0.2rem)`,
    },
  },
}));

function User(props) {
  const theme = useTheme();
  const history = useHistory();

  const { id, style, component, render, forcePatron, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);

  const classes = useStyles();

  if (loading) {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault();
    history.push("/donate");
  };

  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        color: colors.hasOwnProperty(user.color)
          ? colors[user.color][theme.palette.type === "dark" ? 100 : 900]
          : "inherit",
        fontWeight: 500,
        ...style,
      }}
      {...other}
    >
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
