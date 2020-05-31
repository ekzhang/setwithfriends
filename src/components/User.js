import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";
import { useTheme } from "@material-ui/core/styles";

import { colors } from "../util";

function User(props) {
  const theme = useTheme();

  const { id, style, component, render, shade, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  if (loading) {
    return null;
  }
  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        color: colors[user.color]
          ? colors[user.color][theme.palette.type === "dark" ? 200 : 800]
          : user.color,
        fontWeight: 500,
        ...style,
      }}
      {...other}
    >
      {user.name}
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
