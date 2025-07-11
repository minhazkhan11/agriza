import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
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
import { useLocation, useNavigate } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../../CustomComponent/UploadPreview";

function OwnerDetails({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const bankDetails = state?.be_owner_details;

  const initialData =
    bankDetails && bankDetails.length > 0
      ? bankDetails.map((exp) => ({
          full_name: exp?.full_name || "",
          father_name: exp?.father_name || "",
          email: exp?.email || "",
          phone: exp?.phone || "",
          alternative_phone: exp?.alternative_phone || "",
          password: exp?.password || "",
          r_address: exp?.r_address || "",
          pincode_id: exp?.pincode || "",
          place_id: exp?.place_id || "",
          aadhaar: exp?.aadhaar || "",
          pan: exp?.pan || "",
          be_information_id: businessEntityId,
        }))
      : [
          {
            full_name: "",
            father_name: "",
            email: "",
            phone: "",
            alternative_phone: "",
            password: "",
            r_address: "",
            pincode_id: "",
            place_id: "",
            aadhaar: "",
            pan: "",
            be_information_id: businessEntityId,
          },
        ];

  const [files, setFiles] = useState({
    photo: null,
    aadhar_upload: null,
    pan_upload: null,
  });

  const [formDetails, setFormDetails] = useState(initialData);
  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);

  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const handleAddRow = () => {
    setFormDetails([
      ...formDetails,
      {
        full_name: "",
        father_name: "",
        email: "",
        phone: "",
        alternative_phone: "",
        password: "",
        r_address: "",
        pincode_id: "",
        place_id: "",
        aadhaar: "",
        pan: "",
        be_information_id: businessEntityId,
      },
    ]);
  };

  const handleFileUpload = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the selected file
    }));
  };

  const handleRemoveRow = () => {
    setFormDetails((prevRows) => {
      if (prevRows.length > 1) {
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleRowChange = (index, fieldName, value) => {
    const updatedRows = [...formDetails];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setFormDetails(updatedRows);
  };

  const handleFormSubmit = async () => {
    const aadharRegex = /^[a-zA-Z0-9]{12}$/;
    const phoneRegex = /^[a-zA-Z0-9]{10}$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    for (let row of formDetails) {
      if (!row.full_name.trim()) {
        toast.warn("Please enter a Owner/Partner/Director Name.");
        return;
      }
      // if (!row.father_name.trim()) {
      //   toast.warn("Please enter a Father Name.");
      //   return;
      // }
      // if (!row.email.trim()) {
      //   toast.warn("Please enter a email.");
      //   return;
      // }
      // if (!emailRegex.test(row.email)) {
      //   toast.warn("Please Enter email in correct format.");
      //   return;
      // }
      if (!row.phone.trim()) {
        toast.warn("Please enter a phone.");
        return;
      }
      if (!phoneRegex.test(row.phone)) {
        toast.warn("Phone Number must be exactly 10 digit.");
        return;
      }
      // if (!row.password.trim()) {
      //   toast.warn("Please enter a Password.");
      //   return;
      // }
      if (!row.r_address.trim()) {
        toast.warn("Please enter a Residential Address.");
        return;
      }
      if (!String(row.pincode_id).trim()) {
        toast.warn("Please enter a Pincode.");
        return;
      }
      if (!String(row.place_id).trim()) {
        toast.warn("Please enter a Place.");
        return;
      }
      if (!row.aadhaar.trim()) {
        toast.warn("Please enter a Aadhar Number.");
        return;
      }
      if (!aadharRegex.test(row.aadhaar)) {
        toast.warn("Aadhaar must be exactly 12 digit.");
        return;
      }
      if (!row.pan.trim()) {
        toast.warn("Please enter a PAN Number.");
        return;
      }
      if (!phoneRegex.test(row.pan)) {
        toast.warn("Pan Number must be exactly 10 digit.");
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("owner_details", JSON.stringify(formDetails));
      formData.append("photo", files.photo);
      formData.append("aadhar_upload", files.aadhar_upload);
      formData.append("pan_upload", files.pan_upload);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_owner_details/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Business Area Information created successfully!");
        setTimeout(() => {
          setValue(2);
        }, 1000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Business Area Information is not created! ${response.data.message}`
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
          "An unexpected error occurred while creating the Business Area Information."
        );
      }
      console.error("An error occurred:", error);
    }
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails[0].pincode_id}`,
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
      console.error("Error fetching Place:", error);
    }
  };

  useEffect(() => {
    fetchPlace(formDetails[0].pincode_id);
  }, [formDetails[0].pincode_id]);

  const fetchRDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${formDetails[0].pincode_id}`,
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
    fetchRDistrictStateTehsil(formDetails[0].pincode_id);
  }, [formDetails[0].pincode_id]);

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
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            {formDetails.map((row, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                )}
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    >
                      {index === 0 && <div>Owner Details</div>}
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Owner/Partner/Director Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "full_name", e.target.value)
                        }
                        value={row.full_name}
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
                        Father Name
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "father_name", e.target.value)
                        }
                        value={row.father_name}
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
                        Email
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "email", e.target.value)
                        }
                        value={row.email}
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
                        Phone <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "phone", e.target.value)
                        }
                        value={row.phone}
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
                        Alternate Phone No.
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "alternative_phone",
                            e.target.value
                          )
                        }
                        value={row.alternative_phone}
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
                      {/* <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Password <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "password", e.target.value)
                        }
                        value={row.password}
                        name="category_name"
                        type="password"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      /> */}
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
                     
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Residential Address
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={
                          (e) =>
                            handleRowChange(index, "r_address", e.target.value) // Handle address input change
                        }
                        value={formDetails.r_address}
                        name="r_address"
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
                          <MenuItem
                            value={rDistrictStateTehsil.state.state_name}
                          >
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
                          <MenuItem
                            value={rDistrictStateTehsil.tehsil.tehsil_name}
                          >
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
                        // value={selectedRPin}
                        // onChange={handleRPinChange}

                        onChange={(event, newValue) =>
                          handleRowChange(index, "pincode_id", newValue.id)
                        }
                        disableClearable
                        value={pin.find((sub) => sub.id === row.pincode_id)}
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
                        // value={selectedRPin}
                        // onChange={handleRPinChange}

                        onChange={(event, newValue) =>
                          handleRowChange(index, "place_id", newValue.id)
                        }
                        disableClearable
                        value={place.find((sub) => sub.id === row.place_id)}
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
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Aadhar Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "aadhaar", e.target.value)
                        }
                        value={row.aadhaar}
                        name="category_name"
                        type="text"
                        inputProps={{
                          maxLength: 12,
                          inputMode: "numeric",
                          pattern: "[0-9]{12}",
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
                        PAN Number{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleRowChange(index, "pan", e.target.value)
                        }
                        value={row.pan}
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
                        Photo <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="photo"
                        onChange={handleFileUpload}
                        type="file"
                        variant="outlined"
                        required
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Aadhar Upload{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="aadhar_upload"
                        onChange={handleFileUpload}
                        type="file"
                        variant="outlined"
                        required
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        PAN Upload{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        name="pan_upload"
                        onChange={handleFileUpload}
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
                      className={`${classes.w24} ${classes.mt1_5} ${classes.dflex} ${classes.justifycenter}`}
                    >
                      <UploadPreview
                        thumbnailImagePreview={
                          files.photo && URL.createObjectURL(files.photo)
                        }
                      />
                    </div>

                    <div
                      className={`${classes.w24} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
                    >
                      <UploadPreview
                        thumbnailImagePreview={
                          files.aadhar_upload &&
                          URL.createObjectURL(files.aadhar_upload)
                        }
                      />
                    </div>

                    <div
                      className={`${classes.w24} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
                    >
                      <UploadPreview
                        thumbnailImagePreview={
                          files.pan_upload &&
                          URL.createObjectURL(files.pan_upload)
                        }
                      />
                    </div>
                  </div>
                </>
              </React.Fragment>
            ))}
            {/* {formDetails.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddRow}
                  handleRemove={handleRemoveRow}
                  data={formDetails}
                />
              </div>
            )} */}
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            {/* <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Skip
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
export default OwnerDetails;
