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
import GetLocation from "./GetLocation";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function AddWareHouseForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const entityDetailsNew = JSON.parse(sessionStorage?.getItem("entityDetails"));
  const assigned_to = JSON.parse(sessionStorage?.getItem("assigned_to"));

  const [formDetails, setFormDetails] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    pincode_id: "",
    place_id: "",
    ship_info: "no",
    gst_id: "",
    be_information_id: "",
  });

  const [gst, setGst] = useState([]);
  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);
  const [shipToParty, setShipToParty] = useState("no");

  const handleCancel = () => {
    navigate("/warehouse-list");
  };

  const handleFormSubmit = () => {
    if (!formDetails.name.trim()) {
      toast.error("Warehouse Name is required");
      return;
    }
    if (!formDetails.address) {
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

    // if (!formDetails.latitude) {
    //   toast.error("Latitude is required");
    //   return;
    // }

    // if (!formDetails.longitude) {
    //   toast.error("Longitude is required");
    //   return;
    // }

    // const data = {
    //   warehouse_information: [formDetails],
    // };

    const data = {
      warehouse_information: [
        {
          name: formDetails.name,
          address: formDetails.address,
          latitude: formDetails.latitude,
          longitude: formDetails.longitude,
          pincode_id: formDetails.pincode_id,
          place_id: formDetails.place_id,
          ship_info: shipToParty,
          gst_id: formDetails.gst_id,
          be_information_id: assigned_to?.be_information_id || null,
        },
      ],
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Warehouse Information Updated Successfully");
        // console.log("formDetails", formDetails);
        setTimeout(() => {
          navigate("/warehouse-list");
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

  const fetchGST = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_gst_details/be_id/${entityDetailsNew.id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.be_gst_details) {
        setGst(response.data.be_gst_details);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchGST();
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
                Business Name
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                {entityDetailsNew.business_name}
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
              >
                GST Number
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <Autocomplete
                  id="state-autocomplete"
                  options={gst || []}
                  onChange={(event, newValue) =>
                    handleChange("gst_id", newValue.id)
                  }
                  disableClearable
                  value={gst.find((sub) => sub.id === formDetails.gst_id)}
                  getOptionLabel={(option) => option.gst_number}
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
                  onChange={(event) => handleChange("name", event.target.value)}
                  value={formDetails.name}
                  name="name"
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
                    handleChange("address", event.target.value)
                  }
                  value={formDetails.address}
                  name="address"
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

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.mt1_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Above Details is also Ship To Party Detail
                </FormLabel>
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Gst"
                  name="is Gst"
                  value={shipToParty}
                >
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        onClick={() => setShipToParty("yes")}
                        // disabled
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        onClick={() => setShipToParty("no")}
                        //  disabled
                      />
                    }
                    label="No"
                  />
                </RadioGroup>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>
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
export default AddWareHouseForm;
