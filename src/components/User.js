import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";

function User(props) {
  const { id, style, render, ...other } = props;
  const user = useFirebaseRef(`users/${id}`);
  if (!user) {
    return null;
  }
  const userEl = (
    <span style={{ color: user.color, fontWeight: 500, ...style }} {...other}>
      {user.name}
    </span>
  );
  return render ? render(user, userEl) : userEl;
}

export default User;
