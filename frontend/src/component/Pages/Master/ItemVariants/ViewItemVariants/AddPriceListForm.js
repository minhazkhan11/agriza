import React from "react";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function AddPriceListForm(props) {
  const classes = useStyles();
  const { columns, filteredRows } = props;

  const Heading = [
    {
      height: "maxh52",
      style: "viewtable",
      rowheight : "120",
    },
  ];
  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.bgwhite} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}`}
      >
        <TableView columns={columns} rows={filteredRows} Heading={Heading} hideFooter={true}/>
      </div>
    </>
  );
}
export default AddPriceListForm;
