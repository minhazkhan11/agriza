import React from "react";
import useStyles from "../../styles";
import { useState, useEffect } from "react";
import { decryptData } from "../../crypto";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
function LearnerDetails(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    menuProps,
    productClassId,
    selectedProductClass,
    handleClassChange,
    productCategory,
    selectedProductCategory,
    handleProductCategoryChange,
    brand,
    selectedBrand,
    handleBrandChange,
    marketer,
    selectedMarketer,
    handleMarketerChange,
  } = props;

  let searchLearner = () => {
    navigate(
      `/admin/assignlearner/${selectedProductClass}/${selectedProductCategory}`
    );
  };

  return (
    <>
      <div
        className={` ${classes.w100} ${classes.bgblue} ${classes.inputdropdowniconcolor}  ${classes.alignitemscenter}   ${classes.mt1}  ${classes.p1}   ${classes.borderradius6px}   ${classes.inputpadding} ${classes.inputborderwhite}  ${classes.inputplaceholdercolor}   ${classes.dflex}`}
      >
        <Typography variant="h6" className={`${classes.textcolorwhite} `}>
          Filters
        </Typography>

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
            value={selectedProductClass}
            onChange={handleClassChange}
            displayEmpty
            // className={classes.selectEmpty}
            MenuProps={menuProps}
            variant="outlined"
          >
            <MenuItem disabled value="">
              <em className={classes.defaultselect}>Class</em>
            </MenuItem>
            {productClassId?.map((data, index) => {
              return (
                <MenuItem value={data.class_name} key={index}>
                  {data.class_name}
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
            labelId="batch-label"
            id="batch"
            value={selectedProductCategory}
            onChange={handleProductCategoryChange}
            displayEmpty
            className={classes.selectEmpty}
            MenuProps={menuProps}
            variant="outlined"
          >
            <MenuItem disabled value="">
              <em className={classes.defaultselect}>Category</em>
            </MenuItem>
            {productCategory?.map((data, index) => {
              return (
                <MenuItem key={index} value={data.category_name}>
                  {data.category_name}
                </MenuItem>
              );
            })}
          </Select>
        </div>

        {brand && (
          <div
            className={`${classes.dflex}  ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
            ></FormLabel>

            <Select
              labelId="batch-label"
              id="batch"
              value={selectedBrand}
              onChange={handleBrandChange}
              displayEmpty
              className={classes.selectEmpty}
              MenuProps={menuProps}
              variant="outlined"
            >
              <MenuItem disabled value="">
                <em className={classes.defaultselect}>Brand</em>
              </MenuItem>
              {brand?.map((data, index) => {
                return (
                  <MenuItem key={index} value={data.brand_name}>
                    {data.brand_name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        )}
        {marketer && (
          <div
            className={`${classes.dflex}  ${classes.mx0_5} ${classes.flexdirectioncolumn} ${classes.w24}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
        ${classes.lineheight}`}
            ></FormLabel>

            <Select
              labelId="batch-label"
              id="batch"
              value={selectedMarketer}
              onChange={handleMarketerChange}
              displayEmpty
              className={classes.selectEmpty}
              MenuProps={menuProps}
              variant="outlined"
            >
              <MenuItem disabled value="">
                <em className={classes.defaultselect}>Marketer</em>
              </MenuItem>
              {marketer?.map((data, index) => {
                return (
                  <MenuItem key={index} value={data.marketer_name}>
                    {data.marketer_name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        )}

        {/* <Button
          variant="contained"
          color="primary"
          className={`${classes.whitebtn}  ${classes.mx0_5}`}
          onClick={searchLearner}
        >
          Search Learners
        </Button> */}
      </div>
    </>
  );
}
export default LearnerDetails;
