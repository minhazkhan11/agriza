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
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

const initialData = {
  product_name: "",
  is_license: "",
  hsn_code: "",
  gst_applicable: "",
  gst_percent_id: "",
  product_child_category_id: "",
};

function EditProductMasterForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const { state } = useLocation();
  const rowId = state;
  const classes = useStyles();

  const [formDetails, setFormDetails] = useState(initialData);
  const [selectedLicense, setSelectedLicense] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [selectedProductCategoryId, setSelectedProductCategoryId] =
    useState("");

  const [isGst, setIsGst] = useState("no");

  const [gst, setGst] = useState([]);
  const [selectedGst, setSelectedGst] = useState("");
  const [selectedGstId, setSelectedGstId] = useState("");

  const handleLicenseChange = (event) => {
    setSelectedLicense(event.target.value);
  };

  const handleProductCategoryChange = (event, newValue) => {
    setSelectedProductCategory(newValue);
    setSelectedProductCategoryId(newValue.id);
  };

  const handleGstChange = (event, newValue) => {
    setSelectedGst(newValue);
    setSelectedGstId(newValue.id);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleClose = () => {
    navigate("/product-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.master_product;
        setFormDetails({
          ...formDetails,
          product_name: data.product_name,
          hsn_code: data.hsn_code,
          gst_applicable: data.gst_applicable,
        });
        setIsGst(data.gst_applicable);
        setSelectedProductCategoryId(data.product_child_category_id.id);
        setSelectedProductCategory(data.product_child_category_id);
        setSelectedGstId(data.gst_id.id);
        setSelectedGst(data.gst_id);
        setSelectedLicense(data.is_license);
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

  const handleFormSubmit = () => {
    if (!formDetails.product_name.trim()) {
      toast.warn("Please Enter a Product.");
      return;
    }
    const data = {
      master_product: {
        id: rowId,
        product_name: formDetails.product_name,
        is_license: selectedLicense,
        hsn_code: formDetails.hsn_code,
        gst_applicable: formDetails.gst_applicable,
        gst_id: selectedGstId,
        product_child_category_id: selectedProductCategoryId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          navigate("/product-list");
        }, 2000);
        toast.success("Product updated successfully");
      })
      .catch((error) => {
        console.error("Error changed Product status:", error);
        toast.error("Product is not updated");
      });
  };

  const fetchProductCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_child_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.product_child_category) {
        setProductCategory(response.data.product_child_category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Product Child Category:", error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const fetchGst = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/gst_percent`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setGst(response.data.gst_percent);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchGst();
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
        className={`${classes.mt1}  ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
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
                Product Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("product_name", e.target.value)
                  }
                  value={formDetails.product_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Is License <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="country"
                  required
                  value={selectedLicense}
                  onChange={handleLicenseChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>

                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  HSN Code <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.hsn_code}
                  onChange={(e) => handleFormChange("hsn_code", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
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
                  Is GST Applicable
                </FormLabel>
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Gst"
                  name="is Gst"
                  value={isGst}
                  onChange={(e) =>
                    handleFormChange("gst_applicable", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio onClick={() => setIsGst("yes")} />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio onClick={() => setIsGst("no")} />}
                    label="No"
                  />
                </RadioGroup>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST Percent % <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={gst || []}
                  value={formDetails.gst_applicable === "no" ? "" : selectedGst}
                  onChange={handleGstChange}
                  disableClearable
                  getOptionLabel={(option) => option.gst_name}
                  autoHighlight
                  disabled={isGst === "no"}
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
                  Product Child Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={productCategory || []}
                  value={selectedProductCategory}
                  onChange={handleProductCategoryChange}
                  disableClearable
                  getOptionLabel={(option) =>
                    option.product_child_category_name
                  }
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
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}}`}
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
export default EditProductMasterForm;
