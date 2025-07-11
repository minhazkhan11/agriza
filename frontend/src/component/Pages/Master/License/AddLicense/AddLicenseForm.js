import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Modal,
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
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddLicenseProduct from "../ViewLicense/AddLicenseProduct";

const initialData = {
  license_category_id: "",
  license_name: "",
  beneficiary_name: "",
  license_status: "",
  license_no: "",
  license_territory: "",
  license_territory_id: "",
  office_address: "",
  pin_code: "",
  place_id: "",
  date_of_issue: "",
  date_of_expiry: "",
  authority_name: "",
  author_by_issue: "",
};

function AddLicenseForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [open, setOpen] = useState();
  const [rowId, setRowId] = useState();

  const handlePopUp = () => {
    setOpen(!open);
  };

  const include = [
    // { title: "Country", id: 1 },
    { title: "State", id: 2 },
    { title: "District", id: 3 },
    // { title: "Tehsil", id: 4 },
    // { title: "Pincode", id: 5 },
    // { title: "Place", id: 6 },
  ];

  const [formDetails, setFormDetails] = useState(initialData);

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

  const [districtStateTehsil, setDistrictStateTehsil] = useState([]);

  const [pin, setPin] = useState([]);
  const [selectedPin, setSelectedPin] = useState("");
  const [selectedRPin, setSelectedRPin] = useState("");

  const [place, setPlace] = useState([]);
  const [godownPlace, setGodownPlace] = useState([]);

  const [godownAddress, setGodownAddress] = useState([
    { godown_address: "", pincode_id: "", place_id: "" },
  ]);

  const handleAddLink = () => {
    setGodownAddress((prevLinks) => [
      ...prevLinks,
      { godown_address: "", pincode_id: "", place_id: "" },
    ]);
  };

  const handleRemoveLink = (index) => {
    setGodownAddress((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks.splice(index, 1);
      return updatedLinks;
    });
  };

  const handleGodown = (index, fieldName, value) => {
    const updatedRows = [...godownAddress];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setGodownAddress(updatedRows);

    if (fieldName === "pincode_id") {
      fetchGodownPlace(index, value);
    }
  };

  const [files, setFiles] = useState({
    signature: null,
    license_upload: null,
  });

  const [licenseCategoryData, setLicenseCategoryData] = useState([]);

  const handleIncludeChange = (event, newValue) => {
    setSelectedTerritory(newValue || null);
    setFormDetails((pre) => ({
      ...pre,
      license_territory: newValue.title,
      license_territory_id: null,
    }));
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue.id);
    setFormDetails((pre) => ({
      ...pre,
      license_territory_id: newValue.id,
    }));
  };

  const handleDistrictChange = (event, newValue) => {
    setSelectedDistrict(newValue.id);
    setFormDetails((pre) => ({
      ...pre,
      license_territory_id: newValue.id,
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

  const fetchPlace = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails.pin_code}`,
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
    fetchPlace(formDetails.pin_code);
  }, [formDetails.pin_code]);

  // const fetchGodownPlace = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${formDetails.pin_code}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     );
  //     if (response.data && response.data.place) {
  //       setGodownPlace(response.data.place);
  //     } else {
  //       console.error("Invalid API response format:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Pin:", error);
  //   }
  // };

  const fetchGodownPlace = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setGodownPlace((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

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

  const fetchDistrictStateTehsil = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${formDetails.pin_code}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.place) {
        setDistrictStateTehsil(response.data.place);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Pin:", error);
    }
  };

  useEffect(() => {
    fetchDistrictStateTehsil(formDetails.pin_code);
  }, [formDetails.pin_code]);

  const handleChange = (fieldName, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (!String(formDetails.license_category_id).trim()) {
      toast.warn("Please Enter a Name.");
      return;
    }
    if (!formDetails.license_name.trim()) {
      toast.warn("Please Enter a father name.");
      return;
    }
    if (!formDetails.beneficiary_name.trim()) {
      toast.warn("Please Enter a phone.");
      return;
    }
    if (!formDetails.license_no.trim()) {
      toast.warn("Please Enter a email.");
      return;
    }
    if (!formDetails.authority_name.trim()) {
      toast.warn("Please Enter a password.");
      return;
    }

    try {
      const formData = new FormData();

      const data = {
        license_category_id: formDetails.license_category_id,
        license_name: formDetails.license_name,
        beneficiary_name: formDetails.beneficiary_name,
        license_status: formDetails.license_status,
        license_no: formDetails.license_no,
        license_territory: formDetails.license_territory,
        license_territory_id: formDetails.license_territory_id,
        office_address: formDetails.office_address,
        pin_code: formDetails.pin_code,
        place_id: formDetails.place_id,
        date_of_issue: formDetails.date_of_issue,
        date_of_expiry: formDetails.date_of_expiry,
        authority_name: formDetails.authority_name,
        author_by_issue: formDetails.author_by_issue,
        godown_details: godownAddress,
      };

      formData.append("license_details", JSON.stringify(data));
      formData.append("signatureandseal", files.signature);
      formData.append("license", files.license_upload);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("License added successfully");
        console.log("object", response.data.license_details.id);
        setRowId(response.data.license_details.id);
        handlePopUp();
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(`License is not created! ${response.data.message}`);
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
        toast.error("An unexpected error occurred while creating the License.");
      }
      console.error("An error occurred:", error);
    }
  };

  const handleFileUpload = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the selected file
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
                  value={licenseCategoryData.find(
                    (sub) => sub.id === formDetails.license_category_id
                  )}
                  // value={formDetails.license_category_id}
                  onChange={(event, newValue) =>
                    handleChange("license_category_id", newValue.id)
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
                  onChange={(e) => handleChange("license_name", e.target.value)}
                  value={formDetails.license_name}
                  name="license_name"
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
                  Business Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleChange("beneficiary_name", e.target.value)
                  }
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

                <Select
                  labelId="category-label"
                  id="country"
                  required
                  value={formDetails.license_status}
                  onChange={(e) =>
                    handleChange("license_status", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  <MenuItem value="poolhandlingagency">Pool Handling Agency</MenuItem>
                  <MenuItem value="manufacturer">Manufacturer</MenuItem>
                  <MenuItem value="marketer">Marketer</MenuItem>
                  <MenuItem value="wholesaler">Wholesaler</MenuItem>
                  <MenuItem value="importer">Importer</MenuItem>
                </Select>
                {/* <TextField
                  onChange={(e) =>
                    handleChange("license_status", e.target.value)
                  }
                  value={formDetails.license_status}
                  name="license_status"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                /> */}
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
                  onChange={(e) => handleChange("license_no", e.target.value)}
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
              {formDetails.license_territory ? (
                <>
                  {formDetails.license_territory === "State" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State
                      </FormLabel>

                      <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={state}
                        getOptionLabel={(option) => option.state_name}
                        value={state.find((sub) => sub.id === selectedState)}
                        // value={selectedState}
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

                  {formDetails.license_territory === "District" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District
                      </FormLabel>

                      <Autocomplete
                        // multiple
                        id="tags-standard"
                        options={district}
                        getOptionLabel={(option) => option.district_name}
                        value={district.find(
                          (sub) => sub.id === selectedDistrict
                        )}
                        // value={selectedDistrict}
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
                  onChange={(e) =>
                    handleChange("office_address", e.target.value)
                  }
                  value={formDetails.office_address}
                  name="office_address"
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
              {districtStateTehsil.state && (
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
                    value={districtStateTehsil.state.state_name}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem value={districtStateTehsil.state.state_name}>
                      {districtStateTehsil.state.state_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {districtStateTehsil.district && (
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
                    value={districtStateTehsil.district.district_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem
                      value={districtStateTehsil.district.district_name}
                    >
                      {" "}
                      {districtStateTehsil.district.district_name}
                    </MenuItem>
                  </Select>
                </div>
              )}
              {districtStateTehsil.tehsil && (
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
                    value={districtStateTehsil.tehsil.tehsil_name}
                    // onChange={handlePinChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={menuProps}
                    variant="outlined"
                    disabled
                  >
                    <MenuItem value={districtStateTehsil.tehsil.tehsil_name}>
                      {districtStateTehsil.tehsil.tehsil_name}
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
                  value={pin.find((sub) => sub.id === formDetails.pin_code)}
                  // onChange={handleGstPinChange}
                  disableClearable
                  getOptionLabel={(option) => option.pin_code}
                  autoHighlight
                  onChange={(event, newValue) =>
                    handleChange("pin_code", newValue.id)
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
                  // value={selectedGstPin}
                  // onChange={handleGstPinChange}
                  disableClearable
                  getOptionLabel={(option) => option.place_name}
                  autoHighlight
                  onChange={(event, newValue) =>
                    handleChange("place_id", newValue.id)
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            {godownAddress.map((link, index) => (
              <>
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
                      Godown Address{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleGodown(index, "godown_address", e.target.value)
                      }
                      value={link.office_address}
                      name="office_address"
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
                  {districtStateTehsil.state && (
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
                        value={districtStateTehsil.state.state_name}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem value={districtStateTehsil.state.state_name}>
                          {districtStateTehsil.state.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {districtStateTehsil.district && (
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
                        value={districtStateTehsil.district.district_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={districtStateTehsil.district.district_name}
                        >
                          {" "}
                          {districtStateTehsil.district.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {districtStateTehsil.tehsil && (
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
                        value={districtStateTehsil.tehsil.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={districtStateTehsil.tehsil.tehsil_name}
                        >
                          {districtStateTehsil.tehsil.tehsil_name}
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
                      value={pin.find((sub) => sub.id === link.godown_pincode)}
                      // onChange={handleGstPinChange}
                      disableClearable
                      getOptionLabel={(option) => option.pin_code}
                      autoHighlight
                      onChange={(event, newValue) =>
                        handleGodown(index, "pincode_id", newValue.id)
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Place <span className={classes.textcolorred}>*</span>
                    </FormLabel>

                    <Autocomplete
                      id="state-autocomplete"
                      options={godownPlace[index] || []}
                      value={
                        godownPlace[index]?.find(
                          (sub) => sub.id === link.place_id
                        ) || null
                      }
                      disableClearable
                      getOptionLabel={(option) => option.place_name}
                      autoHighlight
                      onChange={(event, newValue) =>
                        handleGodown(index, "place_id", newValue.id)
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                  ></div>
                </div>
              </>
            ))}
            <div
              className={`${classes.inputcontainer} ${classes.justifyflexend} ${classes.dflex}`}
            >
              {godownAddress.length > 1 && (
                <IconButton onClick={handleRemoveLink}>
                  <IndeterminateCheckBoxOutlinedIcon />
                </IconButton>
              )}
              <IconButton onClick={handleAddLink}>
                <AddBoxOutlinedIcon />
              </IconButton>
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
                  onChange={(e) =>
                    handleChange("date_of_issue", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleChange("date_of_expiry", e.target.value)
                  }
                  value={formDetails.date_of_expiry}
                  name="date_of_expiry"
                  type="date"
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      min: new Date().toISOString().split("T")[0],
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
                  Authority By Whom Issued
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
                  O-Form Authorised Person Name
                  <span className={classes.textcolorred}> *</span>
                </FormLabel>
                <TextField
                  onChange={(e) =>
                    handleChange("authority_name", e.target.value)
                  }
                  value={formDetails.authority_name}
                  name="authority_name"
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
                  Signature and Seal{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="signature"
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
                  License upload <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="license_upload"
                  onChange={handleFileUpload}
                  type="file"
                  variant="outlined"
                  required
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                {/* <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Seal <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="seal"
                  onChange={handleFileUpload}
                  type="file"
                  variant="outlined"
                  required
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
              ></Typography>

              <div
                className={`${classes.w24} ${classes.mt1_5} ${classes.dflex} ${classes.justifycenter}`}
              >
                <UploadPreview
                  thumbnailImagePreview={
                    files.signature && URL.createObjectURL(files.signature)
                  }
                />
              </div>

              <div
                className={`${classes.w24} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
              >
                <UploadPreview
                  thumbnailImagePreview={
                    files.license_upload &&
                    URL.createObjectURL(files.license_upload)
                  }
                />
              </div>

              <div
                className={`${classes.w24} ${classes.mt1_5}  ${classes.dflex} ${classes.justifycenter}`}
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
          <AddLicenseProduct handlePopUp={handlePopUp} rowId={rowId} />
        </Modal>
      </div>
    </>
  );
}
export default AddLicenseForm;
