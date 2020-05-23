import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";

function User(props) {
  const { id, style, render, ...other } = props;
  const [user, loading] = useFirebaseRef(`users/${id}`);
  if (loading) {
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
