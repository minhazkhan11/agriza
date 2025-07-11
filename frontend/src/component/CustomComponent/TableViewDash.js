import React, { useState, useEffect } from "react";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import NoDataFoundImage from "../images/commonicon/nodatafoundimage.jpg";
import useStyles from "../../styles";

function CustomTableView({ columns, rows, Heading, onCheckboxClick }) {
  function CustomNoRowsOverlay() {
    return (
      <GridOverlay>
        <img src={NoDataFoundImage} alt="img" />
      </GridOverlay>
    );
  }

  const classes = useStyles();

  const handleSelectionModelChange = (newSelection) => {
    onCheckboxClick(newSelection); // Pass newSelection directly
  };

  return (
    <>
      {Heading?.map((data) => (
        <div
          className={`${classes.w100} ${classes[data.height]} ${
            classes[data.style]
          }`}
          key={data.style}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            // autoHeight
            hideFooter
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? "Mui-even"
                : "Mui-odd"
            }
            checkboxSelection={data.checkboxselection}
            pageSize={100}
            disableSelectionOnClick
            onSelectionModelChange={handleSelectionModelChange} // Handle checkbox selection change
          />
        </div>
      ))}
    </>
  );
}

export default CustomTableView;
