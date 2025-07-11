import React, { useState } from "react";
import useStyles from "../../../../../styles";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

function PriceUpdateForm({
  formValues,
  crossPriceError,
  setFormValues,
  setCrossPriceError,
}) {
  const classes = useStyles();

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (mrpName, fieldName, value) => {
    const price = parseFloat(value) || 0;
    const mrp = parseFloat(formValues[mrpName]) || 0;
    const sellingPrice = parseFloat(
      fieldName === "ex_selling_price" ? value : formValues.ex_selling_price
    );

    let percentage = 0;
    if (mrp > 0) {
      percentage = ((1 - price / mrp) * 100).toFixed(2);
    }

    // Cross price validation
    if (fieldName === "ex_cross_price") {
      if (price <= sellingPrice) {
        setCrossPriceError("Cross price must be greater than selling price");
      } else {
        setCrossPriceError("");
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: price,
      [`${fieldName}_percent`]: percentage,
    }));
  };

  const handlePercentChange = (mrpName, fieldName, value) => {
    const percent = parseFloat(value) || 0;
    const mrp = parseFloat(formValues[mrpName]) || 0;

    let price = 0;
    if (mrp > 0) {
      price = (mrp * (1 - percent / 100)).toFixed(2);
    }

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: price,
      [`${fieldName}_percent`]: percent,
    }));
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh62} ${classes.w100} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.px2}`}
      >
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w100}  ${classes.mt0_5}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
          >
            Item Delivery Type
          </FormLabel>

          <FormGroup
            row
            className={`${classes.ml1} ${classes.tablecheckbox}`} // You can rename this if needed
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues?.delivery_ex || false}
                  onChange={(e) =>
                    handleInputChange("delivery_ex", e.target.checked)
                  }
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  disabled
                />
              }
              label="EX"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues?.delivery_for || false}
                  onChange={(e) =>
                    handleInputChange("delivery_for", e.target.checked)
                  }
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  disabled
                />
              }
              label="FOR"
            />
          </FormGroup>
        </div>

        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w50}  ${classes.mt0_5}`}
        >
          <FormLabel
            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.mr1} ${classes.lineheight}`}
          >
            Follow Up Date <span className={classes.textcolorred}>*</span>
          </FormLabel>

          <TextField
            value={
              formValues.effective_date
                ? new Date(formValues.effective_date).toLocaleDateString(
                    "en-CA"
                  )
                : ""
            }
            onChange={(e) =>
              handleInputChange("effective_date", e.target.value)
            }
            name="follow_up_date"
            type="date"
            variant="outlined"
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
          />
        </div>
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
        >
          {formValues?.delivery_ex && (
            <>
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.w100}`}
              >
                <Typography
                  className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  EX
                </Typography>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w100}  ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MRP (Rs / Primary unit){" "}
                  <span className={classes.textcolorred}>*</span> (Price
                  Inclusive Of GST)
                </FormLabel>
                <TextField
                  value={formValues.ex_mrp}
                  onChange={(e) => handleInputChange("ex_mrp", e.target.value)}
                  type="text"
                  variant="outlined"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  required
                  placeholder="Enter MRP"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49} ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Selling Price (Rs / Primary unit)
                </FormLabel>
                <TextField
                  value={formValues.ex_selling_price}
                  onChange={(e) =>
                    handlePriceChange(
                      "ex_mrp",
                      "ex_selling_price",
                      e.target.value
                    )
                  }
                  type="text"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  variant="outlined"
                  required
                  placeholder="Enter Price"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49} ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Selling Price Margin %{" "}
                </FormLabel>
                <TextField
                  value={formValues.ex_selling_price_percent}
                  onChange={(e) =>
                    handlePercentChange(
                      "ex_mrp",
                      "ex_selling_price",
                      e.target.value
                    )
                  }
                  type="text"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  variant="outlined"
                  required
                  placeholder="Enter %"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cross Price (Rs / Primary unit)
                </FormLabel>
                <TextField
                  value={formValues?.ex_cross_price}
                  onChange={(e) =>
                    handlePriceChange(
                      "ex_mrp",
                      "ex_cross_price",
                      e.target.value
                    )
                  }
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter Price"
                  error={Boolean(crossPriceError)}
                  helperText={crossPriceError}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cross Price Margin %
                </FormLabel>
                <TextField
                  value={formValues.ex_cross_price_percent}
                  onChange={(e) =>
                    handlePercentChange(
                      "ex_mrp",
                      "ex_cross_price",
                      e.target.value
                    )
                  }
                  type="text"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  variant="outlined"
                  required
                  placeholder="Enter %"
                />
              </div>
            </>
          )}

          {formValues?.delivery_for && (
            <>
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}  ${classes.w100}`}
              >
                <Typography
                  className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  FOR
                </Typography>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w100}  ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MRP (Rs / Primary unit){" "}
                  <span className={classes.textcolorred}>*</span> (Price
                  Inclusive Of GST)
                </FormLabel>
                <TextField
                  value={formValues.for_mrp}
                  onChange={(e) => handleInputChange("for_mrp", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter MRP"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49} ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Selling Price (Rs / Primary unit)
                </FormLabel>
                <TextField
                  value={formValues.for_selling_price}
                  onChange={(e) =>
                    handlePriceChange(
                      "for_mrp",
                      "for_selling_price",
                      e.target.value
                    )
                  }
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter Price"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49} ${classes.mt0_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Selling Price Margin %{" "}
                </FormLabel>
                <TextField
                  value={formValues.for_selling_price_percent}
                  onChange={(e) =>
                    handlePercentChange(
                      "for_mrp",
                      "for_selling_price",
                      e.target.value
                    )
                  }
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter %"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cross Price (Rs / Primary unit)
                </FormLabel>
                <TextField
                  value={formValues?.for_cross_price}
                  onChange={(e) =>
                    handlePriceChange(
                      "for_mrp",
                      "for_cross_price",
                      e.target.value
                    )
                  }
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter Price"
                  error={Boolean(crossPriceError)}
                  helperText={crossPriceError}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cross Price Margin %
                </FormLabel>
                <TextField
                  value={formValues.for_cross_price_percent}
                  onChange={(e) =>
                    handlePercentChange(
                      "for_mrp",
                      "for_cross_price",
                      e.target.value
                    )
                  }
                  type="text"
                  variant="outlined"
                  required
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter %"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default PriceUpdateForm;
