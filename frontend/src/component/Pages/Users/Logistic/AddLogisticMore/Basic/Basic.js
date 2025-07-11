import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
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
import useStyles from "../../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../../CustomComponent/UploadPreview";

function Basic({ setValue, setBusinessEntityId, setconstitutionsName }) {
  const { state } = useLocation();

  const [selectedMSME, setSelectedMSME] = useState("No");

  const basicDetails = state?.be_information;

  const initialData = {
    is_Business: basicDetails?.registerd_type || "registered",
    gst_number: basicDetails?.gst_number || "",
    pan_number:
      (basicDetails?.registerd_type === "registered"
        ? basicDetails?.gst_number?.substring(2, 12)
        : basicDetails?.pan_number) || " ",
    constitutions_id: basicDetails?.constitutions_id || "",
    business_name: basicDetails?.business_name || "",
    short_name: basicDetails?.short_name || "",
    business_category_ids: basicDetails?.business_category_ids || "",
    module_id: basicDetails?.module_id || "",
    gst_address: basicDetails?.gst_address || "",
    gst_pincode_id: basicDetails?.gst_pincode || "",
    gst_place_id: basicDetails?.gst_place_id || "",
    postal_address: basicDetails?.postal_address || "",
    postal_pincode_id: basicDetails?.postal_pincode || "",
    postal_place_id: basicDetails?.postal_place_id || "",
    phone: basicDetails?.phone || "",
    email: basicDetails?.email || "",
    website: basicDetails?.website || "",
    msme_registered: basicDetails?.msme_registered || "",
    msme_number: basicDetails?.msme_number || "",
    cin_gumasta: basicDetails?.cin_gumasta || "",
  };

  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState(initialData);

  const [isBusiness, setIsBusiness] = useState("registered");

  const [constitutions, setConstitutions] = useState([]);
  const [selectedConstitutions, setSelectedConstitutions] = useState("");
  const [selectedConstitutionsId, setSelectedConstitutionsId] = useState("");

  const [thumbnailImage, setThumbnailImage] = useState([]);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState();

  const [gstDistrictStateTehsil, setGstDistrictStateTehsil] = useState([]);
  const [postalDistrictStateTehsil, setPostalDistrictStateTehsil] = useState(
    []
  );

  const [pin, setPin] = useState([]);

  const [gstPlace, setGstPlace] = useState([]);
  const [postalPlace, setPostalPlace] = useState([]);

  const [selectedGstPin, setSelectedGstPin] = useState("");
  const [selectedGstPinId, setSelectedGstPinId] = useState("");
  const [selectedPostalPin, setSelectedPostalPin] = useState("");
  const [selectedPostalPinId, setSelectedPostalPinId] = useState("");

  const [selectedGstPlace, setSelectedGstPlace] = useState("");
  const [selectedGstPlaceId, setSelectedGstPlaceId] = useState("");
  const [selectedPostalPlace, setSelectedPostalPlace] = useState("");
  const [selectedPostalPlaceId, setSelectedPostalPlaceId] = useState("");

  const [checkedAddress, setCheckedAddress] = useState(false);

  const handleChange = (event) => {
    setCheckedAddress(event.target.checked);
    setSelectedPostalPin(selectedGstPin);
    setSelectedPostalPinId(selectedGstPinId);
    setSelectedPostalPlace(selectedGstPlace);
    setSelectedPostalPlaceId(selectedGstPlaceId);
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      postal_address: formDetails.gst_address,
    }));
  };

  useEffect(() => {
    if (checkedAddress) {
      setSelectedPostalPin(selectedGstPin);
      setSelectedPostalPinId(selectedGstPinId);
      setSelectedPostalPlace(selectedGstPlace);
      setSelectedPostalPlaceId(selectedGstPlaceId);
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        postal_address: formDetails.gst_address,
      }));
    }
  }, [
    checkedAddress,
    formDetails.gst_address,
    selectedGstPin,
    selectedGstPinId,
    selectedGstPlace,
    selectedGstPlaceId,
  ]);

  const handleGstPinChange = (event, newValue) => {
    setSelectedGstPin(newValue);
    setSelectedGstPinId(newValue.id);
  };

  const handlePostalPinChange = (event, newValue) => {
    setSelectedPostalPin(newValue);
    setSelectedPostalPinId(newValue.id);
  };

  const handleGstPlaceChange = (event, newValue) => {
    setSelectedGstPlace(newValue);
    setSelectedGstPlaceId(newValue.id);
  };

  const handlePostalPlaceChange = (event, newValue) => {
    setSelectedPostalPlace(newValue);
    setSelectedPostalPlaceId(newValue.id);
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

  const handleConstitutionsChange = (event, newValue) => {
    setSelectedConstitutions(newValue);
    setSelectedConstitutionsId(newValue.id);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = async () => {
    const selectedConstitutions = String(selectedConstitutionsId);
    const validGstPin = String(selectedGstPinId);
    const validPostalPin = String(selectedPostalPinId);
    const validGstPlace = String(selectedGstPlaceId);
    const validPostalPlace = String(selectedPostalPlaceId);

    const phoneRegex = /^[a-zA-Z0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!selectedConstitutions.trim()) {
      toast.warn("Please Select Business Constitution");
      return;
    }
    if (!formDetails.business_name.trim()) {
      toast.warn("Please enter a Business Name.");
      return;
    }
    if (!formDetails.gst_address.trim()) {
      toast.warn("Please enter a GST Address.");
      return;
    }
    if (!validGstPin.trim()) {
      toast.warn("Please Select GST Pincode.");
      return;
    }
    if (!validGstPlace.trim()) {
      toast.warn("Please Select GST Place.");
      return;
    }
    if (!formDetails.postal_address.trim()) {
      toast.warn("Please enter a Postal Address.");
      return;
    }
    if (!validPostalPin.trim()) {
      toast.warn("Please Select Postal Pincode.");
      return;
    }
    if (!validPostalPlace.trim()) {
      toast.warn("Please Select Postal Place.");
      return;
    }
    if (!formDetails.phone.trim()) {
      toast.warn("Please enter a Phone number.");
      return;
    }
    if (!phoneRegex.test(formDetails.phone)) {
      toast.warn("Phone Number must be exactly 10 digit.");
      return;
    }
    if (!formDetails.email.trim()) {
      toast.warn("Please enter a email.");
      return;
    }
    if (!emailRegex.test(formDetails.email)) {
      toast.warn("Please Enter email in correct format.");
      return;
    }
    if (selectedMSME === "Yes") {
      if (!formDetails.msme_number.trim()) {
        toast.warn("Please enter a MSME Number.");
        return;
      }
    }
    if (!formDetails.cin_gumasta.trim()) {
      toast.warn("Please enter a CIN or Gumasta Number.");
      return;
    }

    const data = {
      registerd_type: formDetails?.is_Business,
      gst_number: formDetails?.gst_number,
      pan_number: formDetails.gst_number.substring(2, 12),
      constitutions_id: JSON.stringify(selectedConstitutionsId),
      business_name: formDetails?.business_name,
      short_name: formDetails?.short_name,
      gst_address: formDetails?.gst_address,
      gst_pincode_id: JSON.stringify(selectedGstPinId),
      gst_place_id: JSON.stringify(selectedGstPlaceId),
      postal_address: formDetails?.postal_address,
      postal_pincode_id: JSON.stringify(selectedPostalPinId),
      postal_place_id: JSON.stringify(selectedPostalPlaceId),
      phone: formDetails?.phone,
      email: formDetails?.email,
      website: formDetails?.website,
      msme_registered: selectedMSME,
      msme_number: formDetails?.msme_number,
      cin_gumasta: formDetails?.cin_gumasta,
      user_type: "logistics",
    };

    try {
      const formData = new FormData();

      formData.append("be_information", JSON.stringify(data));
      formData.append("logo", thumbnailImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Basic Information Updated Successfully");
        setBusinessEntityId(response.data.be_information.id);
        setconstitutionsName(
          response.data.be_information.constitutions_id.name
        );
        setTimeout(() => {
          setValue(1);
        }, 1000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Basic Information is not created! ${response.data.message}`
        );
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
        toast.error(
          "An unexpected error occurred while creating the Basic Information."
        );
      }
      console.error("An error occurred:", error);
    }
  };

  const fetchGstPlace = async (selectedGstPinId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${selectedGstPinId}`,
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
    fetchGstPlace(selectedGstPinId);
  }, [selectedGstPinId]);

  const fetchPostalPlace = async (selectedPostalPinId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${selectedPostalPinId}`,
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
    fetchPostalPlace(selectedPostalPinId);
  }, [selectedPostalPinId]);

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

  const fetchGstDistrictStateTehsil = async (selectedGstPinId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${selectedGstPinId}`,
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
    fetchGstDistrictStateTehsil(selectedGstPinId);
  }, [selectedGstPinId]);

  const fetchPostalDistrictStateTehsil = async (selectedPostalPinId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${selectedPostalPinId}`,
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
    fetchPostalDistrictStateTehsil(selectedPostalPinId);
  }, [selectedPostalPinId]);

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
                  value={formDetails.is_Business}
                  onChange={(e) =>
                    handleFormChange("is_Business", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="registered"
                    control={
                      <Radio onClick={() => setIsBusiness("registered")} />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value="notregistered"
                    control={
                      <Radio onClick={() => setIsBusiness("notregistered")} />
                    }
                    label="No"
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
                    inputProps={{
                      maxLength: 15,
                    }}
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
                  Business Constitution{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  id="tags-standard"
                  options={constitutions || []}
                  value={selectedConstitutions}
                  getOptionLabel={(option) => option.name}
                  onChange={handleConstitutionsChange}
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
                  Short Name
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
                Address Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={
                    (e) => handleFormChange("gst_address", e.target.value) // Handle address input change
                  }
                  value={formDetails.gst_address}
                  name="gst_address"
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
                    onChange={handleGstPinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem value={gstDistrictStateTehsil.state.state_name}>
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
                    <MenuItem value={gstDistrictStateTehsil.tehsil.tehsil_name}>
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
                  value={selectedGstPin}
                  onChange={handleGstPinChange}
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
                  value={selectedGstPlace}
                  onChange={handleGstPlaceChange}
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
                  Postal Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={
                    (e) => handleFormChange("postal_address", e.target.value) // Handle address input change
                  }
                  value={formDetails.postal_address}
                  name="postal_address"
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
                  value={selectedPostalPin}
                  onChange={handlePostalPinChange}
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
                  value={selectedPostalPlace}
                  onChange={handlePostalPlaceChange}
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
                {" "}
                Other Information
              </Typography>

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
                {" "}
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Website
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
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              {formDetails.is_Business === "registered" ? (
                <>
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
                      value={
                        formDetails.gst_number.substring(2, 12) ||
                        formDetails?.pan_number ||
                        " "
                      }
                      name="category_name"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                      disabled
                    />
                  </div>
                  {selectedConstitutions.name === "Partnership Firm" ||
                  selectedConstitutions.name === "Sole Proprietorship Firm" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Gumasta Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("cin_gumasta", e.target.value)
                        }
                        value={formDetails.cin_gumasta}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                  ) : selectedConstitutions.name ===
                      "Limited Liability Partnership (LLP)" ||
                    selectedConstitutions.name === "Private Limited Company" ||
                    selectedConstitutions.name === "Public Limited Company" ||
                    selectedConstitutions.name === "One Person Company" ||
                    selectedConstitutions.name ===
                      "Coperative Society (MSCS)" ||
                    selectedConstitutions.name ===
                      "Coperative Society (State)" ||
                    selectedConstitutions.name === "FPO" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        CIN Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("cin_gumasta", e.target.value)
                        }
                        value={formDetails.cin_gumasta}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    ></div>
                  )}
                </>
              ) : (
                <>
                  {selectedConstitutions.name === "Partnership Firm" ||
                  selectedConstitutions.name === "Sole Proprietorship Firm" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Gumasta Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("cin_gumasta", e.target.value)
                        }
                        value={formDetails.cin_gumasta}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                  ) : selectedConstitutions.name ===
                      "Limited Liability Partnership (LLP)" ||
                    selectedConstitutions.name === "Private Limited Company" ||
                    selectedConstitutions.name === "Public Limited Company" ||
                    selectedConstitutions.name === "One Person Company" ||
                    selectedConstitutions.name ===
                      "Coperative Society (MSCS)" ||
                    selectedConstitutions.name ===
                      "Coperative Society (State)" ||
                    selectedConstitutions.name === "FPO" ? (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        CIN Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleFormChange("cin_gumasta", e.target.value)
                        }
                        value={formDetails.cin_gumasta}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    ></div>
                  )}
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </>
              )}

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Is Business MSME Registered{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Business"
                  name="selected"
                  value={selectedMSME}
                  onChange={(e) => setSelectedMSME(e.target.value)}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </div>

              {selectedMSME === "No" && (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                  ></div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                  ></div>
                </>
              )}

              {selectedMSME === "Yes" && (
                <>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      MSME Number{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleFormChange("msme_number", e.target.value)
                      }
                      value={formDetails.msme_number}
                      name="msme_number"
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Type Here"
                    />
                  </div>
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
                  Business Logo
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
