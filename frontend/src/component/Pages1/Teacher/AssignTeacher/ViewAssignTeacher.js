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

function AssignViewTeacher(props) {
  const classes = useStyles();
  const {
    isCourseDropdownOpen,
    handleCourseDropdownOpen,
    handleCourseDropdownClose,
    selectedCourses,
    handleCourseChange,
    menuProps,
    cources,
    isBatchDropdownOpen,
    handleBatchDropdownOpen,
    handleBatchDropdownClose,
    selectedBatch,
    handleBatchChange,
    batches,
    columns,
    filteredRows,
    handleCheckboxClick,
  } = props;

  const style = [
    {
      height: "h61vh",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={` ${classes.w100} ${classes.bgwhite} ${classes.inputdropdowniconcolorblack} ${classes.alignitemscenter} ${classes.p1} ${classes.borderradius6px} ${classes.inputpadding} ${classes.inputborder} ${classes.inputplaceholdercolorblack} ${classes.dflex}`}
      >
        <Typography className={`${classes.fontsize4} ${classes.fw600}`}>
          Assign To
        </Typography>

        <div
          className={`${classes.dflex}  ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
          > Courses *</FormLabel>

          <Select
            multiple
            open={isCourseDropdownOpen}
            onOpen={handleCourseDropdownOpen}
            onClose={handleCourseDropdownClose}
            value={selectedCourses}
            onChange={handleCourseChange}
            displayEmpty
            variant="outlined"
            inputProps={{ name: "courses", id: "courses-select" }}
            MenuProps={menuProps}
          >
            {selectedCourses.length === 0 && (
              <MenuItem disabled value="">
                <em>Select Course</em>
              </MenuItem>
            )}
            {cources?.map((data, index) => (
              <MenuItem key={index} value={data.id}>
                {data.course_name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div
          className={`${classes.dflex}  ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
          > Batchs *</FormLabel>
          <Select
            multiple
            open={isBatchDropdownOpen}
            onOpen={handleBatchDropdownOpen}
            onClose={handleBatchDropdownClose}
            value={selectedBatch}
            onChange={handleBatchChange}
            displayEmpty
            variant="outlined"
            inputProps={{ name: "batches", id: "batches-select" }}
            MenuProps={menuProps}
          >
            {selectedBatch.length === 0 && (
              <MenuItem disabled value="">
                <em>Select Batch</em>
              </MenuItem>
            )}
            {batches?.map((data, index) => (
              <MenuItem key={index} value={data.id}>
                {data.batch_name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div
        className={`${classes.bgwhite}  ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}`}
      >
        <TableView
          columns={columns}
          rows={filteredRows}
          Heading={style}
          onCheckboxClick={handleCheckboxClick}
        />
      </div>
    </>
  );
}
export default AssignViewTeacher;
