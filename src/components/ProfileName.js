import React, { memo } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import indigo from "@material-ui/core/colors/indigo";
import green from "@material-ui/core/colors/green";

import ElapsedTime from "./ElapsedTime";
import User from "./User";

function ProfileName({ userId }) {
  console.log("profile", userId);
  return (
    <User
      id={userId}
      render={(user, userEl) => {
        const isOnline =
          user.connections && Object.keys(user.connections).length > 0;
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" gutterBottom>
              {userEl}
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Box mr={1} display="inline">
                <Typography variant="body2" mr={1} style={{ color: "black" }}>
                  Last seen:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                style={{ color: `${isOnline ? green[600] : indigo[600]}` }}
              >
                {isOnline ? (
                  "online now"
                ) : (
                  <ElapsedTime value={user.lastOnline}></ElapsedTime>
                )}
              </Typography>
            </div>
          </div>
        );
      }}
    ></User>
  );
}
export default memo(ProfileName);
