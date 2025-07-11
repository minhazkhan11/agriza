import React, { useState, useEffect } from "react";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";


import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { decryptData } from "../../../../crypto";

function ViewAssignProductUpdatePrice(props) {
  const classes = useStyles();
  const {
    selectedCource,
    handleCourceChange,
    menuProps,
    cources,
    selectedBatch,
    handleBatchChange,
    batches,
    columns,
    filteredRows,
    handleCheckboxClick,
    handleStatus,
  } = props;

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const Heading = [
    {
      height: "maxh52",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];
  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.bgwhite} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}`}
      >
        <TableView
          columns={columns}
          rows={filteredRows}
          Heading={Heading}
          onCheckboxClick={handleCheckboxClick}
        />
      </div>
    </>
  );
}
export default ViewAssignProductUpdatePrice;
