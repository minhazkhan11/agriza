import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
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
import { Autocomplete } from "@material-ui/lab";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";

const demographicInclude = [
  { title: "Country", id: 1 },
  { title: "State", id: 2 },
  { title: "District", id: 3 },
  { title: "Tehsil", id: 4 },
  { title: "Pincode", id: 5 },
  { title: "Place", id: 6 },
];

function EditLogisticAreaForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const location = useLocation();
  const rowId = location.state;

  const [formDetails, setFormDetails] = useState({
    id: rowId,
    name: "",
    demographic_include: "",
    demographic_includes_id: [],
  });

  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState({
    demographicInclude: "",
  });

  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    demographicInclude: "",
  });

  const [district, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({
    demographicInclude: "",
  });

  const [tehsil, setTehsil] = useState([]);
  const [selectedTehsil, setSelectedTehsil] = useState({
    demographicInclude: "",
  });

  const [pin, setPin] = useState([]);
  const [selectedPin, setSelectedPin] = useState({
    demographicInclude: "",
  });

  const [place, setPlace] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({
    demographicInclude: "",
  });

  const [selectedDemographicInclude, setSelectedDemographicInclude] =
    useState("");



  const handleAPi = (ids) => {
    if (selectedDemographicInclude.title === "Country") {
      fetchState(ids);
    }
    if (selectedDemographicInclude.title === "State") {
      fetchDistrict(ids);
    }
    if (selectedDemographicInclude.title === "District") {
      fetchTehsil(ids);
    }
    if (selectedDemographicInclude.title === "Tehsil") {
      fetchPin(ids);
    }
    if (selectedDemographicInclude.title === "Pincode") {
      fetchPlace(ids);
    }
  };

  const handleDemographicChange = (event, newValue, filedName) => {
    if (filedName === "demographicInclude") {
      setSelectedDemographicInclude(newValue);
      setFormDetails((pre) => ({
        ...pre,
        demographic_include: newValue.title,
      }));
    }
  };

  const handleDemographicId = (filedName, newValue) => {
    if (filedName === "demographicInclude") {
      setFormDetails((pre) => ({
        ...pre,
        demographic_includes_id: newValue.map((subject) => subject.id),
      }));
    }
  };

  const handleCountryChange = (event, newValue, filedName) => {
    setSelectedCountry((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
    handleAPi(newValue.map((subject) => subject.id));
  };

  const handleStateChange = (event, newValue, filedName) => {
    setSelectedState((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
    handleAPi(newValue.map((subject) => subject.id));
  };

  const handleDistrictChange = (event, newValue, filedName) => {
    setSelectedDistrict((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
    handleAPi(newValue.map((subject) => subject.id));
  };

  const handleTehsilChange = (event, newValue, filedName) => {
    setSelectedTehsil((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
    handleAPi(newValue.map((subject) => subject.id));
  };

  const handlePinChange = (event, newValue, filedName) => {
    setSelectedPin((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
    handleAPi(newValue.map((subject) => subject.id));
  };

  const handlePlaceChange = (event, newValue, filedName) => {
    setSelectedPlace((prevState) => ({
      ...prevState,
      [filedName]: newValue.map((subject) => subject.id),
    }));
    handleDemographicId(filedName, newValue);
  };

  const handleCancel = () => {
    navigate("/logistic-area-list");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/logistic_area/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      // setProductCategory(response.data.product_areas);
      console.log("ProductCategory", response.data.logistic_area);
      const data = response.data.logistic_area;
      
      // Set basic form details
      setFormDetails({
        id: rowId,
        name: data.name || "",
        demographic_includes_id: data.demographic_includes_id,
        demographic_include: data.demographic_include,
      });

      // Set demographic includes/excludes
      setSelectedDemographicInclude({ title: data.demographic_include });

      const demographicData = {
        demographicInclude: Array.isArray(data?.demographic_includes_id)
          ? data.demographic_includes_id
          : [],
      };

      // Set all demographic-related states at once
      setSelectedCountry(demographicData);
      setSelectedState(demographicData);
      setSelectedDistrict(demographicData);
      setSelectedTehsil(demographicData);
      setSelectedPin(demographicData);
      setSelectedPlace(demographicData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);

  const handleFormSubmit = () => {
    if (!formDetails.name) {
      toast.error("Name is required");
      return;
    }

        if (!formDetails.demographic_include.trim()) {
          toast.error("Demographic Include is required");
          return;
        }
   
    if (formDetails.demographic_includes_id.length === 0) {
      toast.error(`${formDetails.demographic_include} is required`);
      return;
    }

    const data = {
      logistic_area: formDetails,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/logistic_area/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Logistic Area Information Updated Successfully");
        setTimeout(() => {
          navigate("/logistic-area-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
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

  const fetchState = async (ids) => {
    if (ids) {
      const data = {
        ids,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state/country_ids`,
          data,
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
    } else {
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
    if (ids) {
      const data = {
        ids,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/tehsil/district_ids`,
          data,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
        setTehsil(response.data.tehsil);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    } else {
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
    }
  };

  useEffect(() => {
    fetchTehsil();
  }, []);

  const fetchPin = async (ids) => {
    if (ids) {
      const data = {
        ids,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/tehsil_ids`,
          data,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
        setPin(response.data.pin);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    } else {
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
    }
  };

  useEffect(() => {
    fetchPin();
  }, []);

  const fetchPlace = async (ids) => {
    if (ids) {
      const data = {
        ids,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/place/pin_ids`,
          data,
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
    } else {
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
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
                Logistic Area Detail
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                {" "}
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={handleChange}
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
                  Demographic Include
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={(demographicInclude || []).filter(
                    (option) => option.id !== 6
                  )}
                  value={selectedDemographicInclude}
                  getOptionLabel={(option) => option?.title?.toString() || ""}
                  onChange={(event, newValue) =>
                    handleDemographicChange(
                      event,
                      newValue,
                      "demographicInclude"
                    )
                  }
                  disableClearable
                  autoHighlight
                  selectOnFocus
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick..."
                      variant="outlined"
                    />
                  )}
                />
              </div>
              {selectedDemographicInclude.title ? (
                <>
                  {selectedDemographicInclude.title === "Country" && (
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
                          selectedCountry.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleCountryChange(
                            event,
                            newValue,
                            "demographicInclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}
                  {selectedDemographicInclude.title === "State" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        State <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={state}
                        getOptionLabel={(option) => option.state_name}
                        value={state.filter((sub) =>
                          selectedState.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleStateChange(
                            event,
                            newValue,
                            "demographicInclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicInclude.title === "District" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        District <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={district}
                        getOptionLabel={(option) => option.district_name}
                        value={district.filter((sub) =>
                          selectedDistrict.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleDistrictChange(
                            event,
                            newValue,
                            "demographicInclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicInclude.title === "Tehsil" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Tehsil <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={tehsil}
                        getOptionLabel={(option) => option.tehsil_name}
                        value={tehsil.filter((sub) =>
                          selectedTehsil.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          {
                            handleTehsilChange(
                              event,
                              newValue,
                              "demographicInclude"
                            );
                          }
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicInclude.title === "Pincode" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Pincode <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={pin}
                        getOptionLabel={(option) => option.pin_code}
                        value={pin.filter((sub) =>
                          selectedPin.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePinChange(
                            event,
                            newValue,
                            "demographicInclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicInclude.title === "Place" && (
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Place <span className={classes.textcolorred}>*</span>
                      </FormLabel>

                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={place}
                        getOptionLabel={(option) => option.pin_code}
                        value={place.filter((sub) =>
                          selectedPlace.demographicInclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePlaceChange(
                            event,
                            newValue,
                            "demographicInclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicInclude"
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
          </div>

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
export default EditLogisticAreaForm;
