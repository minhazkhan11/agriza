import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import AddProductChildCategoryFormPopUp from "../../ProductChildCategory/AddProductChildCategory/AddProductChildCategory";
import AddGstFormPopUp from "../../Gst/AddGst/AddGst";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

const initialData = {
  product_name: "",
  is_license: "",
  hsn_code: "",
  gst_applicable: "",
  gst_percent_id: "",
  product_child_category_id: "",
};

function AddProductMasterForm({ style }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

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

  const [openModal, setOpenModal] = useState(null);

  const handlePopUp = (modalType = null) => {
    setOpenModal(modalType);
  };

  const classes = useStyles();

  const handleLicenseChange = (event) => {
    console.log("handleLicenseChange", event.target.value);
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
    style?.isPopUp ? style?.onClose() : navigate("/product-list");
  };

  const handleFormSubmit = () => {
    const productCategoryString = String(selectedProductCategoryId);
    const productGstString = String(selectedGst);

    console.log("selectedLicense", selectedLicense);

    if (!formDetails.product_name.trim()) {
      toast.warn("Please enter product name.");
      return;
    }
    if (!selectedLicense.trim()) {
      toast.warn("Please select is License.");
      return;
    }
    if (!formDetails.hsn_code.trim()) {
      toast.warn("Please select is HSN Code.");
      return;
    }
    if (!formDetails.gst_applicable.trim()) {
      toast.warn("Please select is Gst Applicable.");
      return;
    }
    if (isGst === "yes") {
      if (!productGstString || productGstString.trim() === "") {
        toast.warn("GST is mandatory. Please Enter a GST value.");
        return;
      }
    }
    if (!productCategoryString.trim()) {
      toast.warn("Please select is product Child Category.");
      return;
    }

    const data = {
      master_product: {
        product_name: formDetails.product_name,
        is_license: selectedLicense,
        hsn_code: formDetails.hsn_code,
        gst_applicable: formDetails.gst_applicable,
        gst_id: selectedGstId,
        product_child_category_id: selectedProductCategoryId,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Product Created Successfully");
        setTimeout(() => {
          style?.isPopUp ? navigate("/create-item") : navigate("/product-list");
          style?.isPopUp && style?.onClose();
          style?.isPopUp && style?.fetchProduct();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
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

  const Heading = {
    width: "w65",
    bgcolor: "bgwhite",
    marginbottom: "mb1",
    isPopUp: "yes",
    navigateto: "/create-item",
    onClose: handlePopUp,
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
                {isGst === "yes" && !style?.isPopUp && (
                  <div>
                    <Button
                      // className={` ${classes.textdecorationnone}`}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      onClick={handlePopUp}
                    >
                      Create GST Percent %
                    </Button>
                  </div>
                )}
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
                {!style?.isPopUp && (
                  <div>
                    <Button
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      onClick={() => handlePopUp("productChildCategory")}
                    >
                      Create Product Child Category
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes.mt1
            } ${classes[style?.marginbottom]}`}
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
          className={`${classes.modal}`}
          open={openModal === "gst"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddGstFormPopUp style={Heading} />
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal === "productChildCategory"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddProductChildCategoryFormPopUp style={Heading} />
        </Modal>
      </div>
    </>
  );
}
export default AddProductMasterForm;
