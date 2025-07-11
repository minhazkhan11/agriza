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

function AddVariantPriceLogical({
  handlePopUp,
  handleClosePopUp,
  mergedCombinations,
  unit,
  setVariantsFormDetails,
  deliveryType,
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

  const [selectedBaseVariant, setSelectedBaseVariant] = useState("");

  const [selectedLogicVariants, setSelectedLogicVariants] = useState({});

  const [selectedVariants, setSelectedVariants] = useState([]);

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

  const handleBaseVariantChange = (event, newValue) => {
    setSelectedBaseVariant({
      ...newValue,
      ...formValues, // attach all base pricing info
    });
    setSelectedVariants((prev) => [...prev, newValue]);
  };

  const handleBaseLogicVariantChange = (index, newValue) => {
    setSelectedLogicVariants((prev) => ({
      ...prev,
      [index]: {
        ...formValues, // base form values
        ...newValue, // variant-specific info like name/id
        price: "", // additional price field to be set later
      },
    }));
    setSelectedVariants((prev) => [...prev, newValue]);
  };

  const handleVariantPriceChange = (index, field, value) => {
    setSelectedLogicVariants((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Basic required validations
    if (!selectedBaseVariant?.variant_name) {
      toast.error("Please select a Base Variant.");
      return;
    }

    if (!formValues.primary_unit_id) {
      toast.error("Please select a Primary Unit.");
      return;
    }

            if (!formValues.effective_date) {
          toast.error("Please select a Effective Date.");
          return;
        }

    if (!formValues.ex_mrp || isNaN(parseFloat(formValues.ex_mrp))) {
      toast.error("Please enter a valid MRP.");
      return;
    }

    // Logic variant validations
    const logicError = Object.values(selectedLogicVariants).some(
      (variant) => !variant?.variant_name || isNaN(parseFloat(variant?.price))
    );

    if (logicError) {
      toast.error(
        "Please ensure all Logic Variants are selected and have a valid price."
      );
      return;
    }

    const baseMrp = parseFloat(formValues.ex_mrp) || 0;
    const baseSelling = parseFloat(formValues.ex_selling_price) || 0;
    const baseCross = parseFloat(formValues.ex_cross_price) || 0;

    const baseMrpFor = parseFloat(formValues.for_mrp) || 0;
    const baseSellingFor = parseFloat(formValues.for_selling_price) || 0;
    const baseCrossFor = parseFloat(formValues.for_cross_price) || 0;

    const updatedVariants = mergedCombinations.map((variant) => {
      const isBase =
        variant?.variant_name === selectedBaseVariant?.variant_name;
      const logicData = Object.values(selectedLogicVariants).find(
        (v) => v?.variant_name === variant?.variant_name
      );

      if (isBase) {
        return {
          ...variant,
          ...formValues,
        };
      } else if (logicData) {
        const extraPrice = parseFloat(logicData?.price) || 0;

        return {
          ...variant,
          ex_mrp: baseMrp.toFixed(2),
          ex_selling_price: (baseSelling + extraPrice).toFixed(2),
          ex_cross_price: (baseCross + extraPrice).toFixed(2),
          ex_selling_price_percent: (
            (1 - (baseSelling + extraPrice) / baseMrp) *
            100
          ).toFixed(2),
          ex_cross_price_percent: (
            (1 - (baseCross + extraPrice) / baseMrp) *
            100
          ).toFixed(2),
          for_mrp: baseMrpFor.toFixed(2),
          for_selling_price: (baseSellingFor + extraPrice).toFixed(2),
          for_cross_price: (baseCrossFor + extraPrice).toFixed(2),
          for_selling_price_percent: (
            (1 - (baseSellingFor + extraPrice) / baseMrpFor) *
            100
          ).toFixed(2),
          for_cross_price_percent: (
            (1 - (baseCrossFor + extraPrice) / baseMrpFor) *
            100
          ).toFixed(2),
          primary_unit_id: formValues.primary_unit_id,
          secondary_unit_id: formValues.secondary_unit_id,
          covering_unit_id: formValues.covering_unit_id,
          delivery_ex: formValues.delivery_ex,
          delivery_for: formValues.delivery_for,
          effective_date: formValues.effective_date,
        };
      } else {
        return variant;
      }
    });

    // setIsLogicalPriceSet(true);
    setVariantsFormDetails(updatedVariants);
    handlePopUp();
  };

  const Heading = [
    {
      id: 1,
      mainheading: "Set Logical Price",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: undefined,
      addbtnicon: undefined,
      addbtnstyle: undefined,
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.w50} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.p1} ${classes.px2}`}
      >
        <PageHeader Heading={Heading} />
        <div
          className={`${classes.dflex} ${classes.pagescroll}  ${classes.maxh67} ${classes.flexdirectioncolumn} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.mt1} ${classes.borderradius6px} ${classes.p1} ${classes.px2}`}
        >
          <div
            className={`${classes.w100} ${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w100}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Select Base Variant{" "}
                <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <Autocomplete
                id="state-autocomplete"
                options={mergedCombinations || []}
                value={selectedBaseVariant}
                onChange={handleBaseVariantChange}
                getOptionLabel={(option) => option.variant_name}
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
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32} ${classes.mt0_5}`}
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
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32} ${classes.mt0_5}`}
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
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32} ${classes.mt0_5}`}
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

            {/* <div
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
            {selectedBaseVariant && (
              <>
                {" "}
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
                >
                  <Typography
                    className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Logic Details
                  </Typography>
                </div>
                {mergedCombinations
                  ?.filter(
                    (option) =>
                      option?.variant_name !== selectedBaseVariant?.variant_name
                  )
                  ?.map((data, index) => (
                    <div
                      key={data.id}
                      className={`${classes.w100} ${classes.dflex} ${classes.justifyspacebetween}  ${classes.mt1}`}
                    >
                      <div className={`${classes.mt1}`}>
                        <Typography
                          className={`${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                          variant="h6"
                          display="inline"
                        >
                          {index + 1}
                        </Typography>
                      </div>
                      <div
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w47}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Select Variant{" "}
                          <span className={classes.textcolorred}>*</span>
                        </FormLabel>
                        <Autocomplete
                          id="state-autocomplete"
                          options={
                            mergedCombinations?.filter(
                              (option) =>
                                !selectedVariants.some(
                                  (selected) =>
                                    selected?.variant_name ===
                                    option?.variant_name
                                )
                            ) || []
                          }
                          value={selectedLogicVariants[index] || null}
                          onChange={(e, newValue) =>
                            handleBaseLogicVariantChange(index, newValue)
                          }
                          getOptionLabel={(option) => option.variant_name}
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
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w47}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Price <span className={classes.textcolorred}>*</span>
                        </FormLabel>
                        <TextField
                          // value={variantsFormDetails[index]?.mrp}
                          onChange={(e) =>
                            handleVariantPriceChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Price"
                        />
                      </div>
                    </div>
                  ))}
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
export default AddVariantPriceLogical;
