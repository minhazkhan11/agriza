import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
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

  const [crossPriceError, setCrossPriceError] = useState({
    ex_cross_price: "",
    for_cross_price: "",
  });

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
    stock: "",
    ex: true,
    for: false,
    effective_date: "",
    price: [],
  });
  const [unit, setUnit] = useState([]);
  const [items, setItems] = useState();
  const [selectedItems, setSelectedItems] = useState();
  const [selectedItemsId, setSelectedItemsId] = useState();

  const [logisticArea, setLogisticArea] = useState([]);
  const [logisticPricing, setLogisticPricing] = useState([
    { Logistic_area_id: "", price: "" },
  ]);

  const [attributes, setAttributes] = useState();
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedAttributesId, setSelectedAttributesId] = useState("");

  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedVariantsId, setSelectedVariantsId] = useState([]);
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
      updatedLinks.splice(index, 1);

      // Now update the variant prices using the updatedLinks
      setFormDetails((prev) => ({
        ...prev,
        price: updatedLinks,
      }));

      return updatedLinks;
    });
  };

  const handleFormChange = (index, fieldName, value) => {
    const updatedRows = [...logisticPricing];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setLogisticPricing(updatedRows);
    setFormDetails((prev) => ({
      ...prev,
      price: updatedRows,
    }));
  };

  // Handle Autocomplete Selection
  const handleVariantsChange = (attributeName) => (event, newValue) => {
    setSelectedVariants((prevState) => ({
      ...prevState,
      [attributeName]: newValue,
    }));

    setSelectedVariantsId((prevIds) => {
      const newIds = newValue.map((subject) => subject.id);
      return [...new Set([...prevIds, ...newIds])]; // Merge previous IDs and remove duplicates
    });
  };

  const handleItemsChange = (event, newValue) => {
    setSelectedItems(newValue);
    setSelectedItemsId(newValue.id);
  };

  const handleAttributesChange = (event, newValue) => {
    setSelectedAttributes(newValue);
    setSelectedAttributesId(newValue.map((subject) => subject.id));
  };

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

        setFormDetails({
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
          ex_mrp: data?.ex_mrp,
          ex_selling_price: data?.ex_selling_price,
          ex_selling_price_percent: data?.ex_selling_price_percent,
          ex_cross_price: data?.ex_cross_price,
          ex_cross_price_percent: data?.ex_cross_price_percent,
          for_mrp: data?.for_mrp,
          for_selling_price: data?.for_selling_price,
          for_selling_price_percent: data?.for_selling_price_percent,
          for_cross_price: data?.for_cross_price,
          for_cross_price_percent: data?.for_cross_price_percent,
          stock: data?.item_variant_stock?.stock,
          sku_code: data?.item_variant_stock?.sku_code,
          item_delivery_type: data?.item_delivery_type,
          ex: data?.ex,
          for: data?.for,
          price: data?.logistic_area_and_prices,
          effective_date:
            data?.ex_effective_date || data?.ex_effective_date || "",
        });
        setLogisticPricing(data?.logistic_area_and_prices);
        setSelectedItemsId(data?.item_id?.id);
        setSelectedItems(data?.item_id);
        setSelectedAttributesId(data?.attribute_ids);
        setSelectedAttributes(data?.attributes);
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

  const input = formDetails.variant_name;
  const parts = input.split(/,(.+)/);
  const variant = parts[1]?.trim();

  const handleInputChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handlePriceChange = (fieldName, value) => {
    setFormDetails((prev) => {
      const newValue = parseFloat(value) || 0;
      let updatedValues = { ...prev, [fieldName]: newValue };

      if (fieldName === "ex_selling_price" && prev.mrp) {
        updatedValues.ex_selling_price_percent = (
          (1 - newValue / prev.mrp) *
          100
        ).toFixed(2);
      }

      if (fieldName === "ex_cross_price" && prev.mrp) {
        updatedValues.ex_cross_price_percent = (
          (1 - newValue / prev.mrp) *
          100
        ).toFixed(2);
      }

      return updatedValues;
    });
  };

  const handlePercentChange = (fieldName, value) => {
    setFormDetails((prev) => {
      const newPercent = parseFloat(value) || 0;
      let updatedValues = { ...prev, [fieldName]: newPercent };

      if (fieldName === "ex_selling_price_percent" && prev.mrp) {
        updatedValues.ex_selling_price = (
          (newPercent / 100) *
          prev.mrp
        ).toFixed(2);
      }

      if (fieldName === "cross_price_percent" && prev.mrp) {
        updatedValues.ex_cross_price = ((newPercent / 100) * prev.mrp).toFixed(
          2
        );
      }

      return updatedValues;
    });
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
      item_id: selectedItemsId,
      item_variants_id: rowId,
      variant_name: `${selectedItems.product_name}, ${variant}`,
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
      ex_mrp: formDetails?.ex_mrp,
      ex_selling_price: formDetails?.ex_selling_price,
      ex_selling_price_percent: formDetails?.ex_selling_price_percent,
      ex_cross_price: formDetails?.ex_cross_price,
      ex_cross_price_percent: formDetails?.ex_cross_price_percent,
      for_mrp: formDetails?.for_mrp,
      for_selling_price: formDetails?.for_selling_price,
      for_selling_price_percent: formDetails?.for_selling_price_percent,
      for_cross_price: formDetails?.for_cross_price,
      for_cross_price_percent: formDetails?.for_cross_price_percent,
      stock: formDetails?.stock,
      sku_code: formDetails?.sku_code,
      ex: formDetails?.ex,
      for: formDetails?.for,
      price: formDetails?.price,
      effective_date: formDetails?.effective_date,
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
          navigate("/variant-list");
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

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.newProduct) {
        setItems(response.data.newProduct);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Unit:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/attributes`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.attributes) {
        setAttributes(response.data.attributes);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Unit:", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
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
            {/* <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                SKU CODE
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <Typography
                  className={` ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  {formDetails.sku_code}
                </Typography>
              </div>
            </div> */}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Item Variants Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Item <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={items || []}
                  // value={selectedItems}
                  value={items?.find((sub) => sub.id === selectedItemsId) || ""}
                  onChange={handleItemsChange}
                  disableClearable
                  getOptionLabel={(option) => option.product_name}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Attribute <span className={classes.textcolorred}>*</span>
                  {console.log("selectedAttributesId", selectedAttributesId)}
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={attributes || []}
                  getOptionLabel={(option) => option.attribute_name}
                  value={
                    attributes?.filter((sub) =>
                      selectedAttributesId?.includes(sub.id)
                    ) || []
                  }
                  onChange={handleAttributesChange}
                  disableClearable
                  forcePopupIcon={false}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick..."
                      {...params}
                    />
                  )}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            {/* {selectedAttributes.length !== 0 && (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.w100}`}
              >
                <div
                  className={`${classes.dflex} ${classes.w24} ${classes.justifyspacebetween} ${classes.flexwrapwrap}`}
                >
                  <Typography
                    className={` ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Variant Details
                  </Typography>
                </div>

                <div
                  className={`${classes.w74} ${classes.dflex}  ${classes.flexwrapwrap}`}
                >
                  {selectedAttributes?.map((link, index) => (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mr0_5}  ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        {link.attribute_name}{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id={`tags-standard-${index}`}
                        options={link.variant_details || []}
                        getOptionLabel={(option) => option.variant}
                        value={selectedVariants[link.attribute_name] || []} // Controlled state
                        onChange={handleVariantsChange(link.attribute_name)} // Handle selection
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name={`section-${index}`}
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )} */}

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
                  {selectedItems?.product_name}, {variant}
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
                          checked={formDetails?.ex || false}
                          onChange={(e) =>
                            handleInputChange("ex", e.target.checked)
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
                          checked={formDetails?.for || false}
                          onChange={(e) =>
                            handleInputChange("for", e.target.checked)
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
                    Price Effective Date{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>

                  <TextField
                    value={
                      formDetails.effective_date
                        ? new Date(formDetails.effective_date).toLocaleDateString('en-CA')
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
                  {formDetails?.ex && (
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
                          value={formDetails.ex_mrp}
                          onChange={(e) =>
                            handleInputChange("ex_mrp", e.target.value)
                          }
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
                          value={formDetails.ex_selling_price}
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
                          value={formDetails.ex_selling_price_percent}
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
                          value={formDetails?.ex_cross_price}
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
                          // error={Boolean(crossPriceError)}
                          // helperText={crossPriceError}
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
                          value={formDetails.ex_cross_price_percent}
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

                  {formDetails?.for && (
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
                          value={formDetails.for_mrp}
                          onChange={(e) =>
                            handleInputChange("for_mrp", e.target.value)
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
                          value={formDetails.for_selling_price}
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
                          value={formDetails.for_selling_price_percent}
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
                          // error={Boolean(crossPriceError)}
                          // helperText={crossPriceError}
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
                          value={formDetails.for_cross_price_percent}
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

                {formDetails.item_delivery_type === "for" && (
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
                                        logisticPricing[index]?.Logistic_area_id
                                    ) || null
                                  }
                                  onChange={(e, newValue) =>
                                    handleFormChange(
                                      index,
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
                                  value={logisticPricing[index]?.price}
                                  onChange={(e) =>
                                    handleFormChange(
                                      index,
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
