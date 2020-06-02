import React, { memo } from "react";

import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";

import ElapsedTime from "./ElapsedTime";
import User from "./User";

function ProfileName({ userId }) {
  const theme = useTheme();

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
                style={{
                  color: `${
                    isOnline
                      ? theme.palette.success.main
                      : theme.palette.primary.main
                  }`,
                }}
              >
                <strong>
                  {isOnline ? (
                    "online now"
                  ) : (
                    <ElapsedTime value={user.lastOnline} />
                  )}
                </strong>
              </span>
            </Typography>
          </section>
        );
      }}
    />
  );
}

export default memo(ProfileName);
