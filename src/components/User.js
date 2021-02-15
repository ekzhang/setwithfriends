import { useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { useHistory } from "react-router-dom";

import useFirebaseRef from "../hooks/useFirebaseRef";
import { colors } from "../util";

function User(props) {
  const theme = useTheme();
  const history = useHistory();

  const { id, style, component, render, forcePatron, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  const [patronIconIsActive, setPatronIconIsActive] = useState(false);

  if (loading) {
    return null;
  }

  const userNameColor = colors.hasOwnProperty(user.color)
    ? colors[user.color][theme.palette.type === "dark" ? 100 : 900]
    : "inherit";

  const patronIconColor = colors.hasOwnProperty(user.color)
    ? colors[user.color][
        theme.palette.type === "dark"
          ? patronIconIsActive
            ? 400
            : 100
          : patronIconIsActive
          ? 400
          : 900
      ]
    : "inherit";

  const handleClick = (e) => {
    e.preventDefault();
    history.push("/donate");
  };

  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        fontWeight: 500,
        ...style,
      }}
      {...other}
    >
      {(user.patron || forcePatron) && (
        <WhatshotIcon
          onMouseEnter={() => setPatronIconIsActive(true)}
          onMouseLeave={() => setPatronIconIsActive(false)}
          onClick={handleClick}
          fontSize="inherit"
          style={{
            display: "inline",
            position: "relative",
            left: "-0.1em",
            top: "0.15em",
            color: patronIconColor,
            cursor: "pointer",
          }}
        />
      )}
      <span style={{ color: userNameColor }}>{user.name}</span>
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
