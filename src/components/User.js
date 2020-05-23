import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";

function User(props) {
  const { id, style, component, render, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  if (loading) {
    return null;
  }
  const Component = component || "span";
  const userEl = (
    <Component
      style={{ color: user.color, fontWeight: 500, ...style }}
      {...other}
    >
      {user.name}
    </Component>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
