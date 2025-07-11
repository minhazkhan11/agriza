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
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";

function EditDeliveryPointForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const location = useLocation();
  const rowId = location.state;

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [licenseDetails, setLicenseDetails] = useState([
    {
      licenseType: "",
      licenseNumber: "",
      license_image: "",
      fmsNumber: "",
    },
  ]);

  const licenseTypeData = ["Fertilizer", "Pesticide", "Seed"];

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

  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const handleCancel = () => {
    navigate("/delivery-point-list");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/delivery_point/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      const res = response.data.delivery_point_Details;
      setSelectedPin(res.pincode_id.id);
      setFormDetails({
        id: rowId,
        businessName: res.business_name,
        gstNumber: res.gst_no,
        warehouseName: res.warehouse_name,
        warehouseAddress: res.warehouse_address,

        pincode_id: res.pincode_id.id,
        place_id: res.place_id.id,

        latitude: res.latitude,
        longitude: res.longitude,
        supervisorName: res.scm_person_name,
        mobileNumber: res.mobile_no,
        email: res.email,

        licenseDetails: res.ship_info,
      });

      const formateData = (data) => {
        return data.map((d) => ({
          id: d.id,
          licenseType: d.license_type,
          licenseNumber: d.license_no,
          fmsNumber: d.fms_no,
          license_image: d.license_image,
        }));
      };

      setLicenseDetails(formateData(res.ship_info));
    } catch (error) {
      console.error("Error fetching data: ", error);
      console.error("response: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    const formateData = (data) => {
      return data.map((d) => ({
        id: d.id,
        license_type: d.licenseType,
        license_no: d.licenseNumber,
        fms_no: d.fmsNumber,
        license_image: d.license_image,
      }));
    };

    if (!formDetails.businessName.trim()) {
      toast.error("Business Name is required");
      return;
    }
    if (formDetails.gstNumber && formDetails.gstNumber.length !== 15) {
      toast.error("GST Number must be 15 characters long.");
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
      delivery_point: {
        id: rowId,
        business_name: formDetails.businessName,
        gst_no: formDetails.gstNumber,
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
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/delivery_point/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Delivery Point Information Updated Successfully");
        // console.log("formDetails", formDetails);
        setTimeout(() => {
          navigate("/delivery-point-list");
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
      { godown_address: "", pincode_id: "", place_id: "" },
    ]);
  };

  const handleLicenseChange = (fieldName, value, index) => {
    setLicenseDetails((prevDetails) =>
      prevDetails.map((item, i) =>
        i === index ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const handleFileUpload = (fieldName, e, index) => {
    const { files: selectedFiles } = e.target;
    setLicenseDetails((prevDetails) =>
      prevDetails.map((item, i) =>
        i === index ? { ...item, [fieldName]: selectedFiles[0] } : item
      )
    );
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
                Business details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Business Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("businessName", event.target.value)
                  }
                  value={formDetails.businessName}
                  name="businessName"
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
                  GST Number
                </FormLabel>
                <TextField
                  onChange={(event) =>
                    handleChange("gstNumber", event.target.value)
                  }
                  value={formDetails.gstNumber}
                  name="gstNumber"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  // onKeyDown={(e) => {
                  //   if (
                  //     e.key !== "Backspace" &&
                  //     e.key !== "Delete" &&
                  //     !/^\d$/.test(e.key)
                  //   ) {
                  //     e.preventDefault();
                  //   }
                  // }}
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
                  value={
                    pin.find((sub) => sub.id === formDetails.pincode_id) || ""
                  }
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
{console.log('Autocomplete' , place , formDetails.place_id)}
                <Autocomplete
                  id="state-autocomplete"
                  options={place || []}
                  onChange={(event, newValue) =>
                    handleChange("place_id", newValue.id)
                  }
                  disableClearable
                  value={
                    place?.find((sub) => sub.id === formDetails.place_id) || ""
                  }
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
                      value={licenseDetail.licenseType}
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
                      onChange={(e) =>
                        handleFileUpload("license_image", e, index)
                      }
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
export default EditDeliveryPointForm;
