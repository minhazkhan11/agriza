import React, { useRef, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStylesCustom from "../../../../../styles";
import { toast } from "react-toastify";
import {
  Button,
  Divider,
  ClickAwayListener,
  FormLabel,
  Grow,
  IconButton,
  Paper,
  Popper,
  TextField,
  MenuList,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputAdornment,
  Checkbox,
  FormGroup,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({
  variantsFormDetails,
  setVariantsFormDetails,
  mergedCombinations,
  deleteCombination,
  logisticArea,
  unit,
  handlePopUp,
  priceMode,
  handlePriceModeChange,
  logisticPricing,
  handleRemoveLink,
  handleAddLink,
}) {
  const customClasses = useStylesCustom();
  const [expanded, setExpanded] = useState("");
  const [open, setOpen] = useState(false);
  const [crossPriceError, setCrossPriceError] = useState([]);

  const handlePriceChange = (index, mrpName, fieldName, value) => {
    const price = value;

    setVariantsFormDetails((prev) => {
      const updatedVariants = [...prev];
      const mrp = parseFloat(updatedVariants[index]?.[mrpName]);
      const sellingPrice = parseFloat(updatedVariants[index]?.ex_selling_price);
      const sellingPriceFor = parseFloat(
        updatedVariants[index]?.for_selling_price
      );
      let percentage = 0;

      if (mrp > 0) {
        percentage = ((1 - price / mrp) * 100).toFixed(2);
      }

      setCrossPriceError((prevErrors) => {
        const updatedErrors = [...prevErrors];

        // Ensure each index has the necessary structure for error handling
        if (!updatedErrors[index]) {
          updatedErrors[index] = {}; // Initialize an object if the index does not exist
        }

        // Check for ex_cross_price error
        if (fieldName === "ex_cross_price") {
          if (price <= sellingPrice) {
            updatedErrors[index].ex_cross_error =
              "Cross price (EX) must be greater than selling price";
          } else {
            updatedErrors[index].ex_cross_error = ""; // Clear error if price is valid
          }
        }

        // Check for for_cross_price error
        else if (fieldName === "for_cross_price") {
          if (price <= sellingPriceFor) {
            updatedErrors[index].for_cross_error =
              "Cross price (FOR) must be greater than selling price";
          } else {
            updatedErrors[index].for_cross_error = ""; // Clear error if price is valid
          }
        }

        return updatedErrors;
      });

      updatedVariants[index] = {
        ...updatedVariants[index],
        [fieldName]: price,
        [`${fieldName}_percent`]: percentage,
      };

      return updatedVariants;
    });
  };

  const handlePercentChange = (index, mrpName, fieldName, value) => {
    const percent = value;

    setVariantsFormDetails((prev) => {
      const updatedVariants = [...prev];
      const mrp = parseFloat(updatedVariants[index]?.[mrpName]);
      let price = 0;

      if (mrp > 0) {
        price = (mrp * (1 - percent / 100)).toFixed(2);
      }

      updatedVariants[index] = {
        ...updatedVariants[index],
        [`${fieldName}_percent`]: percent,
        [fieldName]: price,
      };

      return updatedVariants;
    });
  };

  const anchorRef = useRef(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleInputChange = (index, fieldName, value) => {
    const updatedRows = [...variantsFormDetails];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    row["variant_name"] = mergedCombinations[index]?.variant_name;
    updatedRows[index] = row;
    setVariantsFormDetails(updatedRows);
  };

  const handleClose = (event) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleAddLogisticPrice = (variantIdx) => {
    setVariantsFormDetails((prev) => {
      const updated = [...prev];
      updated[variantIdx].price.push({
        Logistic_area_id: "", // default value or select input
        price: "",
      });
      return updated;
    });
  };

  const handleRemoveLogisticPrice = (variantIdx, priceIdx) => {
    setVariantsFormDetails((prev) => {
      const updated = [...prev];
      updated[variantIdx].price.splice(priceIdx, 1);
      return updated;
    });
  };

  const handleLogisticPriceChange = (variantIdx, priceIdx, key, value) => {
    console.log("updated123456", variantIdx, priceIdx, key, value);

    setVariantsFormDetails((prev) => {
      console.log("updated", prev);
      const updated = [...prev];
      console.log("updated123", updated[variantIdx]);
      console.log("updated12", updated[variantIdx]);
      updated[variantIdx].price[priceIdx][key] = value;
      return updated;
    });
  };

  return (
    <>
      <Paper className={`${customClasses.p1} ${customClasses.mb1}`}>
        <div
          className={`${customClasses.dflex} ${customClasses.justifyspacebetween}  ${customClasses.alignitemscenter}`}
        >
          <span> Variant List</span>
          <div
            className={`${customClasses.dflex} ${customClasses.alignitemscenter} ${customClasses.mt0_5}`}
          >
            <RadioGroup
              className={`${customClasses.ml1} ${customClasses.radiocolor}`}
              row
              aria-label="Price Mode"
              name="priceMode"
              value={priceMode}
              onChange={handlePriceModeChange}
            >
              <FormControlLabel
                value="variable"
                control={<Radio />}
                label="Variable"
              />
              <FormControlLabel
                value="regular"
                control={<Radio />}
                label="Regular"
              />
              <FormControlLabel
                value="logical"
                control={<Radio />}
                label="Logical"
              />
            </RadioGroup>
          </div>
          <Tooltip title="Variant Setting">
            <IconButton
              // className={`${customClasses.mr1} ${customClasses.bgtransparent} ${customClasses.bghoverwhite} ${customClasses.boxshadow0} ${customClasses.w27px} ${customClasses.p0_5} `}
              variant="contained"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              className={`${customClasses.p0} ${customClasses.ml1}`}
            >
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          className={`${customClasses.dropdowncard} `}
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <Link to="" className={customClasses.dropdownlink}>
                      <Button
                        fullWidth
                        onClick={() => {
                          handlePopUp("regular");
                          handleClose();
                        }}
                        className={`${customClasses.menuButton} ${customClasses.justifyleft}`}
                      >
                        <span
                          className={`${customClasses.headname} ${customClasses.dflex} ${customClasses.alignitemscenter}`}
                        >
                          Set Regular Price
                        </span>
                      </Button>

                      <Divider />
                      <Button
                        fullWidth
                        onClick={() => {
                          handlePopUp("logical");
                          handleClose();
                        }}
                        className={`${customClasses.menuButton} ${customClasses.justifyleft}`}
                      >
                        <span
                          className={`${customClasses.headname} ${customClasses.dflex} ${customClasses.alignitemscenter}`}
                        >
                          Set Logical Price
                        </span>
                      </Button>
                    </Link>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Paper>
      {mergedCombinations?.map((data, index) => (
        <div className={`${customClasses.dflex}`}>
          <span className={`${customClasses.mr0_5} ${customClasses.mt1}`}>
            {index + 1}
          </span>
          <Accordion
            className={`${customClasses.w100}`}
            square
            expanded={expanded === data.variant_name}
            onChange={handleChange(data.variant_name)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1d-content"
              id="panel1d-header"
              className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
            >
              <div
                className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
              >
                <Typography>{data.variant_name}</Typography>
                <IconButton className={`${customClasses.p0}`}>
                  <Tooltip title="Delete">
                    <DeleteIcon
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteCombination(index);
                      }}
                      onFocus={(event) => event.stopPropagation()}
                    />
                  </Tooltip>
                </IconButton>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div
                className={`${customClasses.w100} ${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.flexwrapwrap}`}
              >
                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Primary unit (Smallest)<span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={unit || []}
                    value={
                      unit.find(
                        (sub) =>
                          sub.id === variantsFormDetails[index]?.primary_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        index,
                        "primary_unit_id",
                        newValue ? newValue.id : ""
                      )
                    }
                    disabled={
                      priceMode === "regular" || priceMode === "logical"
                    }
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
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Secondary unit
                  </FormLabel>

                  <Autocomplete
                    id="state-autocomplete"
                    options={unit || []}
                    value={
                      unit.find(
                        (sub) =>
                          sub.id ===
                          variantsFormDetails[index]?.secondary_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        index,
                        "secondary_unit_id",
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
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                    disabled={
                      priceMode === "regular" ||
                      priceMode === "logical" ||
                      !variantsFormDetails[index]?.primary_unit_id
                    }
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w32}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Covering unit
                  </FormLabel>

                  <Autocomplete
                    id="state-autocomplete"
                    options={[{ id: "", unit_name: "NA" }, ...unit]}
                    value={
                      unit.find(
                        (sub) =>
                          sub.id ===
                          variantsFormDetails[index]?.covering_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        index,
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
                    disabled={
                      priceMode === "regular" ||
                      priceMode === "logical" ||
                      !variantsFormDetails[index]?.secondary_unit_id
                    }
                  />
                </div>
                <div
                  className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1}  ${customClasses.w100}`}
                >
                  <div
                    className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w49}`}
                  >
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w45}`}
                    >
                      {variantsFormDetails[index]?.secondary_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            Primary Quantity
                          </FormLabel>
                          <div
                            className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                          >
                            <TextField
                              className={`${customClasses.w90} ${customClasses.mr0_5}`}
                              value={
                                variantsFormDetails[index]?.primary_quantity ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
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
                                (sub) =>
                                  sub.id ===
                                  variantsFormDetails[index]?.primary_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.justifycenter} ${customClasses.w5}`}
                    >
                      {variantsFormDetails[index]?.secondary_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            .
                          </FormLabel>
                          <span> =</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w45}`}
                    >
                      {variantsFormDetails[index]?.secondary_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            Secondary Quantity
                          </FormLabel>
                          <div
                            className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                          >
                            <TextField
                              className={`${customClasses.w90} ${customClasses.mr0_5}`}
                              value={
                                variantsFormDetails[index]
                                  ?.secondary_quantity || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
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
                                (sub) =>
                                  sub.id ===
                                  variantsFormDetails[index]?.secondary_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w49}`}
                  >
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w45}`}
                    >
                      {variantsFormDetails[index]?.covering_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            Primary Quantity
                          </FormLabel>
                          <div
                            className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                          >
                            <TextField
                              className={`${customClasses.w90} ${customClasses.mr0_5}`}
                              value={
                                variantsFormDetails[index]?.primary_quantity ||
                                ""
                              }
                              type="text"
                              variant="outlined"
                              required
                              placeholder="Enter "
                              disabled
                            />
                            {
                              unit.find(
                                (sub) =>
                                  sub.id ===
                                  variantsFormDetails[index]?.primary_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.justifycenter} ${customClasses.w5}`}
                    >
                      {variantsFormDetails[index]?.covering_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            .
                          </FormLabel>
                          <span
                            className={`${customClasses.dflex} ${customClasses.justifycenter} `}
                          >
                            {" "}
                            =
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w45}`}
                    >
                      {variantsFormDetails[index]?.covering_unit_id && (
                        <>
                          <FormLabel
                            className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                          >
                            Covering Quantity
                          </FormLabel>
                          <div
                            className={`${customClasses.dflex} ${customClasses.alignitemscenter}`}
                          >
                            <TextField
                              className={`${customClasses.w90} ${customClasses.mr0_5}`}
                              value={
                                variantsFormDetails[index]?.covering_quantity ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
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
                                (sub) =>
                                  sub.id ===
                                  variantsFormDetails[index]?.covering_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.alignitemscenter} ${customClasses.w100}  ${customClasses.mt0_5}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Item Delivery Type
                  </FormLabel>

                  <FormGroup
                    row
                    className={`${customClasses.ml1} ${customClasses.tablecheckbox}`} // You can rename this if needed
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            variantsFormDetails[index]?.delivery_ex || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "delivery_ex",
                              e.target.checked
                            )
                          }
                          disabled={
                            priceMode === "regular" || priceMode === "logical"
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
                          checked={
                            variantsFormDetails[index]?.delivery_for || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "delivery_for",
                              e.target.checked
                            )
                          }
                          disabled={
                            priceMode === "regular" || priceMode === "logical"
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
                  className={`${customClasses.dflex} ${customClasses.alignitemscenter} ${customClasses.w50}  ${customClasses.mt0_5}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.mr1} ${customClasses.lineheight}`}
                  >
                  Price Effective Date{" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={variantsFormDetails[index]?.effective_date}
                    onChange={(e) =>
                      handleInputChange(index, "effective_date", e.target.value)
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

                {variantsFormDetails[index]?.delivery_ex && (
                  <>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
                    >
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        EX
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w100} `}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        MRP (Rs / Primary unit){" "}
                        <span className={customClasses.textcolorred}>*</span>{" "}
                        (Price Inclusive Of GST)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.ex_mrp}
                        onChange={(e) =>
                          handleInputChange(index, "ex_mrp", e.target.value)
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter MRP"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w49} ${customClasses.mt0_5}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Selling Price (Rs / Primary unit)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.ex_selling_price}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "ex_mrp",
                            "ex_selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w49} ${customClasses.mt0_5}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Selling Price Margin %{" "}
                      </FormLabel>
                      <TextField
                        value={
                          variantsFormDetails[index]?.ex_selling_price_percent
                        }
                        onChange={(e) =>
                          handlePercentChange(
                            index,
                            "ex_mrp",
                            "ex_selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Cross Price (Rs / Primary unit)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.ex_cross_price}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "ex_mrp",
                            "ex_cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        error={crossPriceError[index]?.ex_cross_error}
                        helperText={crossPriceError[index]?.ex_cross_error}
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Cross Price Margin %
                      </FormLabel>
                      <TextField
                        value={
                          variantsFormDetails[index]?.ex_cross_price_percent
                        }
                        onChange={(e) =>
                          handlePercentChange(
                            index,
                            "ex_mrp",
                            "ex_cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                  </>
                )}

                {variantsFormDetails[index]?.delivery_for && (
                  <>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween}  ${customClasses.w100}`}
                    >
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        FOR
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w100} `}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        MRP (Rs / Primary unit){" "}
                        <span className={customClasses.textcolorred}>*</span>{" "}
                        (Price Inclusive Of GST)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.for_mrp}
                        onChange={(e) =>
                          handleInputChange(index, "for_mrp", e.target.value)
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter MRP"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w49} ${customClasses.mt0_5}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Selling Price (Rs / Primary unit)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.for_selling_price}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "for_mrp",
                            "for_selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w49} ${customClasses.mt0_5}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Selling Price Margin %{" "}
                      </FormLabel>
                      <TextField
                        value={
                          variantsFormDetails[index]?.for_selling_price_percent
                        }
                        onChange={(e) =>
                          handlePercentChange(
                            index,
                            "for_mrp",
                            "for_selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Cross Price (Rs / Primary unit)
                      </FormLabel>
                      <TextField
                        value={variantsFormDetails[index]?.for_cross_price}
                        onChange={(e) =>
                          handlePriceChange(
                            index,
                            "for_mrp",
                            "for_cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        error={crossPriceError[index]?.for_cross_error}
                        helperText={crossPriceError[index]?.for_cross_error}
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                    >
                      <FormLabel
                        className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                      >
                        Cross Price Margin %
                      </FormLabel>
                      <TextField
                        value={
                          variantsFormDetails[index]?.for_cross_price_percent
                        }
                        onChange={(e) =>
                          handlePercentChange(
                            index,
                            "for_mrp",
                            "for_cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        disabled={
                          priceMode === "regular" || priceMode === "logical"
                        }
                      />
                    </div>
                  </>
                )}

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Opening Stock (Primary unit){" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={variantsFormDetails[index]?.stock}
                    onChange={(e) =>
                      handleInputChange(index, "stock", e.target.value)
                    }
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Opening Stock"
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                >
                  <FormLabel
                    className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                  >
                    Minimum Order Quantity (MOQ) (Primary unit){" "}
                    <span className={customClasses.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={variantsFormDetails[index]?.moq}
                    onChange={(e) =>
                      handleInputChange(index, "moq", e.target.value)
                    }
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Quantity"
                  />
                </div>

                <div
                  className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                >
                  <Typography
                    className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Piece (Bag/Bottle)
                  </Typography>
                </div>
                <div
                  className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
                >
                  <div
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                    >
                      Length / (mm)
                    </FormLabel>
                    <TextField
                      value={variantsFormDetails[index]?.piece_length || ""}
                      onChange={(e) =>
                        handleInputChange(index, "piece_length", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter "
                    />
                  </div>

                  <div
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                    >
                      Width / (mm)
                    </FormLabel>
                    <TextField
                      value={variantsFormDetails[index]?.piece_width || ""}
                      onChange={(e) =>
                        handleInputChange(index, "piece_width", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter "
                    />
                  </div>

                  <div
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                    >
                      Thickness / (mm){" "}
                    </FormLabel>
                    <TextField
                      value={variantsFormDetails[index]?.piece_thickness || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "piece_thickness",
                          e.target.value
                        )
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter "
                    />
                  </div>

                  <div
                    className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                  >
                    <FormLabel
                      className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                    >
                      Weight / (kg or l)
                    </FormLabel>
                    <TextField
                      value={variantsFormDetails[index]?.piece_weight || ""}
                      onChange={(e) =>
                        handleInputChange(index, "piece_weight", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter "
                    />
                  </div>
                </div>
                {variantsFormDetails[index]?.covering_unit_id && (
                  <>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                    >
                      {" "}
                      <Typography
                        className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        Covering (Bag/Box/Drum)
                      </Typography>
                    </div>
                    <div
                      className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.w100}`}
                    >
                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Length / (mm)
                        </FormLabel>
                        <TextField
                          value={
                            variantsFormDetails[index]?.covering_length || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "covering_length",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Width / (mm)
                        </FormLabel>
                        <TextField
                          value={
                            variantsFormDetails[index]?.covering_width || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "covering_width",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Thickness / (mm){" "}
                        </FormLabel>
                        <TextField
                          value={
                            variantsFormDetails[index]?.covering_thickness || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "covering_thickness",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                        />
                      </div>

                      <div
                        className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn}  ${customClasses.w24}`}
                      >
                        <FormLabel
                          className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                        >
                          Weight
                        </FormLabel>
                        <TextField
                          value={
                            variantsFormDetails[index]?.covering_weight || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "covering_weight",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter "
                        />
                      </div>
                    </div>
                  </>
                )}
                {priceMode === "variable" &&
                  variantsFormDetails[index]?.delivery_for && (
                    <>
                      {(variantsFormDetails[index]?.price || []).map(
                        (priceObj, priceIdx) => (
                          <React.Fragment key={priceIdx}>
                            <div
                              className={`${customClasses.dflex} ${customClasses.justifyspacebetween} ${customClasses.mt1} ${customClasses.w100}`}
                            >
                              <Typography
                                className={`${customClasses.w32} ${customClasses.textcolorformhead} ${customClasses.fontfamilyoutfit} ${customClasses.fontsize5} ${customClasses.fontstylenormal} ${customClasses.fw500} ${customClasses.lineheight2_25}`}
                                variant="h6"
                                display="inline"
                              >
                                Logistic Area
                              </Typography>
                            </div>
                            <div
                              className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                            >
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Select Logistic Area
                              </FormLabel>
                              <Autocomplete
                                options={logisticArea || []}
                                value={
                                  logisticArea.find(
                                    (u) => u.id === priceObj?.Logistic_area_id
                                  ) || null
                                }
                                onChange={(e, newValue) =>
                                  handleLogisticPriceChange(
                                    index,
                                    priceIdx,
                                    "Logistic_area_id",
                                    newValue ? newValue.id : ""
                                  )
                                }
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Type to pick..."
                                    variant="outlined"
                                  />
                                )}
                              />
                            </div>

                            <div
                              className={`${customClasses.dflex} ${customClasses.flexdirectioncolumn} ${customClasses.mt0_5} ${customClasses.w49}`}
                            >
                              <FormLabel
                                className={`${customClasses.textcolorformlabel} ${customClasses.fontfamilyoutfit}  ${customClasses.fontsize1} ${customClasses.fontstylenormal} ${customClasses.fw400} ${customClasses.lineheight}`}
                              >
                                Price
                              </FormLabel>
                              <TextField
                                value={priceObj?.price || ""}
                                onChange={(e) =>
                                  handleLogisticPriceChange(
                                    index,
                                    priceIdx,
                                    "price",
                                    e.target.value
                                  )
                                }
                                type="text"
                                variant="outlined"
                                required
                                placeholder="Enter Quantity"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {variantsFormDetails[index]?.price
                                        .length > 1 && (
                                        <IconButton
                                          aria-label="remove"
                                          onClick={() =>
                                            handleRemoveLogisticPrice(
                                              index,
                                              priceIdx
                                            )
                                          }
                                        >
                                          <IndeterminateCheckBoxOutlinedIcon />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                          </React.Fragment>
                        )
                      )}

                      <div
                        className={`${customClasses.justifyflexend} ${customClasses.dflex}`}
                      >
                        <IconButton
                          onClick={() => handleAddLogisticPrice(index)}
                        >
                          <AddBoxOutlinedIcon />
                        </IconButton>
                      </div>
                    </>
                  )}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
}
