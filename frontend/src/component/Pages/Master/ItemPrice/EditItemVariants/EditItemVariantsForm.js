import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import { Autocomplete } from "@material-ui/lab";
import { id } from "date-fns/locale";

function EditItemVariantsForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const { state } = useLocation();

  const rowId = state;
  const [formDetails, setFormDetails] = useState({
    item_variants_id: "",
    variant_name: "",
    moq: "",
    primary_unit_id: "",
    primary_quantity: "",
    secondary_unit_id: "",
    secondary_quantity: "",
    covering_unit_id: "",
    covering_quantity: "",
    covering_length: "",
    covering_width: "",
    covering_thickness: "",
    covering_weight: "",
    piece_weight: "",
    piece_length: "",
    piece_width: "",
    piece_thickness: "",
    mrp: "",
    selling_price: "",
    selling_price_percent: "",
    cross_price: "",
    cross_price_percent: "",
    for_mrp: "",
    for_selling_price: "",
    for_selling_price_percent: "",
    for_cross_price: "",
    for_cross_price_percent: "",
    delivery_ex: true,
    delivery_for: false,
    price: [{ Logistic_area_id: "", price: "" }],
  });
  const [unit, setUnit] = useState([]);

  const [logisticArea, setLogisticArea] = useState([]);
  const [logisticPricing, setLogisticPricing] = useState([
    { Logistic_area_id: "", price: "" },
  ]);

  const [crossPriceError, setCrossPriceError] = useState({
    cross_price: "",
    for_cross_price: "",
  });

  const handleClose = () => {
    navigate("/variant-list");
  };

  const handleAddLink = () => {
    setLogisticPricing((prevLinks) => [
      ...prevLinks,
      { Logistic_area_id: "", price: "" },
    ]);
  };
  const handleRemoveLink = (index) => {
    setLogisticPricing((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(1);

      // Now update the variant prices using the updatedLinks
      setFormDetails((prev) => ({
        ...prev,
        price: updatedLinks,
      }));

      return updatedLinks;
    });
  };

  const handleFormChange = (fieldName, value) => {
    const updatedRows = [...logisticPricing];
    let row = { ...updatedRows };
    row[fieldName] = value;
    updatedRows = row;
    setLogisticPricing(updatedRows);
    setFormDetails((prev) => ({
      ...prev,
      price: updatedRows,
    }));
  };

  console.log("setFormDetails", formDetails);

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.item_variants;

        setFormDetails((prev) => ({
          ...prev,
          item_variants_id: data?.id,
          variant_name: data?.variant_name,
          moq: data?.moq,
          primary_unit_id: data?.primary_unit_id?.id,
          primary_quantity: data?.primary_quantity,
          secondary_unit_id: data?.secondary_unit_id?.id,
          secondary_quantity: data?.secondary_quantity,
          covering_unit_id: data?.covering_unit_id?.id,
          covering_quantity: data?.covering_quantity,
          covering_length: data?.covering_length,
          covering_width: data?.covering_width,
          covering_thickness: data?.covering_thickness,
          covering_weight: data?.covering_weight,
          piece_weight: data?.piece_weight,
          piece_length: data?.piece_length,
          piece_width: data?.piece_width,
          piece_thickness: data?.piece_thickness,
          stock: data?.item_variant_stock?.stock,
          sku_code: data?.item_variant_stock?.sku_code,
          price: data?.logistic_area_and_prices,
        }));
        setLogisticPricing(data?.logistic_area_and_prices);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const handleInputChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  console.log("formDetails", formDetails);

  const handlePriceChange = (mrpName, fieldName, value) => {
    const price = parseFloat(value) || 0;
    const mrp = parseFloat(formDetails[mrpName]);
    const sellingPrice = parseFloat(
      fieldName === "selling_price" ? value : formDetails.selling_price
    );
    const ForsellingPrice = parseFloat(
      fieldName === "for_selling_price" ? value : formDetails.for_selling_price
    );

    let percentage = 0;
    if (mrp > 0) {
      percentage = ((1 - price / mrp) * 100).toFixed(2);
    }

    // Set error for the respective field
    if (fieldName === "cross_price" && price <= sellingPrice) {
      setCrossPriceError((prev) => ({
        ...prev,
        cross_price: "Cross price must be greater than selling price",
      }));
    } else if (fieldName === "cross_price") {
      setCrossPriceError((prev) => ({ ...prev, cross_price: "" }));
    }

    if (fieldName === "for_cross_price" && price <= ForsellingPrice) {
      setCrossPriceError((prev) => ({
        ...prev,
        for_cross_price: "FOR Cross price must be greater than selling price",
      }));
    } else if (fieldName === "for_cross_price") {
      setCrossPriceError((prev) => ({ ...prev, for_cross_price: "" }));
    }

    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: price,
      [`${fieldName}_percent`]: percentage,
    }));
  };

  const handlePercentChange = (mrpName, fieldName, value) => {
    const percent = parseFloat(value);
    const mrp = parseFloat(formDetails[mrpName]);

    let price = 0;
    if (mrp > 0) {
      price = (mrp * (1 - percent / 100)).toFixed(2);
    }

    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: price,
      [`${fieldName}_percent`]: percent,
    }));
  };

  console.log("formDetails", formDetails);

  const handleFormSubmit = () => {
    // if (!attributeName.trim()) {
    //   toast.warn("Please enter  Attribute Name.");
    //   return;
    // }

    // if (variantsDetails.some((p) => !p.variant.trim())) {
    //   toast.warn("Please enter a Variant Name.");
    //   return;
    // }

    const data = {
      item_variants_id: rowId,
      variant_name: formDetails?.variant_name,
      moq: formDetails?.moq,
      primary_unit_id: formDetails?.primary_unit_id,
      primary_quantity: formDetails?.primary_quantity,
      secondary_unit_id: formDetails?.secondary_unit_id,
      secondary_quantity: formDetails?.secondary_quantity,
      covering_unit_id: formDetails?.covering_unit_id,
      covering_quantity: formDetails?.covering_quantity,
      covering_length: formDetails?.covering_length,
      covering_width: formDetails?.covering_width,
      covering_thickness: formDetails?.covering_thickness,
      covering_weight: formDetails?.covering_weight,
      piece_weight: formDetails?.piece_weight,
      piece_length: formDetails?.piece_length,
      piece_width: formDetails?.piece_width,
      piece_thickness: formDetails?.piece_thickness,
      ex_mrp: formDetails?.mrp || "",
      ex_selling_price: formDetails?.selling_price || "",
      ex_selling_price_percent: formDetails?.selling_price_percent || "",
      ex_cross_price: formDetails?.cross_price || "",
      ex_cross_price_percent: formDetails?.cross_price_percent || "",
      for_mrp: formDetails?. for_mrp || "",
      for_selling_price: formDetails?. for_selling_price || "",
      for_selling_price_percent: formDetails?. for_selling_price_percent || "",
      for_cross_price: formDetails?. for_cross_price || "",
      for_cross_price_percent: formDetails?. for_cross_price_percent || "",
      stock: formDetails?.stock,
      price: formDetails?.price,
      ex: formDetails?.delivery_ex,
      for: formDetails?.delivery_for,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Item Variant Update Successfully");
        setTimeout(() => {
          navigate("/item-price-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchUnit = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/units`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.units) {
        setUnit(response.data.units);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Unit:", error);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, []);

  const fetchLogisticArea = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/logistic_area`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.logistic_areas) {
        setLogisticArea(response.data.logistic_areas);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Unit:", error);
    }
  };

  useEffect(() => {
    fetchLogisticArea();
  }, []);

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Variant Name
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <Typography
                  className={` ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  {formDetails?.variant_name}
                </Typography>
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div
                className={`${classes.w75} ${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w32}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Primary unit <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={unit || []}
                    value={
                      unit?.find(
                        (sub) => sub.id === formDetails?.primary_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        "primary_unit_id",
                        newValue ? newValue.id : null
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
                      unit.find(
                        (sub) => sub.id === formDetails?.secondary_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        "secondary_unit_id",
                        newValue ? newValue.id : null
                      )
                    }
                    getOptionLabel={(option) => option.unit_name}
                    autoHighlight
                    disabled={!formDetails?.primary_unit_id}
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
                    Covering unit
                  </FormLabel>

                  <Autocomplete
                    id="state-autocomplete"
                    options={[{ id: "", unit_name: "NA" }, ...unit]}
                    value={
                      unit.find(
                        (sub) => sub.id === formDetails?.covering_unit_id
                      ) || ""
                    }
                    onChange={(e, newValue) =>
                      handleInputChange(
                        "covering_unit_id",
                        newValue ? newValue.id : null
                      )
                    }
                    getOptionLabel={(option) => option.unit_name}
                    autoHighlight
                    disabled={!formDetails?.secondary_unit_id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick..."
                        variant="outlined"
                      />
                    )}
                    selectOnFocus
                    openOnFocus
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
                      {formDetails?.secondary_unit_id && (
                        <>
                          <FormLabel
                            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                          >
                            Primary Quantity{" "}
                            <span className={classes.textcolorred}>*</span>
                          </FormLabel>
                          <div
                            className={`${classes.dflex} ${classes.alignitemscenter}`}
                          >
                            <TextField
                              className={`${classes.w90} ${classes.mr0_5}`}
                              value={formDetails?.primary_quantity || ""}
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
                                (sub) => sub.id === formDetails?.primary_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                    >
                      {formDetails?.secondary_unit_id && (
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
                      {formDetails?.secondary_unit_id && (
                        <>
                          <FormLabel
                            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                          >
                            Secondary Quantity{" "}
                            <span className={classes.textcolorred}>*</span>
                          </FormLabel>
                          <div
                            className={`${classes.dflex} ${classes.alignitemscenter}`}
                          >
                            <TextField
                              className={`${classes.w90} ${classes.mr0_5}`}
                              value={formDetails?.secondary_quantity || ""}
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
                                (sub) =>
                                  sub.id === formDetails?.secondary_unit_id
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
                      {formDetails?.covering_unit_id && (
                        <>
                          <FormLabel
                            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                          >
                            Primary Quantity
                            <span className={classes.textcolorred}>*</span>
                          </FormLabel>
                          <div
                            className={`${classes.dflex} ${classes.alignitemscenter}`}
                          >
                            <TextField
                              className={`${classes.w90} ${classes.mr0_5}`}
                              value={formDetails?.primary_quantity || ""}
                              type="text"
                              variant="outlined"
                              required
                              placeholder="Enter"
                              disabled
                            />
                            {
                              unit.find(
                                (sub) => sub.id === formDetails?.primary_unit_id
                              )?.unit_name
                            }
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                    >
                      {formDetails?.covering_unit_id && (
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
                      {formDetails?.covering_unit_id && (
                        <>
                          <FormLabel
                            className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                          >
                            Covering Quantity{" "}
                            <span className={classes.textcolorred}>*</span>
                          </FormLabel>
                          <div
                            className={`${classes.dflex} ${classes.alignitemscenter}`}
                          >
                            <TextField
                              className={`${classes.w90} ${classes.mr0_5}`}
                              value={formDetails?.covering_quantity || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "covering_quantity",
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
                                  sub.id === formDetails?.covering_unit_id
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
                    value={formDetails?.item_delivery_type || ""}
                    onChange={(e) =>
                      handleInputChange(
                        
                        "item_delivery_type",
                        e.target.value
                      )
                    }
                  >
                    <FormControlLabel
                      value="ex"
                      control={<Radio />}
                      label="EX"
                      // disabled={
                      //   priceMode === "regular" || priceMode === "logical"
                      // }
                    />
                    <FormControlLabel
                      value="for"
                      control={<Radio />}
                      label="FOR"
                      // disabled={
                      //   priceMode === "regular" || priceMode === "logical"
                      // }
                    />
                  </RadioGroup>
                </div> */}
                <div
                  className={`${classes.dflex} ${classes.alignitemscenter} ${classes.w100}  ${classes.mt0_5}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Item Delivery Type
                  </FormLabel>
                  {console.log("formDetails", formDetails)}
                  <FormGroup
                    row
                    className={`${classes.ml1} ${classes.tablecheckbox}`} // You can rename this if needed
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formDetails?.delivery_ex || false}
                          onChange={(e) =>
                            handleInputChange("delivery_ex", e.target.checked)
                          }
                          // disabled={
                          //   priceMode === "regular" || priceMode === "logical"
                          // }
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      }
                      label="EX"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formDetails?.delivery_for || false}
                          onChange={(e) =>
                            handleInputChange("delivery_for", e.target.checked)
                          }
                          // disabled={
                          //   priceMode === "regular" || priceMode === "logical"
                          // }
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      }
                      label="FOR"
                    />
                  </FormGroup>
                </div>
                {formDetails?.delivery_ex && (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w100}`}
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w100} `}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        MRP (Rs / Primary unit){" "}
                        <span className={classes.textcolorred}>*</span> (Price
                        Inclusive Of GST)
                      </FormLabel>
                      <TextField
                        value={formDetails?.mrp}
                        onChange={(e) =>
                          handleInputChange("mrp", e.target.value)
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter MRP"
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.selling_price}
                        onChange={(e) =>
                          handlePriceChange(
                            "mrp",
                            "selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.selling_price_percent}
                        onChange={(e) =>
                          handlePercentChange(
                            "mrp",
                            "selling_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.cross_price}
                        onChange={(e) =>
                          handlePriceChange(
                            "mrp",
                            "cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter Price"
                        error={Boolean(crossPriceError.cross_price)}
                        helperText={crossPriceError.cross_price}
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
                      />
                      {crossPriceError.cross_price}
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
                        value={formDetails?.cross_price_percent}
                        onChange={(e) =>
                          handlePercentChange(
                            "mrp",
                            "cross_price",
                            e.target.value
                          )
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter %"
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
                      />
                    </div>
                  </>
                )}

                {formDetails?.delivery_for && (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.w100}`}
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w100} `}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        MRP (Rs / Primary unit){" "}
                        <span className={classes.textcolorred}>*</span> (Price
                        Inclusive Of GST)
                      </FormLabel>
                      <TextField
                        value={formDetails?.for_mrp}
                        onChange={(e) =>
                          handleInputChange("for_mrp", e.target.value)
                        }
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Enter MRP"
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.for_selling_price}
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
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.for_selling_price_percent}
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
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
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
                        value={formDetails?.for_cross_price}
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
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
                      />
                      {crossPriceError.for_cross_price}
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
                        value={formDetails?.for_cross_price_percent}
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
                        // disabled={
                        //   priceMode === "regular" || priceMode === "logical"
                        // }
                      />
                    </div>
                  </>
                )}

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Opening Stock (Primary unit){" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={formDetails?.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Price"
                  />
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5} ${classes.w49}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    MOQ (Primary unit){" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={formDetails?.moq || ""}
                    onChange={(e) => handleInputChange("moq", e.target.value)}
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Price"
                  />
                </div>

                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
                >
                  <Typography
                    className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Piece (Bag/Bottle)
                  </Typography>
                </div>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w100}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Length / (mm)
                    </FormLabel>
                    <TextField
                      value={formDetails?.piece_length || ""}
                      onChange={(e) =>
                        handleInputChange("piece_length", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Width / (mm)
                    </FormLabel>
                    <TextField
                      value={formDetails?.piece_width || ""}
                      onChange={(e) =>
                        handleInputChange("piece_width", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Thickness / (mm){" "}
                    </FormLabel>
                    <TextField
                      value={formDetails?.piece_thickness || ""}
                      onChange={(e) =>
                        handleInputChange("piece_thickness", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Weight / (kg or l)
                    </FormLabel>
                    <TextField
                      value={formDetails?.piece_weight || ""}
                      onChange={(e) =>
                        handleInputChange("piece_weight", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter"
                    />
                  </div>
                </div>
                {formDetails?.covering_unit_id && (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
                    >
                      {" "}
                      <Typography
                        className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      >
                        Covering (Bag/Box/Drum)
                      </Typography>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w100}`}
                    >
                      <div
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Length / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails?.covering_length || ""}
                          onChange={(e) =>
                            handleInputChange("covering_length", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />
                      </div>

                      <div
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Width / (mm)
                        </FormLabel>
                        <TextField
                          value={formDetails?.covering_width || ""}
                          onChange={(e) =>
                            handleInputChange("covering_width", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />
                      </div>

                      <div
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Thickness / (mm){" "}
                        </FormLabel>
                        <TextField
                          value={formDetails?.covering_thickness || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "covering_thickness",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />
                      </div>

                      <div
                        className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                      >
                        <FormLabel
                          className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                        >
                          Weight
                        </FormLabel>
                        <TextField
                          value={formDetails?.covering_weight || ""}
                          onChange={(e) =>
                            handleInputChange("covering_weight", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formDetails?.delivery_for && (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.w100}`}
                    >
                      <div
                        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w75}`}
                      >
                        <Typography
                          className={`${classes.w32} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                          variant="h6"
                          display="inline"
                        >
                          Logistic Area
                        </Typography>
                      </div>
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap} ${classes.w100}`}
                    >
                      <div className={`${classes.w75}`}>
                        {logisticPricing.map((item, index) => {
                          const selectedIds = logisticPricing
                            .map((p, i) => i !== index && p?.Logistic_area_id)
                            .filter(Boolean);

                          const filteredOptions = logisticArea.filter(
                            (area) => !selectedIds.includes(area.id)
                          );
                          return (
                            <div
                              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
                            >
                              <div
                                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                              >
                                <FormLabel
                                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                                >
                                  Select Logistic Area{" "}
                                  <span className={classes.textcolorred}>
                                    *{" "}
                                    {console.log(
                                      "logisticPricing",
                                      logisticPricing
                                    )}
                                  </span>
                                </FormLabel>
                                <Autocomplete
                                  id="state-autocomplete"
                                  options={logisticArea || []}
                                  value={
                                    logisticArea.find(
                                      (u) =>
                                        u.id ===
                                        logisticPricing?.Logistic_area_id
                                    ) || null
                                  }
                                  onChange={(e, newValue) =>
                                    handleFormChange(
                                      "Logistic_area_id",
                                      newValue ? newValue.id : ""
                                    )
                                  }
                                  getOptionLabel={(option) => option.name}
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
                                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                              >
                                <FormLabel
                                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                                >
                                  Price{" "}
                                  <span className={classes.textcolorred}>
                                    *
                                  </span>
                                </FormLabel>
                                <TextField
                                  value={logisticPricing?.price}
                                  onChange={(e) =>
                                    handleFormChange("price", e.target.value)
                                  }
                                  type="text"
                                  variant="outlined"
                                  required
                                  placeholder="Enter Quantity"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {logisticPricing.length >= 2 && (
                                          <IconButton
                                            aria-label="toggle Remove"
                                            onClick={() =>
                                              handleRemoveLink(index)
                                            }
                                            edge="end"
                                          >
                                            <IndeterminateCheckBoxOutlinedIcon />
                                          </IconButton>
                                        )}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {logisticArea.length !== logisticPricing.length && (
                      <div
                        className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.w100}`}
                      >
                        <Typography
                          className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                          variant="h6"
                          display="inline"
                        ></Typography>
                        <div
                          className={`${classes.dflex} ${classes.alignitemsend}`}
                        >
                          <IconButton onClick={handleAddLink}>
                            <AddBoxOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={handleClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default EditItemVariantsForm;
