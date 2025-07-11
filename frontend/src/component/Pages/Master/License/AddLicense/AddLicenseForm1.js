import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
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
import { Autocomplete } from "@material-ui/lab";

function AddLicenseForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const include = [
    { title: "Country", id: 1 },
    { title: "State", id: 2 },
    { title: "District", id: 3 },
    { title: "Tehsil", id: 4 },
    { title: "Pincode", id: 5 },
    { title: "Place", id: 6 },
  ];

  const [formDetails, setFormDetails] = useState({
    license_category_id: "",
    license_name: "",
    beneficiary_name: "",
    license_status: "",
    license_no: "",
    license_territory: "",
    license_territory_ids: "",
    registered_office_address: "",
    Pincode: "",
    Warehouse_ids: "",
    date_of_issue: "",
    date_of_expiry: "",
    authority_name: "",
  });

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [selectedTerritory, setSelectedTerritory] = useState([]);

  // const [selectedInclude,setSelectedInclude] = useState([])

  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [tehsil, setTehsil] = useState([]);
  const [selectedTehsil, setSelectedTehsil] = useState("");

  const [pint, setPint] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");

  const [place, setPlace] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");

  const [godownAddress, setGodownAddress] = useState([
    { address: "", pin: "" },
  ]);

  const [licenseCategoryData, setLicenseCategoryData] = useState([]);
  const [selectedLicenseCategoryData, setSelectedLicenseCategoryData] =
    useState([]);

  const [warehouse, setWarehouse] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState([]);

  const handleWarehouseChange = (event, newValue) => {
    setSelectedWarehouse(newValue ? newValue.map((item) => item.id) : []);
    setFormDetails((pre) => ({
      ...pre,
      Warehouse_ids: newValue ? newValue.map((item) => item.id) : [],
    }));
  };
  const handleLicenseCategoryDataChange = (event, newValue) => {
    setSelectedLicenseCategoryData(newValue || null);
    setFormDetails((pre) => ({
      ...pre,
      license_category_id: newValue.id,
    }));
  };

  const [gstDistrictStateTehsil, setGstDistrictStateTehsil] = useState([]);

  const [pin, setPin] = useState([]);
  const [selectedGstPin, setSelectedGstPin] = useState("");
  const [selectedGstPinId, setSelectedGstPinId] = useState("");

  const handleGstPinChange = (event, newValue) => {
    setSelectedGstPin(newValue);
    setSelectedGstPinId(newValue.id);

    console.log("pincode", newValue);
  };

  const handleIncludeChange = (event, newValue) => {
    setSelectedTerritory(newValue || null);
    setFormDetails((pre) => ({
      ...pre,
      license_territory: newValue.title,
    }));
  };

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handleDistrictChange = (event, newValue) => {
    setSelectedDistrict(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handleTehsilChange = (event, newValue) => {
    setSelectedTehsil(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handlePinChange = (event, newValue) => {
    setSelectedPin(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

  const handlePlaceChange = (event, newValue) => {
    setSelectedPlace(newValue.map((subject) => subject.id));
    setFormDetails((pre) => ({
      ...pre,
      license_territory_ids: newValue.map((subject) => subject.id),
    }));
  };

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
      setCountry(response.data.country);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  const fetchState = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setState(response.data.state);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const fetchDistrict = async (ids) => {
    if (ids) {
      const data = {
        ids,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/district/state_ids`,
          data,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
        setDistrict(response.data.districts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/district`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
        setDistrict(response.data.districts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  useEffect(() => {
    fetchDistrict();
  }, []);

  const fetchTehsil = async (ids) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/tehsil`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.tehsil) {
        setTehsil(response.data.tehsil);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Tehsil:", error);
    }
  };

  useEffect(() => {
    fetchTehsil();
  }, []);

  const fetchPint = async () => {
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
        setPint(response.data.pin);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchPint();
  }, []);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setPlace(response.data.place);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchPlace();
  }, []);

  const fetchWarehouse = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setWarehouse(response.data.warehouse_information);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  const handleFormSubmit = async () => {};

  const fetchLicenseCategoryData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/license_category`, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        // toast.success("Area Information Updated Successfully");
        // console.log('response',response?.data?.license_category)
        setLicenseCategoryData(response?.data?.license_category);
      })
      .catch((error) => {
        console.log("error", error);
        // toast.error(error);
      });
  };

  useEffect(() => {
    fetchLicenseCategoryData();
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

  const handleRowChange = (value) => {
    // const updatedRows = [...formDetails];
    // let row = { ...updatedRows[index] };
    // row[fieldName] = value;
    // updatedRows[index] = row;
    // setFormDetails(updatedRows);

    console.log("date", value);
  };

  const handleChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
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
                License Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  License Category
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={licenseCategoryData || []}
                  value={selectedLicenseCategoryData}
                  onChange={(event, newValue) =>
                    handleLicenseCategoryDataChange(event, newValue)
                  }
                  disableClearable
                  getOptionLabel={(option) => option?.license_category_name}
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
                  License Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.license_name}
                  name="category_name"
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
                  Beneficiary Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.beneficiary_name}
                  name="beneficiary_name"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  License Status
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.license_status}
                  name="license_status"
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
                  License No.
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.license_no}
                  name="license_no"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  License territory
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={include || []}
                  value={selectedTerritory}
                  onChange={(event, newValue) =>
                    handleIncludeChange(event, newValue)
                  }
                  disableClearable
                  getOptionLabel={(option) => option.title}
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

              {selectedTerritory.title ? (
                <>
                  {selectedTerritory.title === "Country" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Country <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={country}
                        getOptionLabel={(option) => option.country_name}
                        value={country.filter((sub) =>
                          selectedCountry.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleCountryChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="country"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}
                  {selectedTerritory.title === "State" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={state}
                        getOptionLabel={(option) => option.state_name}
                        value={state.filter((sub) =>
                          selectedState.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleStateChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="state"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedTerritory.title === "District" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={district}
                        getOptionLabel={(option) => option.district_name}
                        value={district.filter((sub) =>
                          selectedDistrict.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleDistrictChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="district"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedTerritory.title === "Tehsil" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil
                      </FormLabel>
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={tehsil}
                        getOptionLabel={(option) => option.tehsil_name}
                        value={tehsil.filter((sub) =>
                          selectedTehsil.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleTehsilChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="tehsil"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedTerritory.title === "Pincode" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Pincode
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={pin}
                        getOptionLabel={(option) => option.pin_code}
                        value={pin.filter((sub) =>
                          selectedPin.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePinChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="pincode"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedTerritory.title === "Place" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Place
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={place}
                        getOptionLabel={(option) => option.pin_code}
                        value={place.filter((sub) =>
                          selectedPlace.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePlaceChange(event, newValue);
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="place"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                ></div>
              )}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Registered Office Address{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.registered_office_address}
                  name="registered_office_address"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Warehouse <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={warehouse}
                  getOptionLabel={(option) => option.name}
                  value={warehouse.filter((item) =>
                    selectedWarehouse.includes(item.id)
                  )}
                  onChange={(event, newValue) =>
                    handleWarehouseChange(event, newValue)
                  }
                  disableClearable
                  forcePopupIcon={false}
                  renderInput={(params) => (
                    <TextField
                      name="warehouse"
                      type="text"
                      variant="outlined"
                      placeholder="Type to pick..."
                      {...params}
                    />
                  )}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              ></div>{" "}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Date Of Issue
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) =>
                  //   handleRowChange(
                  //     //  index,
                  //     // "date_of_issue",
                  //     e.target.value
                  //   )
                  // }
                  onChange={handleChange}
                  value={formDetails.date_of_issue}
                  name="date_of_issue"
                  type="date"
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      max: new Date().toISOString().split("T")[0],
                    },
                  }}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Date Of Expiry <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) =>
                  //   handleRowChange(
                  //     //  index,
                  //     "date_of_expiry",
                  //     e.target.value
                  //   )
                  // }
                  //  value={row.date_of_expiry}
                  onChange={handleChange}
                  value={formDetails.date_of_expiry}
                  name="date_of_expiry"
                  type="date"
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      max: new Date().toISOString().split("T")[0],
                    },
                  }}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Author By Whom Issued
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleChange("author_by_issue", e.target.value)
                  }
                  value={formDetails.author_by_issue}
                  name="author_by_issue"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Authority Name
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.authority_name}
                  name="authority_name"
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
                  Signature <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="signature"
                  // onChange={handleFileUpload}
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
                  Seal <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="seal"
                  // onChange={handleFileUpload}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  License upload <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="license_upload"
                  // onChange={handleFileUpload}
                  type="file"
                  variant="outlined"
                  required
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
export default AddLicenseForm;
