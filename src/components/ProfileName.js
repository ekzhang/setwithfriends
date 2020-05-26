import React, { memo } from "react";

import Typography from "@material-ui/core/Typography";
import indigo from "@material-ui/core/colors/indigo";
import green from "@material-ui/core/colors/green";

import ElapsedTime from "./ElapsedTime";
import User from "./User";

function ProfileName({ userId }) {
  return (
    <User
      id={userId}
      render={(user, userEl) => {
        const isOnline =
          user.connections && Object.keys(user.connections).length > 0;
        return (
          <section>
            <Typography variant="h4" gutterBottom>
              {userEl}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Last seen:{" "}
              <span
                variant="body2"
                style={{ color: `${isOnline ? green[800] : indigo[600]}` }}
              >
                {isOnline ? (
                  "online now"
                ) : (
                  <ElapsedTime value={user.lastOnline} />
                )}
              </span>
            </Typography>
          </section>
        );
      }}
    />
  );
}

export default memo(ProfileName);
