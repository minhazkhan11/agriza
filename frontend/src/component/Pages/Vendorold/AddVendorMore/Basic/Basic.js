import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
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
import { useLocation } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function Basic({ setValue }) {
  const { state } = useLocation();
  const basicDetails = state?.be_information;
  const initialData = {
    pan_number: basicDetails?.pan_number || "",
    is_Business: basicDetails?.registerd_type || "",
    gst_number: basicDetails?.gst_number || "",
    postal_address: basicDetails?.postal_address || "",
    business_name: basicDetails?.business_name || "",
    short_name: basicDetails?.short_name || "",
    phone: basicDetails?.phone || "",
    website: basicDetails?.website || "",
    cin_number: basicDetails?.cin_number || "",
    msme_number: basicDetails?.msme_number || "",
    module_id: basicDetails?.module_id || "",
    supplier_ids: basicDetails?.supplier_ids || "",
    business_category_ids: basicDetails?.business_category_ids || "",
    business_sub_categorys_ids: basicDetails?.business_sub_categorys_ids || "",
  };

  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState(initialData);

  const [businessCategory, setBusinessCategory] = useState([]);
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState(
    formDetails.business_category_ids
  );

  const [businessSubCategory, setBusinessSubCategory] = useState([]);
  const [selectedBusinessSubCategory, setSelectedBusinessSubCategory] =
    useState(formDetails.business_sub_categorys_ids);

  const [supplierType, setSupplierType] = useState([]);
  const [selectedSupplierType, setSelectedSupplierType] = useState(
    formDetails.supplier_ids
  );

  const handleBusinessCategoryChange = (event, newValue) => {
    setSelectedBusinessCategory(newValue.map((subject) => subject.id));
  };

  const handleBusinessSubCategoryChange = (event, newValue) => {
    setSelectedBusinessSubCategory(newValue.map((subject) => subject.id));
  };

  const handleSupplierTypeChange = (event, newValue) => {
    setSelectedSupplierType(newValue.map((subject) => subject.id));
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!formDetails.business_name.trim()) {
      toast.warn("Please enter a Business Name.");
      return;
    }

    if (!formDetails.phone.trim()) {
      toast.warn("Please enter a Phone number.");
      return;
    }

    const data = {
      be_information: {
        pan_number: formDetails.pan_number,
        is_Business: formDetails.registerd_type,
        gst_number: formDetails.gst_number,
        postal_address: formDetails.postal_address,
        business_name: formDetails.business_name,
        short_name: formDetails.short_name,
        phone: formDetails.phone,
        website: formDetails.website,
        cin_number: formDetails.cin_number,
        msme_number: formDetails.msme_number,
        module_id: 5,
        supplier_ids: JSON.stringify(selectedSupplierType),
        business_category_ids: JSON.stringify(selectedBusinessCategory),
        business_sub_categorys_ids: JSON.stringify(selectedBusinessSubCategory),
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Basic Information Updated Successfully");
        setTimeout(() => {
          setValue(1);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchBusinessCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.category) {
        setBusinessCategory(response.data.category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchBusinessCategory();
  }, []);

  const fetchBusinessSubCategory = async () => {
    const data = {
      sub_category: {
        business_category_ids: selectedBusinessCategory,
      },
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/sub_category/business_category_id`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.sub_categories) {
        setBusinessSubCategory(response.data.sub_categories);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchBusinessSubCategory();
  }, [selectedBusinessCategory]);

  const fetchSupplierType = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/supplier`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.supplier) {
        setSupplierType(response.data.supplier);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchSupplierType();
  }, []);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Is Business
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
              >
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Business"
                  name="is Business"
                  value={formDetails.is_Business}
                >
                  <FormControlLabel
                    value="registered"
                    control={<Radio />}
                    label="Registered"
                    disabled
                  />
                  <FormControlLabel
                    value="notregistered"
                    control={<Radio />}
                    label="Not Registered"
                    disabled
                  />
                </RadioGroup>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Basic Information
              </Typography>

              {formDetails.is_Business === "registered" ? (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    GST Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    onChange={(e) =>
                      handleFormChange("gst_number", e.target.value)
                    }
                    value={formDetails.gst_number}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                  />
                </div>
              ) : (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    PAN Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    onChange={(e) =>
                      handleFormChange("pan_number", e.target.value)
                    }
                    value={formDetails.pan_number}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                  />
                </div>
              )}

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Business Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("business_name", e.target.value)
                  }
                  value={formDetails.business_name}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Short Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("short_name", e.target.value)
                  }
                  value={formDetails.short_name}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Business Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={businessCategory}
                  getOptionLabel={(option) => option.category_name}
                  value={businessCategory.filter((sub) =>
                    selectedBusinessCategory.includes(sub.id)
                  )}
                  onChange={handleBusinessCategoryChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick subject..."
                      {...params}
                    />
                  )}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Business Sub Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={businessSubCategory}
                  getOptionLabel={(option) => option.sub_category_name}
                  value={businessSubCategory.filter((sub) =>
                    selectedBusinessSubCategory.includes(sub.id)
                  )}
                  onChange={handleBusinessSubCategoryChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick subject..."
                      {...params}
                    />
                  )}
                />
              </div>

              {formDetails.is_Business === "registered" ? (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    PAN Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    onChange={(e) =>
                      handleFormChange("pan_number", e.target.value)
                    }
                    value={formDetails.pan_number}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                  />
                </div>
              ) : (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    GST Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    onChange={(e) =>
                      handleFormChange("gst_number", e.target.value)
                    }
                    value={formDetails.gst_number}
                    name="category_name"
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Type Here"
                  />
                </div>
              )}
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Supplier Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={supplierType}
                  getOptionLabel={(option) => option.supplier_name}
                  value={supplierType.filter((sub) =>
                    selectedSupplierType.includes(sub.id)
                  )}
                  onChange={handleSupplierTypeChange}
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="section"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick subject..."
                      {...params}
                    />
                  )}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("postal_address", e.target.value)
                  }
                  value={formDetails.postal_address}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Pin Code <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("pin_code", e.target.value)}
                  value={formDetails.pin_code}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Website <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("website", e.target.value)}
                  value={formDetails.website}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Phone <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  value={formDetails.phone}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  CIN Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("cin_number", e.target.value)
                  }
                  value={formDetails.cin_number}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MSME Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("msme_number", e.target.value)
                  }
                  value={formDetails.msme_number}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            {/* <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Cancel
            </Button> */}
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Next
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default Basic;
