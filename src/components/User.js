import { useTheme } from "@material-ui/core/styles";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import useFirebaseRef from "../hooks/useFirebaseRef";
import { colors } from "../util";

function User(props) {
  const theme = useTheme();

  const { id, style, component, render, forcePatron, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  if (loading) {
    return null;
  }
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
          fontSize="inherit"
          style={{ marginBottom: "-0.125em", marginRight: "0.1em" }}
        />
      )}
      {user.name}
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
