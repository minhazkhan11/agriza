import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  Checkbox,
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
import useStyles from "../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import AddLeadProduct from "../ViewLead/AddLeadProduct";

const initialData = {
  lead_category_id: "",
  lead_subcategory_id: "",
  is_bussiness: "yes",
  gst_number: "",
  pan_number: "",
  type_of_organization: "",
  business_name: "",
  r_office_address: "",
  r_office_pincode_id: "",
  r_office_place_id: "",
  postal_office_address: "",
  postal_office_pincode_id: "",
  postal_office_place_id: "",
  year_of_establishment: "",
  nearest_rack_point_id: [],
  product_category_ids: [],
  product_sub_category_ids: [],
  product_child_category_ids: [],
  discreet_marketer_id: [],
  name_of_dealing_person: "",
  mobile_number: "",
  whatsapp_number: "",
  email: "",
  alternative_number: "",
  pesticide_license_number: "",
  seed_license_number: "",
  msme_udyam_registration_number: "",
  business_license_type: "",
  wholesaler_fertilizer_license_number: "",
  wholesaler_fms_id: "",
  retailer_fertilizer_license_number: "",
  retailer_fms_id: "",
};

function AddLeadForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const classes = useStyles();

  const [formDetails, setFormDetails] = useState(initialData);

  const [pin, setPin] = useState([]);

  const [gstPlace, setGstPlace] = useState([]);
  const [postalPlace, setPostalPlace] = useState([]);

  const [gstDistrictStateTehsil, setGstDistrictStateTehsil] = useState([]);
  const [postalDistrictStateTehsil, setPostalDistrictStateTehsil] = useState(
    []
  );

  const [leadCategory, setLeadCategory] = useState([]);
  const [leadSubCategory, setLeadSubCategory] = useState([]);
  const [constitutions, setConstitutions] = useState([]);

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState([]);
  const [selectedProductCategoryIds, setSelectedProductCategoryIds] = useState(
    []
  );

  const [productSubCategory, setProductSubCategory] = useState([]);
  const [selectedProductSubCategory, setSelectedProductSubCategory] = useState(
    []
  );
  const [selectedProductSubCategoryIds, setSelectedProductSubCategoryIds] =
    useState([]);

  const [productChildCategory, setProductChildCategory] = useState([]);
  const [selectedProductChildCategory, setSelectedProductChildCategory] =
    useState([]);
  const [selectedProductChildCategoryIds, setSelectedProductChildCategoryIds] =
    useState([]);

  const [discreetMarketer, setDiscreetMarketer] = useState([]);
  const [selectedDiscreetMarketer, setSelectedDiscreetMarketer] = useState([]);
  const [selectedDiscreetMarketerIds, setSelectedDiscreetMarketerIds] =
    useState([]);

  const [rackPoint, setRackPoint] = useState([]);

  const [checkedAddress, setCheckedAddress] = useState(false);

  const [open, setOpen] = useState();
  const [rowId, setRowId] = useState();

  const [selectAllCategories, setSelectAllCategories] = useState({
    productCategory: false,
    productSubCategory: false,
    productChildCategory: false,
    discreetMarketer: false,
  });

  const handleSelectAllChange = (
    categoryKey,
    options,
    setSelectedState,
    setSelectedIds
  ) => {
    const isAllSelected = !selectAllCategories[categoryKey];
    const newSelection = isAllSelected ? options : [];

    setSelectedState(newSelection);
    setSelectedIds(newSelection.map((item) => item.id));

    setSelectAllCategories((prev) => ({
      ...prev,
      [categoryKey]: isAllSelected,
    }));
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setCheckedAddress(event.target.checked);

    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      postal_office_address: formDetails.r_office_address,
      postal_office_pincode_id: formDetails.r_office_pincode_id,
      postal_office_place_id: formDetails.r_office_place_id,
    }));
  };

  useEffect(() => {
    if (checkedAddress) {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        postal_office_address: formDetails.r_office_address,
        postal_office_pincode_id: formDetails.r_office_pincode_id,
        postal_office_place_id: formDetails.r_office_place_id,
      }));
    }
  }, [
    formDetails.r_office_address,
    formDetails.r_office_pincode_id,
    formDetails.r_office_place_id,
  ]);

  const handleClose = () => {
    navigate("/lead-list");
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!String(formDetails.lead_category_id).trim()) {
      toast.warn("Please select the Lead Category.");
      return;
    }

    if (!String(selectedProductCategoryIds).trim()) {
      toast.warn("Please select the Product Category.");
      return;
    }

    if (!String(selectedDiscreetMarketerIds).trim()) {
      toast.warn("Please select the Direct Marketer.");
      return;
    }

    if (formDetails.is_bussiness === "yes") {
      if (!formDetails.gst_number || !formDetails.gst_number.trim()) {
        toast.warn("Please enter the GST number.");
        return;
      }
      if (!formDetails.pan_number || !formDetails.pan_number.trim()) {
        toast.warn("Please enter the PAN number.");
        return;
      }
    } else {
      if (!formDetails.pan_number || !formDetails.pan_number.trim()) {
        toast.warn("Please enter the PAN number.");
        return;
      }
    }

    if (!String(formDetails.type_of_organization).trim()) {
      toast.warn("Please select the Type Of Organization.");
      return;
    }

    if (!formDetails.business_name.trim()) {
      toast.warn("Please enter a Business Name.");
      return;
    }

    if (!formDetails.year_of_establishment.trim()) {
      toast.warn("Please enter a Year Of Establishment.");
      return;
    }

    if (!formDetails.r_office_address.trim()) {
      toast.warn("Please enter a GST Address.");
      return;
    }

    if (!String(formDetails.r_office_pincode_id).trim()) {
      toast.warn("Please enter a GST Pincode.");
      return;
    }

    if (!String(formDetails.r_office_place_id).trim()) {
      toast.warn("Please enter a GST Place.");
      return;
    }

    if (!formDetails.postal_office_address.trim()) {
      toast.warn("Please enter a Postal Address.");
      return;
    }

    if (!String(formDetails.postal_office_pincode_id).trim()) {
      toast.warn("Please enter a Postal Pincode.");
      return;
    }

    if (!String(formDetails.postal_office_place_id).trim()) {
      toast.warn("Please enter a Postal Place.");
      return;
    }

    if (!formDetails.name_of_dealing_person.trim()) {
      toast.warn("Please enter a Name Of Dealing Person.");
      return;
    }

    if (!formDetails.email.trim()) {
      toast.warn("Please enter a Email.");
      return;
    }

    if (!formDetails.mobile_number.trim()) {
      toast.warn("Please enter a Mobile Number.");
      return;
    }

    const data = {
      lead: {
        lead_category_id: formDetails.lead_category_id,
        lead_subcategory_id: formDetails.lead_subcategory_id,
        is_bussiness: formDetails.is_bussiness,
        gst_number: formDetails.gst_number,
        pan_number: formDetails.pan_number,
        type_of_organization: formDetails.type_of_organization,
        business_name: formDetails.business_name,
        r_office_address: formDetails.r_office_address,
        r_office_pincode_id: formDetails.r_office_pincode_id,
        r_office_place_id: formDetails.r_office_place_id,
        postal_office_address: formDetails.postal_office_address,
        postal_office_pincode_id: formDetails.postal_office_pincode_id,
        postal_office_place_id: formDetails.postal_office_place_id,
        year_of_establishment: formDetails.year_of_establishment,
        nearest_rack_point_id: formDetails.nearest_rack_point_id,
        product_category_ids: selectedProductCategoryIds,
        product_sub_category_ids: selectedProductSubCategoryIds,
        product_child_category_ids: selectedProductChildCategoryIds,
        discreet_marketer_id: selectedDiscreetMarketerIds,
        name_of_dealing_person: formDetails.name_of_dealing_person,
        mobile_number: formDetails.mobile_number,
        whatsapp_number: formDetails.whatsapp_number,
        email: formDetails.email,
        alternative_number: formDetails.alternative_number,
        pesticide_license_number: formDetails.pesticide_license_number,
        seed_license_number: formDetails.seed_license_number,
        msme_udyam_registration_number:
          formDetails.msme_udyam_registration_number,
        business_license_type: formDetails.business_license_type,
        wholesaler_fertilizer_license_number:
          formDetails.wholesaler_fertilizer_license_number,
        wholesaler_fms_id: formDetails.wholesaler_fms_id,
        retailer_fertilizer_license_number:
          formDetails.retailer_fertilizer_license_number,
        retailer_fms_id: formDetails.retailer_fms_id,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/leads/add`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        toast.success("Lead Created Successfully");
        setTimeout(() => {
          navigate("/lead-list");
          setRowId(response.data.lead.id);
          handlePopUp();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchLeadCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/lead_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.lead_category) {
        setLeadCategory(response.data?.lead_category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchLeadCategory();
  }, []);

  const fetchLeadSubCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/lead_sub_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.lead_sub_category) {
        setLeadSubCategory(response.data?.lead_sub_category);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchLeadSubCategory();
  }, []);

  const fetchConstitutions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/constitutions`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.constitutions) {
        setConstitutions(response.data.constitutions);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching constitutions:", error);
    }
  };

  useEffect(() => {
    fetchConstitutions();
  }, []);

  const fetchProductCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.productCategory) {
        setProductCategory(response.data.productCategory);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching constitutions:", error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const fetchProductSubCategory = async (ids) => {
    const data = {
      ids: selectedProductCategoryIds,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_sub_category/category_id`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProductSubCategory(response.data.product_sub_category);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchProductSubCategory();
  }, [selectedProductCategory]);

  const fetchProductChildCategory = async () => {
    const data = {
      ids: selectedProductSubCategoryIds,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_child_category/category_id`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProductChildCategory(response.data.product_child_category);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchProductChildCategory();
  }, [selectedProductSubCategory]);

  const fetchRackPoint = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/rack_point`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.rakepoints) {
        setRackPoint(response.data.rakepoints);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching constitutions:", error);
    }
  };

  useEffect(() => {
    fetchRackPoint();
  }, []);

  const fetchDiscreetMarketer = async () => {
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
        setDiscreetMarketer(response.data.marketers);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching constitutions:", error);
    }
  };

  useEffect(() => {
    fetchDiscreetMarketer();
  }, []);

  const fetchPin = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setPin(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPin();
  }, []);

  const fetchGstPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails.r_office_pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setGstPlace(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchGstPlace(formDetails.r_office_pincode_id);
  }, [formDetails.r_office_pincode_id]);

  const fetchPostalPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails.postal_office_pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setPostalPlace(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPostalPlace(formDetails.postal_office_pincode_id);
  }, [formDetails.postal_office_pincode_id]);

  const fetchGstDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${formDetails.r_office_pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setGstDistrictStateTehsil(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchGstDistrictStateTehsil(formDetails.r_office_pincode_id);
  }, [formDetails.r_office_pincode_id]);

  const fetchPostalDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${formDetails.postal_office_pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setPostalDistrictStateTehsil(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPostalDistrictStateTehsil(formDetails.postal_office_pincode_id);
  }, [formDetails.postal_office_pincode_id]);

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
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
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
                Lead Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Lead Category <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={leadCategory || []}
                  value={
                    leadCategory?.find(
                      (sub) => sub.id === formDetails.lead_category_id
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("lead_category_id", newValue.id)
                  }
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick Lead category..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />

                {/* {!style?.isPopUp && (
                  <div>
                    <Button
                      // className={` ${classes.textdecorationnone}`}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      // onClick={handlePopUp}
                    >
                      Create Lead Category
                    </Button>
                  </div>
                )} */}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Lead Sub Category{" "}
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={leadSubCategory || []}
                  value={
                    leadSubCategory?.find(
                      (sub) => sub.id === formDetails.lead_subcategory_id
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("lead_subcategory_id", newValue.id)
                  }
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick Lead Sub category..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />

                {/* {!style?.isPopUp && (
                  <div>
                    <Button
                      // className={` ${classes.textdecorationnone}`}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.textcolorlink} ${classes.fontsize3} ${classes.textdecorationnone}  ${classes.texttransformcapitalize}`}
                      // onClick={handlePopUp}
                    >
                      Create Lead Category
                    </Button>
                  </div>
                )} */}
              </div>
              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="tags-standard"
                  options={productCategory || []}
                  getOptionLabel={(option) => option.category_name}
                  value={
                    productCategory?.find(
                      (sub) => sub.id === formDetails.product_category_id
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("product_category_id", newValue.id)
                  }
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
              </div> */}
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.selectallcheckbox}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Category{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="section-autocomplete"
                  options={productCategory || []}
                  disableClearable
                  disableCloseOnSelect
                  getOptionLabel={(section) => section.category_name}
                  required
                  value={selectedProductCategory}
                  onChange={(event, newValue) => {
                    setSelectedProductCategory(newValue);
                    // Update the selected section IDs when the user makes selections
                    const selectedIds = newValue.map((section) => section.id);
                    setSelectedProductCategoryIds(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Type to pick"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectAllCategories.productCategory}
                                  onChange={() =>
                                    handleSelectAllChange(
                                      "productCategory",
                                      productCategory,
                                      setSelectedProductCategory,
                                      setSelectedProductCategoryIds
                                    )
                                  }
                                />
                              }
                            />
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  // renderInput={(params) => (
                  //   <TextField
                  //     placeholder="Type to pick or create tag..."
                  //     {...params}
                  //     variant="outlined"
                  //   />
                  // )}
                  renderOption={(option, { selected }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      }
                      label={option.category_name} // Display the section_name in the dropdown
                    />
                  )}
                  renderTags={() => null}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.selectallcheckbox}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Sub Category
                </FormLabel>
                <Autocomplete
                  multiple
                  id="section-autocomplete"
                  options={productSubCategory || []}
                  disableClearable
                  disableCloseOnSelect
                  getOptionLabel={(section) =>
                    section.product_sub_category_name
                  }
                  required
                  value={selectedProductSubCategory}
                  onChange={(event, newValue) => {
                    setSelectedProductSubCategory(newValue);
                    // Update the selected section IDs when the user makes selections
                    const selectedIds = newValue.map((section) => section.id);
                    setSelectedProductSubCategoryIds(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Type to pick"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    selectAllCategories.productSubCategory
                                  }
                                  onChange={() =>
                                    handleSelectAllChange(
                                      "productSubCategory",
                                      productSubCategory,
                                      setSelectedProductSubCategory,
                                      setSelectedProductSubCategoryIds
                                    )
                                  }
                                />
                              }
                            />
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(option, { selected }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      }
                      label={option.product_sub_category_name} // Display the section_name in the dropdown
                    />
                  )}
                  renderTags={() => null}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.selectallcheckbox}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Product Child Category
                </FormLabel>
                <Autocomplete
                  multiple
                  id="section-autocomplete"
                  options={productChildCategory || []}
                  disableClearable
                  disableCloseOnSelect
                  getOptionLabel={(section) =>
                    section.product_child_category_name
                  }
                  required
                  value={selectedProductChildCategory}
                  onChange={(event, newValue) => {
                    setSelectedProductChildCategory(newValue);
                    // Update the selected section IDs when the user makes selections
                    const selectedIds = newValue.map((section) => section.id);
                    setSelectedProductChildCategoryIds(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Type to pick"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    selectAllCategories.productChildCategory
                                  }
                                  onChange={() =>
                                    handleSelectAllChange(
                                      "productChildCategory",
                                      productChildCategory,
                                      setSelectedProductChildCategory,
                                      setSelectedProductChildCategoryIds
                                    )
                                  }
                                />
                              }
                            />
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  // renderInput={(params) => (
                  //   <TextField
                  //     placeholder="Type to pick or create tag..."
                  //     {...params}
                  //     variant="outlined"
                  //   />
                  // )}
                  renderOption={(option, { selected }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      }
                      label={option.product_child_category_name} // Display the section_name in the dropdown
                    />
                  )}
                  renderTags={() => null}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.selectallcheckbox}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Direct Marketer{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="section-autocomplete"
                  options={discreetMarketer || []}
                  disableClearable
                  disableCloseOnSelect
                  getOptionLabel={(section) => section.marketer_name}
                  required
                  value={selectedDiscreetMarketer}
                  onChange={(event, newValue) => {
                    setSelectedDiscreetMarketer(newValue);
                    // Update the selected section IDs when the user makes selections
                    const selectedIds = newValue.map((section) => section.id);
                    setSelectedDiscreetMarketerIds(selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Type to pick"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectAllCategories.discreetMarketer}
                                  onChange={() =>
                                    handleSelectAllChange(
                                      "discreetMarketer",
                                      discreetMarketer,
                                      setSelectedDiscreetMarketer,
                                      setSelectedDiscreetMarketerIds
                                    )
                                  }
                                />
                              }
                            />
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  // renderInput={(params) => (
                  //   <TextField
                  //     placeholder="Type to pick or create tag..."
                  //     {...params}
                  //     variant="outlined"
                  //   />
                  // )}
                  renderOption={(option, { selected }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      }
                      label={option.marketer_name} // Display the section_name in the dropdown
                    />
                  )}
                  renderTags={() => null}
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
                Is Business GST Registered
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
              >
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Business"
                  name="is Business"
                  value={formDetails.is_bussiness}
                  onChange={(e) =>
                    handleFormChange("is_bussiness", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
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
                Basic Details
              </Typography>

              {formDetails.is_bussiness === "yes" ? (
                <>
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
                      name="gst_number"
                      type="text"
                      inputProps={{
                        maxLength: 15,
                      }}
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
                      PAN Number <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleFormChange("pan_number", e.target.value)
                      }
                      value={formDetails.pan_number}
                      name="category_name"
                      type="text"
                      inputProps={{
                        maxLength: 10,
                      }}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                    />
                  </div>
                </>
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
                    inputProps={{
                      maxLength: 10,
                    }}
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
                  Type Of Organization{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="tags-standard"
                  options={constitutions || []}
                  // value={selectedConstitutions}
                  getOptionLabel={(option) => option.name}
                  value={
                    constitutions?.find(
                      (sub) => sub.id === formDetails.type_of_organization
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("type_of_organization", newValue.id)
                  }
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

              {formDetails.is_bussiness === "no" && (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
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
                  Year Of Establishment{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("year_of_establishment", e.target.value)
                  }
                  value={formDetails.year_of_establishment}
                  name="year_of_establishment"
                  type="text"
                  inputProps={{
                    maxLength: 4, // Restrict to 4 digits (years)
                    inputMode: "numeric",
                    pattern: "[0-9]{4}", // Only 4-digit numbers allowed
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  variant="outlined"
                  required
                  placeholder="Enter Year"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Nearest Rack point
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={rackPoint || []}
                  getOptionLabel={(option) => option.rack_point}
                  value={rackPoint?.filter((sub) =>
                    formDetails?.nearest_rack_point_id.includes(sub.id)
                  )}
                  onChange={(event, newValue) =>
                    handleFormChange(
                      "nearest_rack_point_id",
                      newValue.map((item) => item.id)
                    )
                  }
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

              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Discreet Marketer{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={discreetMarketer || []}
                  getOptionLabel={(option) => option.marketer_name}
                  value={discreetMarketer?.filter((sub) =>
                    formDetails?.discreet_marketer_id.includes(sub.id)
                  )}
                  onChange={(event, newValue) =>
                    handleFormChange(
                      "discreet_marketer_id",
                      newValue.map((item) => item.id)
                    )
                  }
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
              </div> */}
            </div>
            {formDetails.is_bussiness === "yes" && (
              <>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    Gst Reg. Address Details
                  </Typography>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST Address{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={
                        (e) =>
                          handleFormChange("r_office_address", e.target.value) // Handle address input change
                      }
                      value={formDetails.r_office_address}
                      name="r_office_address"
                      type="text"
                      multiline
                      rows={4}
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      // fullWidth
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

                  {gstDistrictStateTehsil.state && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={gstDistrictStateTehsil.state.state_name}
                        // onChange={handleGstPinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={gstDistrictStateTehsil.state.state_name}
                        >
                          {gstDistrictStateTehsil.state.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {gstDistrictStateTehsil.district && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={gstDistrictStateTehsil.district.district_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={gstDistrictStateTehsil.district.district_name}
                        >
                          {" "}
                          {gstDistrictStateTehsil.district.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {gstDistrictStateTehsil.tehsil && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil
                      </FormLabel>

                      <Select
                        labelId="category-label"
                        id="country"
                        required
                        value={gstDistrictStateTehsil.tehsil.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={gstDistrictStateTehsil.tehsil.tehsil_name}
                        >
                          {gstDistrictStateTehsil.tehsil.tehsil_name}
                        </MenuItem>
                      </Select>
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
                      Pincode <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={pin || []}
                      value={
                        pin?.find(
                          (sub) => sub.id === formDetails.r_office_pincode_id
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleFormChange("r_office_pincode_id", newValue.id)
                      }
                      disableClearable
                      getOptionLabel={(option) => option.pin_code}
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
                      Place <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={gstPlace || []}
                      value={
                        gstPlace?.find(
                          (sub) => sub.id === formDetails.r_office_place_id
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleFormChange("r_office_place_id", newValue.id)
                      }
                      disableClearable
                      getOptionLabel={(option) => option.place_name}
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedAddress}
                          onChange={handleChange}
                          name="checked"
                          color="primary"
                        />
                      }
                      label="Same As Above"
                    />
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </div>
              </>
            )}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Postal Address Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Postal Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={
                    (e) =>
                      handleFormChange("postal_office_address", e.target.value) // Handle address input change
                  }
                  value={formDetails.postal_office_address}
                  name="postal_office_address"
                  type="text"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  disabled={checkedAddress}
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
              {postalDistrictStateTehsil.state && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    State
                  </FormLabel>

                  <Select
                    labelId="category-label"
                    id="country"
                    required
                    value={postalDistrictStateTehsil.state.state_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={postalDistrictStateTehsil.state.state_name}
                    >
                      {postalDistrictStateTehsil.state.state_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {postalDistrictStateTehsil.district && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    District
                  </FormLabel>

                  <Select
                    labelId="category-label"
                    id="country"
                    required
                    value={postalDistrictStateTehsil.district.district_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={postalDistrictStateTehsil.district.district_name}
                    >
                      {" "}
                      {postalDistrictStateTehsil.district.district_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {postalDistrictStateTehsil.tehsil && (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Tehsil
                  </FormLabel>

                  <Select
                    labelId="category-label"
                    id="country"
                    required
                    value={postalDistrictStateTehsil.tehsil.tehsil_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={postalDistrictStateTehsil.tehsil.tehsil_name}
                    >
                      {postalDistrictStateTehsil.tehsil.tehsil_name}
                    </MenuItem>
                  </Select>
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
                  Pincode <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={pin || []}
                  value={
                    pin?.find(
                      (sub) => sub.id === formDetails.postal_office_pincode_id
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("postal_office_pincode_id", newValue.id)
                  }
                  disableClearable
                  getOptionLabel={(option) => option.pin_code}
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
                  disabled={checkedAddress}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Place <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={postalPlace || []}
                  value={
                    postalPlace?.find(
                      (sub) => sub.id === formDetails.postal_office_place_id
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleFormChange("postal_office_place_id", newValue.id)
                  }
                  disableClearable
                  getOptionLabel={(option) => option.place_name}
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
                  disabled={checkedAddress}
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
              >
                Contact Info
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name Of Dealing Person{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("name_of_dealing_person", e.target.value)
                  }
                  value={formDetails.name_of_dealing_person}
                  name="name_of_dealing_person"
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
                  Email <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  value={formDetails.email}
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
                  Mobile Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("mobile_number", e.target.value)
                  }
                  value={formDetails.mobile_number}
                  name="category_name"
                  type="text"
                  inputProps={{
                    maxLength: 10,
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
                  Whatsapp Number
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("whatsapp_number", e.target.value)
                  }
                  value={formDetails.whatsapp_number}
                  name="category_name"
                  type="text"
                  inputProps={{
                    maxLength: 10,
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
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Alternate Phone Number
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("alternative_number", e.target.value)
                  }
                  value={formDetails.alternative_number}
                  name="category_name"
                  type="text"
                  inputProps={{
                    maxLength: 10,
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
                  placeholder="Type Here"
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
              >
                License Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.w75} ${classes.justifyspacebetween}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30} `}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Business License Type
                  </FormLabel>
                  <Select
                    labelId="category-label"
                    id="country"
                    required
                    value={formDetails.business_license_type}
                    onChange={(e) =>
                      handleFormChange("business_license_type", e.target.value)
                    }
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                  >
                    <MenuItem disabled value="">
                      <em className={classes.defaultselect}>Select Here</em>
                    </MenuItem>

                    <MenuItem value="wholesaler">Wholesaler</MenuItem>
                    <MenuItem value="retailer">Retailer</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
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
                className={`${classes.dflex} ${classes.w75} ${classes.justifyspacebetween}`}
              >
                {formDetails.business_license_type === "wholesaler" ||
                formDetails.business_license_type === "both" ? (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Wholesaler Fertilizer License Number
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(
                            "wholesaler_fertilizer_license_number",
                            e.target.value
                          )
                        }
                        value={formDetails.wholesaler_fertilizer_license_number}
                        name="wholesaler_fertilizer_license_number"
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
                        placeholder="Type Here"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Wholesaler FMS Id
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("wholesaler_fms_id", e.target.value)
                        }
                        value={formDetails.wholesaler_fms_id}
                        name="wholesaler_fms_id"
                        type="text"
                        inputProps={{
                          maxLength: 10,
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
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    ></div>
                  </>
                ) : null}
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
                className={`${classes.dflex} ${classes.w75} ${classes.justifyspacebetween}`}
              >
                {formDetails.business_license_type === "retailer" ||
                formDetails.business_license_type === "both" ? (
                  <>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Retailer Fertilizer License Number
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange(
                            "retailer_fertilizer_license_number",
                            e.target.value
                          )
                        }
                        value={formDetails.retailer_fertilizer_license_number}
                        name="retailer_fertilizer_license_number"
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
                        placeholder="Type Here"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Retailer FMS Id
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("retailer_fms_id", e.target.value)
                        }
                        value={formDetails.retailer_fms_id}
                        name="retailer_fms_id"
                        type="text"
                        inputProps={{
                          maxLength: 10,
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
                        placeholder="Type Here"
                      />
                    </div>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                    ></div>
                  </>
                ) : null}
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
                  Pesticide License Number
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("pesticide_license_number", e.target.value)
                  }
                  value={formDetails.pesticide_license_number}
                  name="pesticide_license_number"
                  type="text"
                  inputProps={{
                    maxLength: 10,
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
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Seed License Number
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange("seed_license_number", e.target.value)
                  }
                  value={formDetails.seed_license_number}
                  name="seed_license_number"
                  type="text"
                  inputProps={{
                    maxLength: 10,
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
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MSME Udyam Registration Number
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleFormChange(
                      "msme_udyam_registration_number",
                      e.target.value
                    )
                  }
                  value={formDetails.msme_udyam_registration_number}
                  name="msme_udyam_registration_number"
                  type="text"
                  inputProps={{
                    // maxLength: 10,
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
                  placeholder="Type Here"
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

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={`${classes.modal}`}
            open={open}
            onClose={handlePopUp}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <AddLeadProduct handlePopUp={handlePopUp} rowId={rowId} />
          </Modal>
        </FormControl>
      </div>
    </>
  );
}
export default AddLeadForm;
