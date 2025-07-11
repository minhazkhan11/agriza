import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Divider,
  FormLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
  IconButton,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../CustomComponent/UploadPreview";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";

function License({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const bankDetails = state?.be_license_details;

  const initialData = [
    {
      license_category_id: "",
      license_name: "",
      beneficiary_name: "",
      license_status: "",
      license_no: "",
      license_territory: "",
      license_territory_id: "",
      office_address: "",
      pincode_id: "",
      place_id: "",
      date_of_issue: "",
      date_of_expiry: "",
      authority_name: "",
      author_by_issue: "",
      godown_details: [{ godown_address: "", pincode_id: "", place_id: "" }],
      be_information_id: businessEntityId,
    },
  ];

  const [files, setFiles] = useState({
    signature: null,
    license_upload: null,
  });

  const [formDetails, setFormDetails] = useState(initialData);

  const [stateData, setStateData] = useState([]);
  const [district, setDistrict] = useState([]);
  const [pin, setPin] = useState([]);
  const [place, setPlace] = useState([]);
  const [rDistrictStateTehsil, setRDistrictStateTehsil] = useState([]);

  const [godownPlace, setGodownPlace] = useState([]);

  const [licenseCategoryData, setLicenseCategoryData] = useState([]);

  const include = [
    // { title: "Country", id: 1 },
    { title: "State", id: 2 },
    { title: "District", id: 3 },
    // { title: "Tehsil", id: 4 },
    // { title: "Pincode", id: 5 },
    // { title: "Place", id: 6 },
  ];

  const handleAddRow = () => {
    setFormDetails([
      ...formDetails,
      {
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
        godown_details: [{ godown_address: "", pincode_id: "", place_id: "" }],
        be_information_id: businessEntityId,
      },
    ]);
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

  const handleGodown = (formIndex, godownIndex, fieldName, value) => {
    const updatedForm = [...formDetails];
    updatedForm[formIndex].godown_details[godownIndex][fieldName] = value;
    setFormDetails(updatedForm);
    if (fieldName === "pincode_id") {
      fetchGodownPlace(formIndex, godownIndex, value);
    }
  };

  const handleAddLink = (formIndex) => {
    const updatedForm = [...formDetails];
    updatedForm[formIndex].godown_details.push({
      godown_address: "",
      pincode_id: "",
      place_id: "",
    });
    setFormDetails(updatedForm);
  };

  const handleRemoveLink = (formIndex) => {
    const updatedForm = [...formDetails];
    const godownList = updatedForm[formIndex].godown_details;
    if (godownList.length > 1) {
      godownList.splice(godownList.length - 1, 1); // remove the last item
      setFormDetails(updatedForm);
    }
  };

  const handleClose = () => {
    setValue(4);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("license_details", JSON.stringify(formDetails));

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/vendor_license_details/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Staff Contact Information created successfully!");
        setTimeout(() => {
          setValue(4);
        }, 1000);
      } else {
        // If the response status is not 200, handle it as an error
        toast.error(
          `Staff Contact Information is not created! ${response.data.message}`
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
        toast.error("An unexpected error occurred while creating the exam.");
      }
      console.error("An error occurred:", error);
    }
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
      setStateData(response.data.state);
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

  const fetchRDistrictStateTehsil = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/pin_by/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setRDistrictStateTehsil((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.pin;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    formDetails.forEach((data, index) => {
      if (data.pincode_id) {
        fetchRDistrictStateTehsil(index, data.pincode_id);
      }
    });
  }, [formDetails]);

  const fetchPlace = async (index, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );
      if (response.status === 200) {
        setPlace((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index] = response.data.place;
          return updatedLists;
        });
      }
    } catch (error) {
      console.error("Error fetching Place: ", error);
    }
  };

  useEffect(() => {
    formDetails.forEach((data, index) => {
      if (data.pincode_id) {
        fetchPlace(index, data.pincode_id);
      }
    });
  }, [formDetails]);

  const fetchGodownPlace = async (formIndex, godownIndex, pinId) => {
    if (!pinId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_id/${pinId}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      );

      if (response.status === 200) {
        setGodownPlace((prev) => {
          const updated = [...prev];
          if (!updated[formIndex]) updated[formIndex] = [];
          updated[formIndex][godownIndex] = response.data.place;
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching godown place:", error);
    }
  };

  const handleFileUpload = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0], // Store the selected file
    }));
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
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div className={``}>
            {formDetails.map((row, index) => (
              <div
                key={index}
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
                        (sub) => sub.id === row.license_category_id
                      )}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "license_category_id",
                          e.target.value
                        )
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
                      License Name{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "license_name", e.target.value)
                      }
                      value={row.license_name}
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
                      Business Name{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "beneficiary_name",
                          e.target.value
                        )
                      }
                      value={row.beneficiary_name}
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
                      onChange={(e) =>
                        handleRowChange(index, "license_status", e.target.value)
                      }
                      value={row.license_status}
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em className={classes.defaultselect}>Select Here</em>
                      </MenuItem>
                      <MenuItem value="poolhandlingagency">
                        Pool Handling Agency
                      </MenuItem>
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
                      onChange={(e) =>
                        handleRowChange(index, "license_no", e.target.value)
                      }
                      value={row.license_no}
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
                      // value={row.license_territory}
                      value={
                        include.find(
                          (sub) => sub.title === row.license_territory
                        ) || ""
                      }
                      onChange={(event, newValue) =>
                        handleRowChange(
                          index,
                          "license_territory",
                          newValue.title
                        )
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
                  {row.license_territory ? (
                    <>
                      {row.license_territory === "State" && (
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
                            options={stateData}
                            getOptionLabel={(option) => option.state_name}
                            value={stateData.find(
                              (sub) => sub.id === row.license_territory_id
                            )}
                            onChange={(event, newValue) =>
                              handleRowChange(
                                index,
                                "license_territory_id",
                                newValue.id
                              )
                            }
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

                      {row.license_territory === "District" && (
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
                              (sub) => sub.id === row.license_territory_id
                            )}
                            onChange={(event, newValue) =>
                              handleRowChange(
                                index,
                                "license_territory_id",
                                newValue.id
                              )
                            }
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
                        handleRowChange(index, "office_address", e.target.value)
                      }
                      value={row.office_address}
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
                  {rDistrictStateTehsil[index]?.state && (
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
                        value={rDistrictStateTehsil[index]?.state?.state_name}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={rDistrictStateTehsil[index]?.state?.state_name}
                        >
                          {rDistrictStateTehsil[index]?.state?.state_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.district && (
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
                        value={
                          rDistrictStateTehsil[index]?.district?.district_name
                        }
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={
                            rDistrictStateTehsil[index]?.district?.district_name
                          }
                        >
                          {" "}
                          {rDistrictStateTehsil[index]?.district?.district_name}
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {rDistrictStateTehsil[index]?.tehsil && (
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
                        value={rDistrictStateTehsil[index]?.tehsil?.tehsil_name}
                        // onChange={handlePinChange}
                        displayEmpty
                        className={classes.selectEmpty}
                        MenuProps={menuProps}
                        variant="outlined"
                        disabled
                      >
                        <MenuItem
                          value={
                            rDistrictStateTehsil[index]?.tehsil?.tehsil_name
                          }
                        >
                          {rDistrictStateTehsil[index]?.tehsil?.tehsil_name}
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
                      options={place[index] || []}
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

                {row?.godown_details.map((link, godIndex) => (
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
                            handleGodown(
                              index,
                              godIndex,
                              "godown_address",
                              e.target.value
                            )
                          }
                          value={link.godown_address}
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

                    {/* <div
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
                                </div> */}

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
                          Pincode{" "}
                          <span className={classes.textcolorred}>*</span>
                        </FormLabel>

                        <Autocomplete
                          id="state-autocomplete"
                          options={pin || []}
                          value={
                            pin?.find((sub) => sub.id === link.pincode_id) || ""
                          }
                          // onChange={handleGstPinChange}
                          disableClearable
                          getOptionLabel={(option) => option.pin_code}
                          autoHighlight
                          onChange={(e, newValue) =>
                            handleGodown(
                              index,
                              godIndex,
                              "pincode_id",
                              newValue.id
                            )
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
                        {console.log("godownPlace", godownPlace)}
                        <Autocomplete
                          id="state-autocomplete"
                          options={godownPlace[index]?.[godIndex] || []}
                          value={
                            godownPlace[index]?.[godIndex]?.find(
                              (place) => place.id === link.place_id
                            ) || null
                          }
                          disableClearable
                          getOptionLabel={(option) => option?.place_name}
                          autoHighlight
                          onChange={(e, newValue) =>
                            handleGodown(
                              index,
                              godIndex,
                              "place_id",
                              newValue.id
                            )
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
                  {row?.godown_details.length > 1 && (
                    <IconButton onClick={() => handleRemoveLink(index)}>
                      <IndeterminateCheckBoxOutlinedIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleAddLink(index)}>
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
                        handleRowChange(index, "date_of_issue", e.target.value)
                      }
                      value={row.date_of_issue}
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
                      Date Of Expiry{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      onChange={(e) =>
                        handleRowChange(index, "date_of_expiry", e.target.value)
                      }
                      value={row.date_of_expiry}
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
                        handleRowChange(
                          index,
                          "author_by_issue",
                          e.target.value
                        )
                      }
                      value={row.author_by_issue}
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
                        handleRowChange(index, "authority_name", e.target.value)
                      }
                      value={row.authority_name}
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
                      License upload{" "}
                      <span className={classes.textcolorred}>*</span>
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
            ))}
            {formDetails.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddRow}
                  handleRemove={handleRemoveRow}
                  data={formDetails}
                />
              </div>
            )}
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1} ${classes.mb1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
            >
              Skip
            </Button>
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
export default License;
