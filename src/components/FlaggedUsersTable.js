import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";

import User from "./User";
import Loading from "./Loading";
import ElapsedTime from "./ElapsedTime";

const useStyles = makeStyles((theme) => ({
  flaggedUsersTable: {
    display: "flex",
    flexDirection: "column",
    maxHeight: 400,
    marginBottom: theme.spacing(1),
    whiteSpace: "nowrap",
    "& td, & th": {
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 12,
      paddingRight: 12,
    },
    "& svg": {
      display: "block",
    },
    "& th": {
      background: theme.palette.background.panel,
    },
    "& tr": {
      background: theme.profileTable.row,
    },
    "& tr:hover": {
      background: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
}));

function FlaggedUsersTable({ flaggedUserData, handleClickUser }) {
  const classes = useStyles();

  if (!flaggedUserData) {
    return <Loading />;
  }
  if (Object.keys(flaggedUserData).length === 0) {
    return (
      <Typography style={{ color: grey[400] }}>
        No flagged users to display...
      </Typography>
    );
  }

  function compareFlaggedUsers(g1, g2) {
    const g1Online =
      g1[1].connections && Object.keys(g1[1].connections).length > 0;
    const g2Online =
      g2[1].connections && Object.keys(g2[1].connections).length > 0;

    if (g1Online && g2Online) {
      return 0;
    }
    if (g1Online && !g2Online) {
      return -1;
    }
    if (!g1Online && g2Online) {
      return 1;
    }
    return g2[1].lastOnline - g1[1].lastOnline;
  }

  return (
    <TableContainer component={Paper} className={classes.flaggedUsersTable}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Flagged by</TableCell>
            <TableCell>Ban status</TableCell>
            <TableCell>Last online</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(flaggedUserData)
            .sort(compareFlaggedUsers)
            .map((flaggedUser) => {
              let flaggedUserId = flaggedUser[0];
              let flaggedUserProps = flaggedUser[1];

              const isOnline =
                flaggedUserProps.connections &&
                Object.keys(flaggedUserProps.connections).length > 0;

              return (
                <TableRow
                  key={flaggedUserId}
                  onClick={() => handleClickUser(flaggedUserId)}
                >
                  <TableCell>
                    <User id={flaggedUserId} />
                  </TableCell>
                  <TableCell>
                    <User id={flaggedUserProps.flagged} />
                  </TableCell>
                  <TableCell>
                    {flaggedUserProps.banned &&
                    Date.now() < flaggedUserProps.banned
                      ? "Ban active"
                      : flaggedUserProps.banned
                      ? "Ban expired"
                      : "Never banned"}
                  </TableCell>
                  <TableCell>
                    {isOnline ? (
                      "online now"
                    ) : (
                      <ElapsedTime value={flaggedUserProps.lastOnline} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FlaggedUsersTable;
