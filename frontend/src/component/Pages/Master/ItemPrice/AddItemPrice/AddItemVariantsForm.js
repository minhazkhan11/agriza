import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import CustomAccordion from "./CustomAccordion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import { Autocomplete } from "@material-ui/lab";
import AddVariantPriceLogical from "./AddVariantPriceLogical";
import AddVariantPriceRegular from "./AddVariantPriceRegular";

const initialData = {
  product_name: "",
  item_id: "",
  attribute_ids: [],
  variants_ids: [],
  item_variants: [],
};

const variantsInitialData = [
  {
    moq: 0,
    stock: 0,
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
    variant_name: "",
    // mrp: "",
    // selling_price: "",
    // selling_price_percent: "",
    // cross_price: "",
    // cross_price_percent: "",
    // for_mrp: "",
    // for_selling_price: "",
    // for_selling_price_percent: "",
    // for_cross_price: "",
    // for_cross_price_percent: "",
    // delivery_ex: true,
    // delivery_for: false,
    // price: [{ Logistic_area_id: "", price: "" }],
  },
];

function AddItemVariantsForm() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [variantsFormDetails, setVariantsFormDetails] =
    useState(variantsInitialData);

  // const [variantsFormDetails, setVariantsFormDetails] =
  // useState();

  const [items, setItems] = useState();
  const [selectedItems, setSelectedItems] = useState();
  const [selectedItemsId, setSelectedItemsId] = useState();

  const [attributes, setAttributes] = useState();
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedAttributesId, setSelectedAttributesId] = useState("");

  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedVariantsId, setSelectedVariantsId] = useState([]);

  const [mergedCombinations, setMergedCombinations] = useState([]);

  const [unit, setUnit] = useState([]);

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [priceMode, setPriceMode] = useState("variable");

  const [logisticArea, setLogisticArea] = useState([]);
  const [logisticPricing, setLogisticPricing] = useState([
    { Logistic_area_id: "", price: "" },
  ]);

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
      setVariantsFormDetails((prev) =>
        prev.map((variant) => ({
          ...variant,
          price: updatedLinks,
        }))
      );

      return updatedLinks;
    });
  };

  const handleFormChange = (index, fieldName, value) => {
    const updatedRows = [...logisticPricing];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setLogisticPricing(updatedRows);
    setVariantsFormDetails((prev) =>
      prev.map((variant) => ({
        ...variant,
        price: updatedRows,
      }))
    );
  };

  const handlePriceModeChange = (event) => {
    const selectedValue = event.target.value;
    setPriceMode(selectedValue);

    if (selectedValue === "regular") {
      handlePopUp("regular");
    } else if (selectedValue === "logical") {
      handlePopUp("logical");
    }
  };

  const handlePopUp = (type = null) => {
    setModalType(type);
    setOpen(!open);
  };

  const handleClosePopUp = (type = null) => {
    setModalType(type);
    setOpen(false);
    setPriceMode("variable");
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

  function getMergedCombinations(selectedVariants) {
    // Filter out empty arrays
    const validEntries = Object.entries(selectedVariants).filter(
      ([_, values]) => Array.isArray(values) && values.length > 0
    );

    // If no valid selections, return an empty array
    if (validEntries.length === 0) return [];

    // Extract keys and valid values
    const keys = validEntries.map(([key]) => key);
    const values = validEntries.map(([_, variants]) => variants);

    // Generate all combinations using Cartesian product
    const combinations = values.reduce(
      (acc, variants) => {
        let result = [];
        acc.forEach((prevCombo) => {
          variants.forEach((variant) => {
            let newCombo = {
              variant_name:
                (prevCombo.variant_name ? prevCombo.variant_name + " , " : "") +
                variant.variant,
            };
            result.push(newCombo);
          });
        });
        return result;
      },
      [
        {
          stock: 0,
          moq: 0,
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
          variant_name: "",
          // mrp: "",
          // selling_price: "",
          // selling_price_percent: "",
          // cross_price: "",
          // cross_price_percent: "",
          // for_mrp: "",
          // for_selling_price: "",
          // for_selling_price_percent: "",
          // for_cross_price: "",
          // for_cross_price_percent: "",
          // delivery_ex: true,
          // delivery_for: false,
          // price: [{ Logistic_area_id: "", price: "" }],
        },
      ] // Initialize properly
    );

    return combinations.map((combo) => ({
      variant_name: `${selectedItems?.product_name || ""} , ${
        combo.variant_name
      }`,
      moq: 0,
      stock: 0,
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
      // mrp: "",
      // selling_price: "",
      // selling_price_percent: "",
      // cross_price: "",
      // cross_price_percent: "",
      // for_mrp: "",
      // for_selling_price: "",
      // for_selling_price_percent: "",
      // for_cross_price: "",
      // for_cross_price_percent: "",
      // delivery_ex: true,
      // delivery_for: false,
      // price: [],
    }));
  }

  useEffect(() => {
    setMergedCombinations(getMergedCombinations(selectedVariants));
  }, [selectedVariants, selectedItems]);

  useEffect(() => {
    setVariantsFormDetails((prevDetails) => {
      return mergedCombinations.map((combo, index) => {
        // Try to find an existing variant entry for this combination
        const existingVariant = prevDetails.find(
          (variant) => variant.variant_name === combo.variant_name
        );

        return (
          existingVariant || {
            ...variantsInitialData[0], // Use initial structure
            variant_name: combo.variant_name,
          }
        );
      });
    });
  }, [mergedCombinations]);

  const deleteCombination = (indexToRemove) => {
    setMergedCombinations((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleItemsChange = (event, newValue) => {
    setSelectedItems(newValue);
    setSelectedItemsId(newValue.id);
  };

  const handleAttributesChange = (event, newValue) => {
    setSelectedAttributes(newValue);
    setSelectedAttributesId(newValue.map((subject) => subject.id));
  };

  const handleClose = () => {
    navigate("/variant-list");
  };

  const handleFormSubmit = () => {
    if (!selectedItemsId) {
      toast.error("Please select an item.");
      return;
    }

    if (!selectedAttributesId || selectedAttributesId.length === 0) {
      toast.error("Please select at least one attribute.");
      return;
    }

    if (!selectedVariantsId || selectedVariantsId.length === 0) {
      toast.error("Please select at least one variant.");
      return;
    }

    console.log("variantsFormDetails", variantsFormDetails, mergedCombinations);

    // for (let i = 0; i < variantsFormDetails.length; i++) {
    //   const variant = variantsFormDetails[i];

    // for (const field of requiredFields) {
    //   if (!variant[field] && variant[field] !== 0) {
    //     toast.error(`Please fill out ${field} in variant ${i + 1}.`);
    //     return;
    //   }
    // }
    // }

    const data = {
      item_id: selectedItemsId,
      attribute_ids: selectedAttributesId,
      variants_ids: selectedVariantsId,
      item_variants: variantsFormDetails,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Item Variants Created Successfully");
        setTimeout(() => {
          navigate("/variant-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

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
                  value={selectedItems}
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
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={attributes || []}
                  getOptionLabel={(option) => option.attribute_name}
                  value={attributes?.filter((sub) =>
                    selectedAttributesId.includes(sub.id)
                  )}
                  onChange={handleAttributesChange}
                  disableClearable
                  forcePopupIcon={false}
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
            {selectedAttributes.length !== 0 && (
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
            )}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.flexwrapwrap}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              {mergedCombinations.length !== 0 && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
                >
                  <CustomAccordion
                    variantsFormDetails={variantsFormDetails}
                    setVariantsFormDetails={setVariantsFormDetails}
                    mergedCombinations={mergedCombinations}
                    deleteCombination={deleteCombination}
                    selectedItems={selectedItems}
                    unit={unit}
                    handlePopUp={handlePopUp}
                    priceMode={priceMode}
                    handlePriceModeChange={handlePriceModeChange}
                    logisticArea={logisticArea}
                    setLogisticPricing={setLogisticPricing}
                    logisticPricing={logisticPricing}
                    handleRemoveLink={handleRemoveLink}
                    handleAddLink={handleAddLink}
                  />
                </div>
              )}

              {priceMode !== "variable" &&
                variantsFormDetails[0].delivery_for && (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.w100}`}
                    >
                      <Typography
                        className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      ></Typography>
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
                      <Typography
                        className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                        variant="h6"
                        display="inline"
                      ></Typography>

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
                                  Price
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

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          // onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <>
            {modalType === "logical" && (
              <AddVariantPriceLogical
                handlePopUp={handlePopUp}
                handleClosePopUp={handleClosePopUp}
                mergedCombinations={mergedCombinations}
                unit={unit}
                setVariantsFormDetails={setVariantsFormDetails}
              />
            )}
            {modalType === "regular" && (
              <AddVariantPriceRegular
                handlePopUp={handlePopUp}
                handleClosePopUp={handleClosePopUp}
                unit={unit}
                setVariantsFormDetails={setVariantsFormDetails}
              />
            )}
          </>
        </Modal>
      </div>
    </>
  );
}
export default AddItemVariantsForm;
