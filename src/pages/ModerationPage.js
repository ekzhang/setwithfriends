import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import firebase from "../firebase";
import InternalLink from "../components/InternalLink";
import FlaggedUsersTable from "../components/FlaggedUsersTable";
import BanRecordTable from "../components/BanRecordTable";
import { UserContext } from "../context";

function ModerationPage() {
  const [tab, setTab] = useState("flagged_users");
  const user = useContext(UserContext);

  const [flaggedUsers, setFlaggedUsers] = useState(null);
  const [banRecords, setBanRecords] = useState(null);
  const [redirect, setRedirect] = useState(null);

  // Whether to load data.
  const permission = user.admin;

  useEffect(() => {
    if (!permission) return null;
    const query = firebase
      .database()
      .ref(`/users/`)
      .orderByChild("flagged")
      .startAt(true)
    const update = (snapshot) => {
      query.off("value", update);
      setFlaggedUsers(snapshot.val() ?? {});
    };
    query.on("value", update);
    return () => {
      query.off("value", update);
    };
  }, [permission]);

  useEffect(() => {
    if (!permission) return null;
    const query = firebase
      .database()
      .ref(`/banRecords/`)
      .orderByChild(`time`)
    const update = (snapshot) => {
      query.off("value", update);
      setBanRecords(snapshot.val() ?? {});
    };
    query.on("value", update);
    return () => {
      query.off("value", update);
    };
  }, [permission]);

  if (!permission) {
    return <Redirect to={'/permissiondenied'} />;
  }

  const handleClickUser = (userId) => {
    setRedirect(`/profile/${userId}`);
  };

  if (redirect) {
    return <Redirect push to={redirect} />;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Moderation tools
      </Typography>
      <Tabs
        value={tab}
        onChange={(event, value) => setTab(value)}
        variant="fullWidth"
        style={{ margin: "12px auto -12px auto", maxWidth: 720 }}
      >
        <Tab label="Recently banned users" value="recent_bans" />
        <Tab label="Flagged users" value="flagged_users" />
      </Tabs>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        {tab === "recent_bans" ? <BanRecordTable banRecordData={banRecords} handleClickUser={handleClickUser} /> : null}
        {tab === "flagged_users" ? <FlaggedUsersTable flaggedUserData={flaggedUsers} handleClickUser={handleClickUser} /> : null}
      </Paper>
      <Typography
        variant="body1"
        align="center"
        style={{ marginTop: 12, paddingBottom: 12 }}
      >
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default ModerationPage;
