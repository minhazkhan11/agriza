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
import PageHeader from "../../../PageHeader";

function AddVariantPriceRegular({
  handlePopUp,
  unit,
  setVariantsFormDetails,
  handleClosePopUp,
}) {
  const classes = useStyles();

  const [crossPriceError, setCrossPriceError] = useState({
    ex_cross_price: "",
    for_cross_price: "",
  });

  const [formValues, setFormValues] = useState({
    primary_unit_id: "",
    primary_quantity: "",
    secondary_unit_id: "",
    secondary_quantity: "",
    covering_unit_id: "",
    covering_quantity: "",
    ex_mrp: "",
    ex_selling_price: "",
    ex_selling_price_percent: "",
    ex_cross_price: "",
    ex_cross_price_percent: "",
    for_mrp: "",
    for_selling_price: "",
    for_selling_price_percent: "",
    for_cross_price: "",
    for_cross_price_percent: "",
    effective_date: "",
    delivery_ex: true,
    delivery_for: false,
  });

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (mrpName, fieldName, value) => {
    const price = parseFloat(value) || 0;
    const mrp = parseFloat(formValues[mrpName]);
    const sellingPrice = parseFloat(
      fieldName === "ex_selling_price" ? value : formValues.ex_selling_price
    );
    const ForsellingPrice = parseFloat(
      fieldName === "for_selling_price" ? value : formValues.for_selling_price
    );

    let percentage = 0;
    if (mrp > 0) {
      percentage = ((1 - price / mrp) * 100).toFixed(2);
    }

    // Set error for the respective field
    if (fieldName === "ex_cross_price" && price <= sellingPrice) {
      setCrossPriceError((prev) => ({
        ...prev,
        ex_cross_price: "Cross price must be greater than selling price",
      }));
    } else if (fieldName === "ex_cross_price") {
      setCrossPriceError((prev) => ({ ...prev, ex_cross_price: "" }));
    }

    if (fieldName === "for_cross_price" && price <= ForsellingPrice) {
      setCrossPriceError((prev) => ({
        ...prev,
        for_cross_price: "FOR Cross price must be greater than selling price",
      }));
    } else if (fieldName === "for_cross_price") {
      setCrossPriceError((prev) => ({ ...prev, for_cross_price: "" }));
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

  const Heading = [
    {
      id: 1,
      mainheading: "Set Regular Price",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: undefined,
      addbtnicon: undefined,
      addbtnstyle: undefined,
    },
  ];

  const handleSubmit = () => {
    // Extract values from form
    const { primary_unit_id, ex_mrp } = formValues;

    // --- Basic Validation ---
    if (!primary_unit_id) {
      toast.error("Please select a Primary Unit.");
      return;
    }

        if (!formValues.effective_date) {
      toast.error("Please select a Effective Date.");
      return;
    }

    if (!ex_mrp || isNaN(parseFloat(ex_mrp)) || parseFloat(ex_mrp) <= 0) {
      toast.error("Please enter a valid MRP (Rs / Primary Unit).");
      return;
    }

    setVariantsFormDetails((prev) =>
      prev.map((variant) => ({
        ...variant,
        primary_unit_id: formValues.primary_unit_id,
        primary_quantity: formValues.primary_quantity,
        secondary_unit_id: formValues.secondary_unit_id,
        secondary_quantity: formValues.secondary_quantity,
        covering_unit_id: formValues.covering_unit_id,
        covering_quantity: formValues.covering_quantity,
        item_delivery_type: formValues.item_delivery_type,
        ex_mrp: formValues.ex_mrp,
        ex_selling_price: formValues.ex_selling_price,
        ex_cross_price: formValues.ex_cross_price,
        ex_selling_price_percent: formValues.ex_selling_price_percent,
        ex_cross_price_percent: formValues.ex_cross_price_percent,
        for_mrp: formValues.for_mrp,
        for_selling_price: formValues.for_selling_price,
        for_selling_price_percent: formValues.for_selling_price_percent,
        for_cross_price: formValues.for_cross_price,
        for_cross_price_percent: formValues.for_cross_price_percent,
        delivery_ex: formValues.delivery_ex,
        delivery_for: formValues.delivery_for,
        effective_date: formValues.effective_date,
      }))
    );
    handlePopUp(); // Close modal
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.w50} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.p1} ${classes.px2}`}
      >
        <PageHeader Heading={Heading} />
        <div
          className={` ${classes.flexdirectioncolumn} ${classes.pagescroll}  ${classes.maxh67} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.mt1} ${classes.p1} ${classes.px2}`}
        >
          <div
            className={`${classes.w100} ${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Primary unit (Smallest)<span className={classes.textcolorred}>*</span>
              </FormLabel>
              <Autocomplete
                id="state-autocomplete"
                options={unit || []}
                value={
                  unit.find((u) => u.id === formValues.primary_unit_id) || null
                }
                onChange={(e, newValue) => {
                  if (newValue) {
                    handleInputChange("primary_unit_id", newValue.id);
                  } else {
                    // Clear both primary and secondary if primary is cleared
                    setFormValues((prev) => ({
                      ...prev,
                      primary_unit_id: "",
                      secondary_unit_id: "", // Clear secondary unit
                      covering_unit_id: "", // Clear covering unit
                    }));
                  }
                }}
                getOptionLabel={(option) => option.unit_name}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type to pick..."
                    variant="outlined"
                    {...params}
                  />
                )}
                selectOnFocus
                openOnFocus
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Secondary unit
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={unit || []}
                value={
                  unit.find((u) => u.id === formValues.secondary_unit_id) ||
                  null
                }
                onChange={(e, newValue) => {
                  if (newValue) {
                    handleInputChange("secondary_unit_id", newValue.id);
                  } else {
                    // Clear both primary and secondary if primary is cleared
                    setFormValues((prev) => ({
                      ...prev,
                      secondary_unit_id: "", // Clear secondary unit
                      covering_unit_id: "", // Clear covering unit
                    }));
                  }
                }}
                getOptionLabel={(option) => option.unit_name}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type to pick..."
                    variant="outlined"
                    {...params}
                  />
                )}
                selectOnFocus
                openOnFocus
                // disabled={!variantsFormDetails[index]?.primary_unit_id}
              />
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Covering unit
              </FormLabel>

              <Autocomplete
                id="state-autocomplete"
                options={[{ id: "", unit_name: "NA" }, ...unit]}
                value={
                  unit.find((u) => u.id === formValues.covering_unit_id) || null
                }
                onChange={(e, newValue) =>
                  handleInputChange(
                    "covering_unit_id",
                    newValue ? newValue.id : ""
                  )
                }
                getOptionLabel={(option) => option.unit_name}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type to pick..."
                    variant="outlined"
                  />
                )}
                selectOnFocus
                openOnFocus
                // disabled={!variantsFormDetails[index]?.secondary_unit_id}
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}  ${classes.w100}`}
            >
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w49}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w45}`}
                >
                  {formValues?.secondary_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Primary Quantity
                      </FormLabel>
                      <div
                        className={`${classes.dflex} ${classes.alignitemscenter}`}
                      >
                        <TextField
                          className={`${classes.w90} ${classes.mr0_5}`}
                          value={formValues.primary_quantity}
                          onChange={(e) =>
                            handleInputChange(
                              "primary_quantity",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />

                        {
                          unit.find(
                            (sub) => sub.id === formValues?.primary_unit_id
                          )?.unit_name
                        }
                      </div>
                    </>
                  )}
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                >
                  {formValues?.secondary_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        .
                      </FormLabel>
                      <span> =</span>
                    </>
                  )}
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w45}`}
                >
                  {formValues?.secondary_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Secondary Quantity
                      </FormLabel>
                      <div
                        className={`${classes.dflex} ${classes.alignitemscenter}`}
                      >
                        <TextField
                          className={`${classes.w90} ${classes.mr0_5}`}
                          value={formValues.secondary_quantity}
                          onChange={(e) =>
                            handleInputChange(
                              "secondary_quantity",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />
                        {
                          unit.find(
                            (sub) => sub.id === formValues?.secondary_unit_id
                          )?.unit_name
                        }
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w49}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w45}`}
                >
                  {formValues?.covering_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Primary Quantity
                      </FormLabel>
                      <div
                        className={`${classes.dflex} ${classes.alignitemscenter}`}
                      >
                        <TextField
                          className={`${classes.w90} ${classes.mr0_5}`}
                          value={formValues?.primary_quantity || ""}
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                          disabled
                        />
                        {
                          unit.find(
                            (sub) => sub.id === formValues?.primary_unit_id
                          )?.unit_name
                        }
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                >
                  {formValues?.covering_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        .
                      </FormLabel>
                      <span
                        className={`${classes.dflex} ${classes.justifycenter} `}
                      >
                        {" "}
                        =
                      </span>
                    </>
                  )}
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w45}`}
                >
                  {formValues?.covering_unit_id && (
                    <>
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Covering Quantity
                      </FormLabel>
                      <div
                        className={`${classes.dflex} ${classes.alignitemscenter}`}
                      >
                        <TextField
                          className={`${classes.w90} ${classes.mr0_5}`}
                          value={formValues.covering_quantity}
                          onChange={(e) =>
                            handleInputChange(
                              "covering_quantity",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                        />
                        {
                          unit.find(
                            (sub) => sub.id === formValues?.covering_unit_id
                          )?.unit_name
                        }
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* 
            <div
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w100}  ${classes.mt0_5}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Item Delivery Type
              </FormLabel>
              <RadioGroup
                className={`${classes.ml1} ${classes.radiocolor}`}
                row
                aria-label="Delivery Type"
                name="deliveryType"
                value={formValues.item_delivery_type}
                onChange={(e) =>
                  handleInputChange("item_delivery_type", e.target.value)
                }
              >
                <FormControlLabel value="ex" control={<Radio />} label="EX" />
                <FormControlLabel value="for" control={<Radio />} label="FOR" />
              </RadioGroup>
            </div> */}

            <div
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w50}  ${classes.mt0_5}`}
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
                Price Effective Date <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                value={formValues.effective_date}
                onChange={(e) =>
                  handleInputChange("effective_date", e.target.value)
                }
                //  value={formDetails.date}
                //  onChange={(e) => handleFormChange("follow_up_date", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("ex_mrp", e.target.value)
                    }
                    type="text"
                    variant="outlined"
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
                    placeholder="Enter Price"
                    error={Boolean(crossPriceError.ex_cross_price)}
                    helperText={crossPriceError.ex_cross_price}
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
                    onChange={(e) =>
                      handleInputChange("for_mrp", e.target.value)
                    }
                    type="text"
                    variant="outlined"
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
                    placeholder="Enter Price"
                    error={Boolean(crossPriceError.for_cross_price)}
                    helperText={crossPriceError.for_cross_price}
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
                    placeholder="Enter %"
                  />
                </div>
              </>
            )}
          </div>
          <div
            className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}
          >
            <Button
              onClick={handleClosePopUp}
              className={`${classes.transparentbtn} ${classes.mr1} ${classes.my0_5}`}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={`${classes.bluebtn} ${classes.my0_5}`}
              // onClick={handleFormSubmit}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddVariantPriceRegular;
