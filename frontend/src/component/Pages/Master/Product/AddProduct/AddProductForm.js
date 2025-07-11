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

import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logRoles } from "@testing-library/react";
import { Autocomplete } from "@material-ui/lab";
import AddProductClassFormPopUp from "../../ProductClass/AddProductClass/AddProductClass";
import AddProductMasterFormPopUp from "../../ProductMaster/AddProductMaster/AddProductMaster";
import AddProductChildCategoryFormPopUp from "../../ProductChildCategory/AddProductChildCategory/AddProductChildCategory";
import AddMarketerFormPopUp from "../../Marketer/AddMarketer/AddMarketer";
import AddBrandFormPopUp from "../../Brand/AddBrand/AddBrand";
import AddGstFormPopUp from "../../Gst/AddGst/AddGst";
import UploadPreview from "../../../../CustomComponent/UploadPreview";

// const initialData = {
//   product_name: "",
//   alias: "",
//   hsn_code: "",
//   primary_quantity: "1",
//   secondary_quantity: "",
//   piece_length: "",
//   piece_width: "",
//   piece_thickness: "",
//   piece_weight: "",
//   covering_length: "",
//   covering_width: "",
//   covering_thickness: "",
//   covering_weight: "",
//   minimum_order_quantity: "",
//   covering_quantity: "",
//   conversion: "",
//   discription: "",
//   specification: "",
//   benifits: "",
//   how_to_use: "",
//   country_of_origin: "",
//   disclaimar: "",
//   gst_applicable: "no",
// };

const initialData = {
  product_name: "",
  master_product_id: "",
  product_origin: "",
  item_category: "",
  alias: "",
  gst_applicable: "",
  gst_percent_id: "",
  brands_id: "",
  marketers_id: "",
  hsn_code: "",
  product_class_id: "",
  product_category_id: "",
  product_sub_category_id: "",
  discription: "",
  specification: "",
  benifits: "",
  how_to_use: "",
  country_of_origin: "",
  disclaimar: "",
};

function AddProductForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState(initialData);

  const [product, setProduct] = useState([]);
  const [oneProduct, setOneProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [productClassId, setProductClassId] = useState([]);
  const [selectedProductClass, setSelectedProductClass] = useState("");
  const [selectedProductClassId, setSelectedProductClassId] = useState("");

  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [selectedProductCategoryId, setSelectedProductCategoryId] =
    useState("");

  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const [gst, setGst] = useState([]);
  const [selectedGst, setSelectedGst] = useState("");
  const [selectedGstId, setSelectedGstId] = useState("");

  const [marketer, setMarketer] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState("");
  const [selectedMarketerId, setSelectedMarketerId] = useState("");

  const [thumbnailImage, setThumbnailImage] = useState([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState();

  const [isGst, setIsGst] = useState("no");

  const [openModal, setOpenModal] = useState(null);

  const classes = useStyles();

  const handlePopUp = (modalType = null) => {
    setOpenModal(modalType);
  };

  const handleFileUpload = (file) => {
    setThumbnailImage(file);
  };

  const handleThumbnailImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
    if (fieldName === "product_origin" && value === "indigenous") {
      setSelectedCountry("1");
      setSelectedCountryId("1");
    } else {
      setSelectedCountry("");
      setSelectedCountryId("");
    }
  };

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    setSelectedProductId(newValue.id);
  };

  const handleClassChange = (event, newValue) => {
    setSelectedProductClass(newValue);
    setSelectedProductClassId(newValue.id);
  };

  const handleProductCategoryChange = (event, newValue) => {
    setSelectedProductCategory(newValue);
    setSelectedProductCategoryId(newValue.id);
  };

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    setSelectedCountryId(newValue.id);
  };

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);
    setSelectedBrandId(newValue.id);
  };

  useEffect(() => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      product_name: `${selectedBrand.brand_name} ${selectedProduct.product_name}`,
    }));
  }, [selectedBrand, selectedProduct]);

  const handleGstChange = (event, newValue) => {
    setSelectedGst(newValue);
    setSelectedGstId(newValue.id);
  };

  const handleMarketerChange = (event, newValue) => {
    setSelectedMarketer(newValue);
    setSelectedMarketerId(newValue.id);
  };

  const handleClose = () => {
    navigate("/item-list");
  };

  const handleFormSubmit = async () => {
    const productClassString = String(selectedProductClass);
    const productCategoryString = String(selectedProductCategory);
    const productGstString = String(selectedGst);
    const productBrandString = String(selectedBrand);
    const productMarketerString = String(selectedMarketer);
    const productProductString = String(selectedProduct);

    if (!productProductString.trim()) {
      toast.warn("Please Select a product.");
      return;
    }
    if (!formDetails.product_name.trim()) {
      toast.warn("Please Enter a Product Name.");
      return;
    }
    if (!formDetails.hsn_code.trim()) {
      toast.warn("Please Enter a HSN code.");
      return;
    }
    if (!productClassString.trim()) {
      toast.warn("Please Select a item class.");
      return;
    }
    if (!productCategoryString.trim()) {
      toast.warn("Please Select a product child category.");
      return;
    }
    if (!productMarketerString.trim()) {
      toast.warn("Please Select a Marketer");
      return;
    }
    if (!productBrandString.trim()) {
      toast.warn("Please Select a Brand");
      return;
    }

    if (isGst === "yes") {
      if (!productGstString || productGstString.trim() === "") {
        toast.warn("GST is mandatory. Please Enter a GST value.");
        return;
      }
    }

    try {
      const formData = new FormData();

      const productData = {
        product_name: formDetails.product_name,
        master_product_id: selectedProductId,
        alias: formDetails.alias,
        gst_applicable: formDetails.gst_applicable,
        gst_percent_id: selectedGstId || null,
        brands_id: selectedBrandId || null,
        marketers_id: selectedMarketerId || null,
        hsn_code: formDetails.hsn_code,
        product_class_id: selectedProductClassId,
        product_origin: formDetails.product_origin,
        item_category: formDetails.item_category,
        product_child_category_id: selectedProductCategoryId,
        discription: formDetails.discription,
        specification: formDetails.specification,
        benifits: formDetails.benifits,
        how_to_use: formDetails.how_to_use,
        country_of_origin: selectedCountryId,
        disclaimar: formDetails.disclaimar,
      };

      console.log("productData", productData);

      formData.append("product", JSON.stringify(productData));
      formData.append("product_image", thumbnailImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product created successfully!");
        setTimeout(() => {
          navigate(`/item-list`);
        }, 2000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(`Product is not created! ${response.data.message}`);
      }
    } catch (error) {
      // Handling errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display the error message from the API response
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        // Generic error message for other types of errors
        toast.error("An unexpected error occurred while creating the exam.");
      }
      console.error("An error occurred:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.master_product) {
        setProduct(response.data.master_product);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchOneProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product/${selectedProductId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.master_product) {
        setFormDetails({
          ...formDetails,
          gst_applicable: response.data.master_product.gst_applicable || "",
          hsn_code: response.data.master_product.hsn_code || "",
        });
        setOneProduct(response.data.master_product);
        setSelectedProductCategory(
          response.data.master_product.product_child_category_id || ""
        );
        setSelectedProductCategoryId(
          response.data.master_product.product_child_category_id.id || ""
        );

        setIsGst(response.data.master_product.gst_applicable || "no");
        setSelectedGst(response.data.master_product.gst_id || "");
        setSelectedGstId(response.data.master_product.gst_id.id || "");
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchOneProduct(selectedProductId);
  }, [selectedProductId]);

  const fetchProductClass = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_class`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.productClass) {
        setProductClassId(response.data.productClass);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchProductClass();
  }, []);

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

  const fetchCountry = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/country`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.country) {
        setCountry(response.data.country);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Country:", error);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  const fetchBrand = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/marketers_id/${selectedMarketerId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.brand) {
        setBrand(response.data.brand);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [selectedMarketer]);

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

  const fetchMarketer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.marketers) {
        setMarketer(response.data.marketers);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Marketer:", error);
    }
  };

  useEffect(() => {
    fetchMarketer();
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
    fetchProduct: fetchProduct,
    fetchProductClass: fetchProductClass,
    fetchProductCategory: fetchProductCategory,
    fetchBrand: fetchBrand,
    fetchMarketer: fetchMarketer,
    fetchGst: fetchGst,
  };

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
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Item Information
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={product || []}
                  value={selectedProduct}
                  onChange={handleProductChange}
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
                <div>
                  <Button
                    className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                    onClick={() => handlePopUp("product")}
                  >
                    Request Product
                  </Button>
                </div>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marketer <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={marketer || []}
                  value={selectedMarketer}
                  onChange={handleMarketerChange}
                  disableClearable
                  getOptionLabel={(option) =>
                    option
                      ? `${option.marketer_name} (${option.alias_name})`
                      : ""
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
                <div>
                  <Button
                    className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                    onClick={() => handlePopUp("marketer")}
                  >
                    Request Marketer
                  </Button>
                </div>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Brand <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={brand || []}
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  disableClearable
                  getOptionLabel={(option) => option.brand_name}
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
                <div>
                  <Button
                    className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                    onClick={() => handlePopUp("brand")}
                  >
                    Request Brand
                  </Button>
                </div>
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
                  Item Category <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="country"
                  required
                  value={formDetails.item_category}
                  onChange={(e) =>
                    handleFormChange("item_category", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>

                  <MenuItem value="mfg&mkt">MFG & MKT</MenuItem>
                  <MenuItem value="imp&mkt">IMP & MKT</MenuItem>
                  <MenuItem value="traded&mkt">TRADED & MKT</MenuItem>
                  <MenuItem value="trade&wholesale">Trade & wholesale</MenuItem>
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Origin <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="country"
                  required
                  value={formDetails.product_origin}
                  onChange={(e) =>
                    handleFormChange("product_origin", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>

                  <MenuItem value="indigenous">Indigenous</MenuItem>
                  <MenuItem value="imported">Imported</MenuItem>
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Country Of Origin
                </FormLabel>
                {/* <TextField
                  value={formDetails.country_of_origin}
                  onChange={(e) =>
                    handleFormChange("country_of_origin", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                /> */}
                <Autocomplete
                  id="state-autocomplete"
                  options={country || []}
                  value={
                    country?.find(
                      (sub) => sub.id === Number(selectedCountry)
                    ) || null
                  }
                  onChange={handleCountryChange}
                  disableClearable
                  getOptionLabel={(option) => option.country_name}
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
                  disabled={formDetails.product_origin === "indigenous"}
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
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize6} ${classes.fontstylenormal} ${classes.fw600} ${classes.lineheight}`}
                >
                  Item Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.product_name}
                  onChange={(e) =>
                    handleFormChange("product_name", e.target.value)
                  }
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
                  Alias Name
                </FormLabel>
                <TextField
                  value={formDetails.alias}
                  onChange={(e) => handleFormChange("alias", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
                <Typography
                  variant="subtitle1"
                  className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fontsize3}`}
                >
                  Note: Alias Name seperated by comma ( , )
                </Typography>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Item Class <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={productClassId || []}
                  value={selectedProductClass}
                  onChange={handleClassChange}
                  disableClearable
                  getOptionLabel={(option) => option.class_name}
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
                <div>
                  <Button
                    className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                    onClick={() => handlePopUp("productClass")}
                  >
                    Create Item Class
                  </Button>
                </div>
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
                      // placeholder="Type to pick..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                  disabled
                />
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
                  // placeholder="Enter Name"
                  disabled
                />
              </div>

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
                    control={<Radio onClick={() => setIsGst("yes")} disabled />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio onClick={() => setIsGst("no")} disabled />}
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
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // placeholder="Type to pick..."
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
              ></div>
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
                  Product Images
                </FormLabel>
                <TextField
                  onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            {/* <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Other Information
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Primary unit <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={unit || []}
                  value={primaryUnit}
                  onChange={handlePrimaryUnitChange}
                  disableClearable
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Secondary unit
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={unit || []}
                  value={secondaryUnit}
                  onChange={handleSecondaryUnitChange}
                  disableClearable
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Covering unit
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={unit || []}
                  value={coveringUnit}
                  onChange={handleCoveringUnitChange}
                  disableClearable
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
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w36}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
                >
                  {secondaryUnit && (
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
                          value={formDetails.primary_quantity}
                          className={`${classes.w68} ${classes.mr0_5}`}
                          onChange={(e) =>
                            handleFormChange("primary_quantity", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                        {primaryUnit.unit_name}
                      </div>
                    </>
                  )}
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                >
                  {secondaryUnit && (
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
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
                >
                  {secondaryUnit && (
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
                          value={formDetails.secondary_quantity}
                          className={`${classes.w68} ${classes.mr0_5}`}
                          onChange={(e) =>
                            handleFormChange(
                              "secondary_quantity",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                        {secondaryUnit.unit_name}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w36}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
                >
                  {coveringUnit && (
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
                          value={formDetails.primary_quantity}
                          className={`${classes.w68} ${classes.mr0_5}`}
                          onChange={(e) =>
                            handleFormChange("primary_quantity", e.target.value)
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                          disabled
                        />
                        {primaryUnit.unit_name}
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifycenter} ${classes.w5}`}
                >
                  {coveringUnit && (
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
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
                >
                  {coveringUnit && (
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
                          value={formDetails.covering_quantity}
                          className={`${classes.w68} ${classes.mr0_5}`}
                          onChange={(e) =>
                            handleFormChange(
                              "covering_quantity",
                              e.target.value
                            )
                          }
                          type="text"
                          variant="outlined"
                          required
                          placeholder="Enter Name"
                        />
                        {coveringUnit.unit_name}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Piece (Bag/Bottle)
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  length / (mm)
                </FormLabel>
                <TextField
                  value={formDetails.piece_length}
                  onChange={(e) =>
                    handleFormChange("piece_length", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  width / (mm)
                </FormLabel>
                <TextField
                  value={formDetails.piece_width}
                  onChange={(e) =>
                    handleFormChange("piece_width", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Thickness / (mm){" "}
                </FormLabel>
                <TextField
                  value={formDetails.piece_thickness}
                  onChange={(e) =>
                    handleFormChange("piece_thickness", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  weight
                </FormLabel>
                <TextField
                  value={formDetails.piece_weight}
                  onChange={(e) =>
                    handleFormChange("piece_weight", e.target.value)
                  }
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
              >
                Covering (Bag/Box/Drum)
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  length / (mm)
                </FormLabel>
                <TextField
                  value={formDetails.covering_length}
                  onChange={(e) =>
                    handleFormChange("covering_length", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  width / (mm)
                </FormLabel>
                <TextField
                  value={formDetails.covering_width}
                  onChange={(e) =>
                    handleFormChange("covering_width", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Thickness / (mm){" "}
                </FormLabel>
                <TextField
                  value={formDetails.covering_thickness}
                  onChange={(e) =>
                    handleFormChange("covering_thickness", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w18}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  weight
                </FormLabel>
                <TextField
                  value={formDetails.covering_weight}
                  onChange={(e) =>
                    handleFormChange("covering_weight", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>
            </div> */}
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              >
                Item Details
              </Typography>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Description
                </FormLabel>
                <TextField
                  value={formDetails.discription}
                  onChange={(e) =>
                    handleFormChange("discription", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Specification
                </FormLabel>
                <TextField
                  value={formDetails.specification}
                  onChange={(e) =>
                    handleFormChange("specification", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Benifits
                </FormLabel>
                <TextField
                  value={formDetails.benifits}
                  onChange={(e) => handleFormChange("benifits", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  How To Use
                </FormLabel>
                <TextField
                  value={formDetails.how_to_use}
                  onChange={(e) =>
                    handleFormChange("how_to_use", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
              </div>
            </div>

            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                        ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Disclaimer
                </FormLabel>
                <TextField
                  value={formDetails.disclaimar}
                  onChange={(e) =>
                    handleFormChange("disclaimar", e.target.value)
                  }
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal === "product"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddProductMasterFormPopUp style={Heading} />
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal === "productClass"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddProductClassFormPopUp style={Heading} />
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
        <Modal
          className={`${classes.modal}`}
          open={openModal === "marketer"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <AddMarketerFormPopUp style={Heading} />
        </Modal>
        <Modal
          className={`${classes.modal}`}
          open={openModal === "brand"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <AddBrandFormPopUp style={Heading} />
        </Modal>
        <Modal
          className={`${classes.modal}`}
          open={openModal === "gst"}
          onClose={() => handlePopUp(null)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <AddGstFormPopUp style={Heading} />
        </Modal>
      </div>
    </>
  );
}
export default AddProductForm;
