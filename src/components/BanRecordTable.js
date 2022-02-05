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

import Loading from "./Loading";
import BanRecordRow from "./BanRecordRow";

const useStyles = makeStyles((theme) => ({
  banRecordTable: {
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

function BanRecordTable({ banRecordData, handleClickUser }) {
  const classes = useStyles();

  if (!banRecordData) {
    return <Loading />;
  }
  if (Object.keys(banRecordData).length === 0) {
    return (
      <Typography style={{ color: grey[400] }}>
        No ban records to display...
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} className={classes.banRecordTable}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Banned by</TableCell>
            <TableCell>Moment of ban</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Ban status</TableCell>
            <TableCell>Last online</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(banRecordData)
            .sort((g1, g2) => g2[1].time - g1[1].time)
            .map((banRecord) => {
              let banRecordProps = banRecord[1];
              return <BanRecordRow banRecordProps={banRecordProps} handleClickUser={handleClickUser} />
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BanRecordTable;
