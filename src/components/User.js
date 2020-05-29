import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";
import { useTheme } from "@material-ui/core/styles";

const colors = {
  red: ["#e57373", "#ef5350"],
  pink: ["#f06292", "#ec407a"],
  purple: ["#ba68c8", "#ab47bc"],
  deepPurple: ["#9575cd", "#7e57c2"],
  indigo: ["#7986cb", "#5c6bc0"],
  blue: ["#64b5f6", "#42a5f5"],
  lightBlue: ["#4fc3f7", "#29b6f6"],
  cyan: ["#4dd0e1", "#26c6da"],
  teal: ["#4db6ac", "#26a69a"],
  green: ["#81c784", "#66bb6a"],
  lightGreen: ["#aed581", "#9ccc65"],
  lime: ["#dce775", "#cddc39"],
  yellow: ["#fff176", "#ffee58"],
  amber: ["#ffd54f", "#ffca28"],
  orange: ["#ffb74d", "#ffa726"],
  deepOrange: ["#ff8a65", "#ff7043"],
  brown: ["#a1887f", "#8d6e63"],
};

function User(props) {
  const theme = useTheme();

  const { id, style, component, render, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  if (loading) {
    return null;
  }
  const Component = component || "span";
  const userEl = (
    <Component
      style={{
        color: colors[user.color][theme.palette.type === "dark" ? 0 : 1],
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
