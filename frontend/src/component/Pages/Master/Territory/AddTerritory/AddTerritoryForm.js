import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
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


function AddTerritoryForm({ style }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState({
    name: "",
    short_name: "",
    code: null,
    demographic_include: "",
    demographic_include_id: [],
    demographic_exclude: "",
    demographic_exclude_id: [],
    demographic_exclude_2: "",
     demographic_exclude_2_id: [],
  });

  const [showDemographicExclude2,setShowDemographicExclude2] = useState(false)
 
   const [state, setState] = useState([]);
   const [selectedState, setSelectedState] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 
   const [country, setCountry] = useState([]);
   const [selectedCountry, setSelectedCountry] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 
   const [district, setDistrict] = useState([]);
   const [selectedDistrict, setSelectedDistrict] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 
   const [tehsil, setTehsil] = useState([]);
   const [selectedTehsil, setSelectedTehsil] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 
 
   const [pin, setPin] = useState([]);
   const [selectedPin, setSelectedPin] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 
   const [place, setPlace] = useState([]);
   const [selectedPlace, setSelectedPlace] = useState({
     demographicInclude: "",
     demographicExclude: "",
     demographicExclude2: "",
   });
 

 const [selectedDemographicInclude, setSelectedDemographicInclude] =
     useState("");
   const [selectedDemographicExclude, setSelectedDemographicExclude] =
     useState("");
   const [selectedDemographicExclude2, setSelectedDemographicExclude2] =
     useState("");
 
  const filteredOptions = demographicInclude.filter((option) => {
    if (!selectedDemographicInclude) return option.id !== 1;
    return option.id > selectedDemographicInclude.id;
  });

  const handleAPi=(ids)=>{
    if(selectedDemographicInclude.title==='Country'){
      fetchState(ids)
    }
    if(selectedDemographicInclude.title==='State'){
      fetchDistrict(ids)
    
    }
    if(selectedDemographicInclude.title==='District'){
      fetchTehsil(ids)
    
    }
    if(selectedDemographicInclude.title==='Tehsil'){
      fetchPin(ids)
    
    }
    if(selectedDemographicInclude.title==='Pincode'){
       fetchPlace(ids)
    }
    }
    
      const handleDemographicChange = (event, newValue, filedName) => {
        if (filedName === "demographicInclude") {
          setSelectedDemographicInclude(newValue);
          setSelectedDemographicExclude('');
          setSelectedDemographicExclude2('');
          setFormDetails((pre) => ({
            ...pre,
            demographic_include: newValue.title,
          }));
        }
        if (filedName === "demographicExclude") {
          setSelectedDemographicExclude(newValue);
          setFormDetails((pre) => ({
            ...pre,
            demographic_exclude: newValue.title,
          }));
        }
        if (filedName === "demographicExclude2") {
          setSelectedDemographicExclude2(newValue);
          setFormDetails((pre) => ({
            ...pre,
            demographic_exclude_2: newValue.title,
          }));
        }
      };
    
      const toggleDemographicExclude = () => {
        setShowDemographicExclude2(!showDemographicExclude2)
        setFormDetails((pre)=>(
          {
            ...pre,
            demographic_exclude_2: "",
            demographic_exclude_2_id: [],
          }
        ))
        setSelectedDemographicExclude2('')
        setSelectedCountry((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
        setSelectedState((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
        setSelectedDistrict((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
        setSelectedTehsil((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
        setSelectedPin((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
        setSelectedPlace((pre)=>({
          ...pre,
          demographicExclude2: "",
        }))
      };
    
      const handleDemographicId = (filedName, newValue) => {
        if (filedName === "demographicInclude") {
          setFormDetails((pre) => ({
            ...pre,
            demographic_include_id: newValue.map((subject) => subject.id),
          }));
        }
        if (filedName === "demographicExclude") {
          setFormDetails((pre) => ({
            ...pre,
            demographic_exclude_id: newValue.map((subject) => subject.id),
          }));
        }
        if (filedName === "demographicExclude2") {
          setFormDetails((pre) => ({
            ...pre,
             demographic_exclude_2_id: newValue.map((subject) => subject.id),
          }));
        }
      };
    
      const handleCountryChange = (event, newValue, filedName) => {
        setSelectedCountry((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
        handleAPi(newValue.map((subject) => subject.id))
      };
      // console.log('selectedCountry',selectedCountry)
    
      const handleStateChange = (event, newValue, filedName) => {
        setSelectedState((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
        handleAPi(newValue.map((subject) => subject.id))
      };
    
    
      const handleDistrictChange = (event, newValue, filedName) => {
        setSelectedDistrict((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
        handleAPi(newValue.map((subject) => subject.id))
      };
    
      const handleTehsilChange = (event, newValue, filedName) => {
        setSelectedTehsil((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
        handleAPi(newValue.map((subject) => subject.id))
      };
    
      const handlePinChange = (event, newValue, filedName) => {
        setSelectedPin((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
        handleAPi(newValue.map((subject) => subject.id))
      };
    
      
      const handlePlaceChange = (event, newValue, filedName) => {
        setSelectedPlace((prevState) => ({
          ...prevState,
          [filedName]: newValue.map((subject) => subject.id),
        }));
        handleDemographicId(filedName, newValue);
      };

      const isNumber = (value) => {
        return !isNaN(value) && value !== "";
      };

  const handleClose = () => {
    style?.isPopUp ? style?.onClose() : navigate("/territory-list");
  };

  const handleFormSubmit = () => {
    console.log('data2',formDetails)

    if (!formDetails.name.trim()) {
      toast.error("Area Name is required");
      return;
    }
    if (!formDetails.demographic_include.trim()) {
      toast.error("Demographic Include is required");
      return;
    }
    if (formDetails.demographic_include_id.length === 0) {
      toast.error(`${formDetails.demographic_include.trim()} is required`);
      return;
    }

    if (formDetails.code && !isNumber(formDetails.code)) {
      toast.error("Area code must be a number");
      return;
    }


    const data = {
      business_area_teritari: formDetails,
    };

    // if(true){
    //   console.log('data',data)
    //   return
    // }

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_area_teritari/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("territory Information add Successfully");
        console.log("formDetails", formDetails);
        setTimeout(() => {
          style?.isPopUp
            ? style?.isPopUp && style?.onClose()
            : navigate("/territory-list");
            style?.isPopUp && style?.fetchTerritory();
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
    if(ids){
      const data = {
        ids
      }
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
    }else{
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
    if(ids){
      const data = {
        ids
      }
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
    }else{
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
    if(ids){
      const data = {
        ids
      }
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
    }else{
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
    }}
  };

  useEffect(() => {
    fetchTehsil();
  }, []);

  const fetchPin = async (ids) => {
    if(ids){
      const data = {
        ids
      }
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
    }else{
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
    }}
  };

  useEffect(() => {
    fetchPin();
  }, []);

  const fetchPlace = async (ids) => {
    if(ids){
      const data = {
        ids
      }
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
    }else{
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
    }}
  };

  useEffect(() => {
    fetchPlace();
  }, []);

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
                Territory Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Territory Name <span className={classes.textcolorred}>*</span>
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
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Short Name
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.short_name}
                  name="short_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24_5}`}
              >
                {/* <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Territory Code
                </FormLabel>
                <TextField
                  onChange={handleChange}
                  value={formDetails.code}
                  name="code"
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
                  Demographic Exclude   {
  !showDemographicExclude2 &&
   <IconButton onClick={toggleDemographicExclude} className={`${classes.center}`}>
      <AddBoxOutlinedIcon />
    </IconButton>
  }
           
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={filteredOptions || []}
                  value={selectedDemographicExclude}
                  onChange={(event, newValue) =>
                    handleDemographicChange(
                      event,
                      newValue,
                      "demographicExclude"
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
              {selectedDemographicExclude.title ? (
                <>
                  {selectedDemographicExclude.title === "State" && (
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
                          selectedState.demographicExclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleStateChange(
                            event,
                            newValue,
                            "demographicExclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicExclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicExclude.title === "District" && (
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
                          selectedDistrict.demographicExclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleDistrictChange(
                            event,
                            newValue,
                            "demographicExclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicExclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicExclude.title === "Tehsil" && (
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
                          selectedTehsil.demographicExclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handleTehsilChange(
                            event,
                            newValue,
                            "demographicExclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicExclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicExclude.title === "Pincode" && (
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
                          selectedPin.demographicExclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePinChange(
                            event,
                            newValue,
                            "demographicExclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicExclude"
                            type="text"
                            variant="outlined"
                            placeholder="Type to pick..."
                            {...params}
                          />
                        )}
                      />
                    </div>
                  )}

                  {selectedDemographicExclude.title === "Place" && (
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
                          selectedPlace.demographicExclude.includes(sub.id)
                        )}
                        onChange={(event, newValue) => {
                          handlePlaceChange(
                            event,
                            newValue,
                            "demographicExclude"
                          );
                        }}
                        disableClearable
                        forcePopupIcon={false}
                        renderInput={(params) => (
                          <TextField
                            name="demographicExclude"
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
           {
            showDemographicExclude2&& <div
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
                Demographic Exclude 2
                
      {
        showDemographicExclude2 &&
        <IconButton onClick={toggleDemographicExclude} className={`${classes.center}`}>
               <IndeterminateCheckBoxOutlinedIcon />
              </IconButton>
        }
              </FormLabel>
              <Autocomplete
                id="state-autocomplete"
                options={filteredOptions || []}
                value={selectedDemographicExclude2}
                onChange={(event, newValue) =>
                  handleDemographicChange(
                    event,
                    newValue,
                    "demographicExclude2"
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
            {selectedDemographicExclude2.title ? (
              <>
                {selectedDemographicExclude2.title === "State" && (
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
                        selectedState.demographicExclude2.includes(sub.id)
                      )}
                      onChange={(event, newValue) => {
                        handleStateChange(
                          event,
                          newValue,
                          "demographicExclude2"
                        );
                      }}
                      disableClearable
                      forcePopupIcon={false}
                      renderInput={(params) => (
                        <TextField
                          name="demographicExclude2"
                          type="text"
                          variant="outlined"
                          placeholder="Type to pick..."
                          {...params}
                        />
                      )}
                    />
                  </div>
                )}

                {selectedDemographicExclude2.title === "District" && (
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
                        selectedDistrict.demographicExclude2.includes(sub.id)
                      )}
                      onChange={(event, newValue) => {
                        handleDistrictChange(
                          event,
                          newValue,
                          "demographicExclude2"
                        );
                      }}
                      disableClearable
                      forcePopupIcon={false}
                      renderInput={(params) => (
                        <TextField
                          name="demographicExclude"
                          type="text"
                          variant="outlined"
                          placeholder="Type to pick..."
                          {...params}
                        />
                      )}
                    />
                  </div>
                )}

                {selectedDemographicExclude2.title === "Tehsil" && (
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
                        selectedTehsil.demographicExclude2.includes(sub.id)
                      )}
                      onChange={(event, newValue) => {
                        handleTehsilChange(
                          event,
                          newValue,
                          "demographicExclude2"
                        );
                      }}
                      disableClearable
                      forcePopupIcon={false}
                      renderInput={(params) => (
                        <TextField
                          name="demographicExclude"
                          type="text"
                          variant="outlined"
                          placeholder="Type to pick..."
                          {...params}
                        />
                      )}
                    />
                  </div>
                )}

                {selectedDemographicExclude2.title === "Pincode" && (
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
                        selectedPin.demographicExclude2.includes(sub.id)
                      )}
                      onChange={(event, newValue) => {
                        handlePinChange(
                          event,
                          newValue,
                          "demographicExclude2"
                        );
                      }}
                      disableClearable
                      forcePopupIcon={false}
                      renderInput={(params) => (
                        <TextField
                          name="demographicExclude"
                          type="text"
                          variant="outlined"
                          placeholder="Type to pick..."
                          {...params}
                        />
                      )}
                    />
                  </div>
                )}

                {selectedDemographicExclude2.title === "Place" && (
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
                        selectedPlace.demographicExclude2.includes(sub.id)
                      )}
                      onChange={(event, newValue) => {
                        handlePlaceChange(
                          event,
                          newValue,
                          "demographicExclude2"
                        );
                      }}
                      disableClearable
                      forcePopupIcon={false}
                      renderInput={(params) => (
                        <TextField
                          name="demographicExclude"
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
           }
          </div>

          {/* handle button click event */}

          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${
              classes[style?.marginbottom]
            }`}
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
        </FormControl>
      </div>
    </>
  );
}
export default AddTerritoryForm;
