import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import useStyles from "../../../../styles";
import "react-toastify/dist/ReactToastify.css";
import TableView from "../../../CustomComponent/TableView";
import ImportFromQuestionBankSearch from "./ImportFromQuestionBankSearch(Quiz)";

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function ImportFromQuestionBank() {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
    },
  ];
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const columns = [
    {
      field: "questionslists",
      headerName: "Questions Lists",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
        field: "action",
        headerName: "Action",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        sortable: true,
        disableColumnMenu: true,
        minWidth: 100,
        autoPageSize: false,
        renderCell: () => {
          return (
            <div
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
            >
                <FormControlLabel
        control={<GreenCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />}
      />
            </div>
          );
        },
      },
  ];

  const rows = [
    {
      id: 1,
      questionslists: "Q.1) Blatant is related to ‘Open ’ in  the same way as ‘Secret’ is related to ‘--------’",
    },
    {
      id: 2,
      questionslists: "Q.2) Blatant is related to ‘Open ’ in  the same way as ‘Secret’ is related to ‘--------’",
    },
  ];
  return (
    <>
      <div
        className={`${classes.mt1} ${classes.py2} ${classes.px1_5} ${classes.bgwhite} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <ImportFromQuestionBankSearch />
        <TableView columns={columns} rows={rows} Heading={style}/>
        <div className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}>
            <Button
              // onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
      </div>
    </>
  );
}
export default ImportFromQuestionBank;
