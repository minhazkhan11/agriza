import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function AssignViewLearner(props) {
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
  const Heading = [
    {
      height:'maxh52',
      style: "viewtable",
      checkboxselection: "true",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={` ${classes.w100} ${classes.alignitemscenter} ${classes.p1} ${classes.borderradius6px} ${classes.inputpadding} ${classes.inputborder} ${classes.inputplaceholdercolorblack} ${classes.dflex}`}
      >
        <Typography
          variant="h5"
          className={`${classes.fontsize4} ${classes.fw600}`}
        >
          Assign To
        </Typography>

        <div
          className={`${classes.dflex} ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
          ></FormLabel>
          <Select
            labelId="category-label"
            id="state"
            value={selectedCource}
            onChange={handleCourceChange}
            displayEmpty
            className={classes.selectEmpty}
            MenuProps={menuProps}
            variant="outlined"
          >
            <MenuItem disabled value="">
              <em className={classes.defaultselect}>Select Course</em>
            </MenuItem>
            {cources?.map((data, index) => {
              return (
                <MenuItem key={index} value={data.id}>
                  {data.course_name}
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <div
          className={`${classes.dflex}  ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
          ></FormLabel>
          <Select
            labelId="category-label"
            id="state"
            value={selectedBatch}
            onChange={handleBatchChange}
            displayEmpty
            className={classes.selectEmpty}
            MenuProps={menuProps}
            variant="outlined"
          >
            <MenuItem disabled value="">
              <em className={classes.defaultselect}>Select Batch</em>
            </MenuItem>
            {batches?.map((data, index) => {
              return (
                <MenuItem key={index} value={data.id}>
                  {data.batch_name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
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
export default AssignViewLearner;
