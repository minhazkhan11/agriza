import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import GetLocation from "./GetLocation";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";

function AddShipToPartyForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [licenseDetails, setLicenseDetails] = useState([
    {
      licenseType: "",
      licenseNumber: "",
      license_image: "",
      fmsNumber: "",
    },
  ]);

  const [formDetails, setFormDetails] = useState({
    businessName: "",
    gstNumber: "",
    warehouseName: "",
    warehouseAddress: "",
    latitude: "",
    longitude: "",
    pincode_id: "",
    place_id: "",
    supervisorName: "",
    mobileNumber: "",
    email: "",
    licenseDetails: licenseDetails,
  });

  const licenseTypeData = ["Fertilizer", "Pesticide", "Seed"];

  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedCustomerId, setSelectedCustomerId] = useState();

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setSelectedCustomerId(newValue.customer_id);
  };

  const handleCancel = () => {
    navigate("/ship-to-party-list");
  };

  console.log('selectedCustomer' , selectedCustomer)

  const handleFormSubmit = () => {
    const formateData = (data) => {
      return data.map((d) => ({
        license_type: d.licenseType,
        license_no: d.licenseNumber,
        fms_no: d.fmsNumber,
        license_image: d.license_image,
      }));
    };

    if (!String(selectedCustomerId).trim()) {
      toast.error("Business Name is required");
      return;
    }
    if (!formDetails.warehouseName.trim()) {
      toast.error("Warehouse Name is required");
      return;
    }
    if (!formDetails.warehouseAddress.trim()) {
      toast.error("Warehouse Address is required");
      return;
    }

    if (!formDetails.pincode_id) {
      toast.error("Pin Code is required");
      return;
    }

    if (!formDetails.place_id) {
      toast.error("Place is required");
      return;
    }
    if (!formDetails.supervisorName.trim()) {
      toast.error("Warehouse Supervisor Name is required");
      return;
    }
    if (formDetails.mobileNumber.length !== 10) {
      toast.error("mobile Number must be 10 characters long.");
      return;
    }
    const isValidEmail = (email) => {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    if (formDetails.email && !isValidEmail(formDetails.email)) {
      toast.error("Invalid email address.");
      return;
    }

    const data = {
      ship_to_party: {
        customer_id: selectedCustomerId,
        gst_id: selectedCustomer.gst_id,
        business_name: selectedCustomer.business_name,
        warehouse_name: formDetails.warehouseName,
        warehouse_address: formDetails.warehouseAddress,
        pincode_id: formDetails.pincode_id,
        place_id: formDetails.place_id,
        latitude: formDetails.latitude,
        longitude: formDetails.longitude,
        scm_person_name: formDetails.supervisorName,
        mobile_no: formDetails.mobileNumber,
        email: formDetails.email,
        license_info: formateData(licenseDetails),
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/ship_to_party/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Ship To Party Information Updated Successfully");
        setTimeout(() => {
          navigate("/ship-to-party-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleLicenseChange = (fieldName, value, index) => {
    setLicenseDetails((prevDetails) =>
      prevDetails.map((item, i) =>
        i === index ? { ...item, [fieldName]: value } : item
      )
    );

    setFormDetails((prev) => ({
      ...prev,
      licenseDetails: licenseDetails,
    }));

    console.log(fieldName, value, index);
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/ship_to_party/customer/be_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.data) {
        setCustomer(response.data.data);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
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

  const fetchRDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${formDetails.pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.pin) {
        setRDistrictStateTehsil(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchRDistrictStateTehsil(formDetails.pincode_id);
  }, [formDetails.pincode_id]);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails.pincode_id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setPlace(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPlace(formDetails.pincode_id);
  }, [formDetails.pincode_id]);

  const handleRemoveLink = (index) => {
    setLicenseDetails((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
  };

  const handleAddLink = () => {
    setLicenseDetails((prevLinks) => [
      ...prevLinks,
      { licenseType: "", licenseNumber: "", license_image: "", fmsNumber: "" },
    ]);
  };

  // const handleFileUpload = (fieldName, e, index) => {
  //   const { files: selectedFiles } = e.target;
  //   setLicenseDetails((prevDetails) =>
  //     prevDetails.map((item, i) =>
  //       i === index ? { ...item, [fieldName]: selectedFiles[0] } : item
  //     )
  //   );
  // };

  const handleImage = async (e, field, index) => {
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      const entitytype = "ship_to_party";

      formData.append("entitytype", entitytype);
      formData.append(field, file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`${field} uploaded successfully!`);
        console.log("response123456", response);
        const uploadedFileUrl = response.data?.uploadedFiles?.[field] || "";
        handleLicenseChange(field, uploadedFileUrl, index);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

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
                Customer details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w35}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Customer <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="state-autocomplete"
                  options={customer || []}
                  onChange={handleCustomerChange}
                  disableClearable
                  // value={customer.find((sub) => sub.id === formDetails.pincode_id)}
                  getOptionLabel={(option) =>
                    `${option.gst_number.slice(0, 4)} - ${option.business_name}`
                  }
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w40}`}
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
                Warehouse details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("warehouseName", event.target.value)
                  }
                  value={formDetails.warehouseName}
                  name="warehouseName"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
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
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse Address{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("warehouseAddress", event.target.value)
                  }
                  value={formDetails.warehouseAddress}
                  name="warehouseAddress"
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
              {rDistrictStateTehsil.state && (
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
                    value={rDistrictStateTehsil.state.state_name}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem value={rDistrictStateTehsil.state.state_name}>
                      {rDistrictStateTehsil.state.state_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {rDistrictStateTehsil.district && (
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
                    value={rDistrictStateTehsil.district.district_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={rDistrictStateTehsil.district.district_name}
                    >
                      {" "}
                      {rDistrictStateTehsil.district.district_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {rDistrictStateTehsil.tehsil && (
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
                    value={rDistrictStateTehsil.tehsil.tehsil_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem value={rDistrictStateTehsil.tehsil.tehsil_name}>
                      {rDistrictStateTehsil.tehsil.tehsil_name}
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
                  onChange={(event, newValue) =>
                    handleChange("pincode_id", newValue.id)
                  }
                  disableClearable
                  value={pin.find((sub) => sub.id === formDetails.pincode_id)}
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
                  options={place || []}
                  onChange={(event, newValue) =>
                    handleChange("place_id", newValue.id)
                  }
                  disableClearable
                  value={place.find((sub) => sub.id === formDetails.place_id)}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                {/* <GetLocation /> */}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Latitude
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("latitude", event.target.value)
                  }
                  value={formDetails.latitude}
                  name="latitude"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Longitude
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("longitude", event.target.value)
                  }
                  value={formDetails.longitude}
                  name="longitude"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
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

              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse Supervisor Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div> */}

              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Supervisor Mobile Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div> */}
              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Supervisor Mobile Email <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div> */}
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Password
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setKeySecret(e.target.value)}
                  // value={keySecret}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div> */}

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
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
                Person details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse Supervisor Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("supervisorName", event.target.value)
                  }
                  value={formDetails.supervisorName}
                  name="supervisorName"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Mobile Number <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("mobileNumber", event.target.value)
                  }
                  value={formDetails.mobileNumber}
                  name="mobileNumber"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      !/^\d$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email Id
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  value={formDetails.email}
                  name="email"
                  type="email"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
            </div>
            {console.log("licenseDetails", licenseDetails)}
            {licenseDetails.map((licenseDetail, index) => (
              <>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <Typography
                    className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                    variant="h6"
                    display="inline"
                  >
                    {index == 0 && "License details"}
                  </Typography>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      License Type
                    </FormLabel>
                    <Autocomplete
                      id="state-autocomplete"
                      options={licenseTypeData || []}
                      // value={licenseTypeData.find(
                      //   (sub) => sub.id === formDetails.license_category_id
                      // )}
                      // value={formDetails.license_category_id}
                      onChange={(event, newValue) =>
                        handleLicenseChange("licenseType", newValue, index)
                      }
                      disableClearable
                      getOptionLabel={(option) => option}
                      autoHighlight
                      renderInput={(params) => (
                        <TextField
                          name="license_category"
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      License Number
                    </FormLabel>
                    <TextField
                      onChange={(event) =>
                        handleLicenseChange(
                          "licenseNumber",
                          event.target.value,
                          index
                        )
                      }
                      value={licenseDetails[index].licenseNumber}
                      name="licenseNumber"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      License Upload
                    </FormLabel>
                    <TextField
                      name="license_image"
                      // onChange={(e) =>
                      //   handleFileUpload("license_image", e, index)
                      // }
                      onChange={(e) => handleImage(e, "license_image", index)}
                      type="file"
                      variant="outlined"
                      required
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      FMS Number
                    </FormLabel>
                    <TextField
                      onChange={(event) =>
                        handleLicenseChange(
                          "fmsNumber",
                          event.target.value,
                          index
                        )
                      }
                      value={licenseDetails[index].fmsNumber}
                      name="fmsNumber"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                    />
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                  ></div>

                  <div
                    className={`${classes.w24} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
                  >
                    <UploadPreview
                      thumbnailImagePreview={
                        licenseDetails[index].license_image &&
                        !(
                          typeof licenseDetails[index].license_image == "string"
                        )
                          ? URL.createObjectURL(
                              licenseDetails[index].license_image
                            )
                          : licenseDetails[index].license_image
                      }
                    />
                  </div>
                </div>
              </>
            ))}

            <div
              className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
            >
              {licenseDetails.length > 1 && (
                <IconButton onClick={handleRemoveLink}>
                  <IndeterminateCheckBoxOutlinedIcon />
                </IconButton>
              )}
              <IconButton onClick={handleAddLink}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </div>
          </div>

          {/* handle button click event */}

          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
            <Button
              onClick={handleCancel}
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
export default AddShipToPartyForm;
