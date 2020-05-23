import React from "react";

import useFirebaseRef from "../hooks/useFirebaseRef";

function User(props) {
  const { id, style, ...other } = props;
  const user = useFirebaseRef(`users/${id}`);
  return user ? (
    <span style={{ color: user.color, fontWeight: 500, ...style }} {...other}>
      {user.name}
    </span>
  ) : null;
}

export default User;
