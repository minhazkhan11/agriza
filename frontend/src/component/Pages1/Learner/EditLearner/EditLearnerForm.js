import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";
import { ReactComponent as NameIcon } from "../../../images/learnersimage/nameicon.svg";
import { ReactComponent as EmailIcon } from "../../../images/learnersimage/emailicon.svg";
import { ReactComponent as PhoneIcon } from "../../../images/learnersimage/phoneicon.svg";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useParams } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

function EditLearnerForm() {
  const classes = useStyles();
  const { rowId } = useParams();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
  const initialData = {
    learner_name: "",
    email: "",
    phone: "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    course_id: "",
    batch_id: "",
    address: "",
    password: "",
    about: "",
    facebook_link: "",
    instagram_link: "",
    linkedin_link: "",
    state_id: "",
    district_id: "",
    pincode: "",
    roll_number:"",
    gender: "",
    dob: "",

    file: null,
  };

  // Function to validate names (only alphabetic characters, spaces, hyphens, and apostrophes allowed)
  const validateName = (name) => {
    // Regex pattern for validating names (allows letters, spaces, apostrophes, and hyphens)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
  };
  
  // Handler for learner name field
  const handleLearnerNameChange = (name) => {
    if (!validateName(name)) {
      setLearnerNameError(true);
    } else {
      setLearnerNameError(false);
    }
    setClientName(name); // Assuming 'learnerName' is the field you're updating
  };
  
  // Handler for guardian name field
  const handleGuardianNameChange = (name) => {
    if (!validateName(name)) {
      setGuardianNameError(true);
    } else {
      setGuardianNameError(false);
    }
    handleFormChange("guardian_name", name)
  };
  
  // Handler to prevent numbers from being typed in the name field
const handleKeyPress = (event) => {
  if (event.keyCode >= 48 && event.keyCode <= 57) {
    event.preventDefault(); // Block the input of numbers
  }
};

  const [learnerNameError, setLearnerNameError] = useState(false);  
  const [guardianNameError, setGuardianNameError] = useState(false); 
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // New state_id for phone number error message
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  // New state_id for phone number error
  const [phoneError, setPhoneError] = useState(false);

  // Updated phone field handler
  const handlePhoneChange = (value) => {
    const phoneRegex = /^[6789]\d{0,9}$/; // Updated regex to allow only 10 digits

    // Check if the input starts with 6, 7, 8, or 9 and is up to 10 digits long
    if (phoneRegex.test(value) || value === "") {
      setPhoneErrorMessage("");
      setPhoneError(false);
      handleFormChange("phone", value);
    } else {
      if (value.length <= 10) {
        setPhoneErrorMessage("Phone number should start with 6, 7, 8, or 9.");
        setPhoneError(true);
      }
    }
  };

  // New state_id for guardian phone number error
  const [guardianPhoneError, setGuardianPhoneError] = useState(false);

  // New state_id for guardian phone number error message
  const [guardianPhoneErrorMessage, setGuardianPhoneErrorMessage] =
    useState("");

  // Updated guardian phone field handler
  const handleGuardianPhoneChange = (value) => {
    const phoneRegex = /^[6789]\d{0,9}$/; // Updated regex to allow only 10 digits

    // Check if the input starts with 6, 7, 8, or 9 and is up to 10 digits long
    if (phoneRegex.test(value) || value === "") {
      setGuardianPhoneErrorMessage("");
      setGuardianPhoneError(false);
      handleFormChange("guardian_phone", value); // Update state_id only if it matches regex or is empty
    } else {
      // If not valid, keep the old value and do not display an error message for 10 digits
      if (value.length <= 10) {
        setGuardianPhoneErrorMessage(
          "Guardian phone number should start with 6, 7, 8, or 9."
        );
        setGuardianPhoneError(true);
      }
    }
  };

  // State for student email error
  const [studentEmailError, setStudentEmailError] = useState(false);

  // Function to validate email
  const validateEmail = (email) => {
    // Standard email regex pattern
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handler for student email field
  const handleStudentEmailChange = (email) => {
    if (!validateEmail(email)) {
      setStudentEmailError(true);
    } else {
      setStudentEmailError(false);
    }
    handleFormChange("email", email); // Assuming your state_id field is named 'studentEmail'
  };

  // New state_id for guardian's email error
  const [guardianEmailError, setGuardianEmailError] = useState(false);

  // Handler for guardian's email field
  const handleGuardianEmailChange = (email) => {
    if (!validateEmail(email)) {
      setGuardianEmailError(true);
    } else {
      setGuardianEmailError(false);
    }
    handleFormChange("guardian_email", email);
  };

  const [pincodeError, setPincodeError] = useState(false);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState("");

  const [rollNumber, setRollNumber] = useState("");
  const [formDetails, setFormDetails] = useState(initialData);
  const [clientName, setClientName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
    console.log("Password visibility toggled:", !showPassword); // Debugging
  };
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [cources, setCources] = useState([]);
  const [selectedCource, setSelectedCource] = useState("");

  const fetchBatches = async (selectedCource) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_course_id/${selectedCource}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            // Add other headers if needed
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches);
      } else {
        console.error("Failed to fetch batches data");
      }
    } catch (error) {
      console.error("Error fetching batches data:", error);
    }
  };

  useEffect(() => {
    fetchBatches(selectedCource);
  }, [selectedCource]);

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const fetchCources = async () => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            // Add other headers if needed
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCources(data.courses);
      } else {
        console.error("Failed to fetch courses data");
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  useEffect(() => {
    fetchCources();
  }, []);
  const handleCourceChange = (event) => {
    setSelectedCource(event.target.value);
  };

  const fetchStates = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStates(data.states);
      } else {
        console.error("Failed to fetch categories data");
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchDistricts = async (selectedStateId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state/${selectedStateId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDistricts(data.cities);
      } else {
        console.error("Failed to fetch categories data");
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };
  useEffect(() => {
    fetchDistricts(selectedStateId);
  }, [selectedStateId]);

  const handleStateChange = (event, value) => {
    setSelectedState(value);
    setSelectedStateId(value.id);
  };
  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value);
    setSelectedDistrictId(value.id);
  };

  const handleFormChange = (fieldName, value) => {
    if (fieldName === "pincode") {
      if (value.length === 6) {
        setPincodeError(false);
        setPincodeErrorMessage("");
      } else {
        setPincodeError(true);
        setPincodeErrorMessage("Pincode must be exactly 6 digits");
      }
      // Update the pincode value only if it's 6 digits or less
      if (value.length <= 6) {
        setFormDetails((prevFormDetails) => ({
          ...prevFormDetails,
          [fieldName]: value,
        }));
      }
    } else {
      setFormDetails((prevFormDetails) => ({
        ...prevFormDetails,
        [fieldName]: value,
      }));
    }
  };

  const generateRandomPassword = (length) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(8);
    handleFormChange("password", newPassword);
  };

  const handleCancel = () => {
    navigate("/admin/learner");
  };

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

  const handleFormSubmit = async () => {
    // Reset password error state before validation
    setPasswordError(false);
    setPasswordErrorMessage("");

    if (!formDetails || !formDetails.password || !formDetails.password.trim()) {
      setPasswordError(true);
      setPasswordErrorMessage("Please enter a password.");
      toast.warn("Please enter a password.");
      return; // Prevent form submission
    }

    if (formDetails.password.trim().length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long");
      toast.warn("Password must be at least 6 characters long");
      return; // Prevent form submission
    }

    if (
      !clientName.trim() ||
      !formDetails?.email?.trim() ||
      !formDetails?.phone?.trim() ||
      !formDetails?.guardian_name?.trim() ||
      // !formDetails?.guardian_email?.trim() ||
      !formDetails?.guardian_phone?.trim() ||
      (typeof selectedCource === "string" && !selectedCource.trim()) ||
      (typeof selectedBatch === "string" && !selectedBatch.trim()) ||
      !formDetails?.password?.trim()
    ) {
      if (!clientName.trim()) {
        toast.warn("Please enter a learner name.");
      } else if (!formDetails?.email?.trim()) {
        toast.warn("Please enter an email.");
      } else if (!formDetails?.phone?.trim()) {
        toast.warn("Please enter a phone number.");
      } else if (!formDetails?.guardian_name?.trim()) {
        toast.warn("Please enter a Guardian/ Father name.");
      } else if (!formDetails?.guardian_phone?.trim()) {
        toast.warn("Please enter a Guardian phone.");
      } else if (typeof selectedCource === "string" && !selectedCource.trim()) {
        toast.warn("Please select a course.");
      } else if (typeof selectedBatch === "string" && !selectedBatch.trim()) {
        toast.warn("Please select a batch.");
      } else if (!formDetails?.password?.trim()) {
        toast.warn("Please enter a password.");
      }else if (!formDetails?.roll_number?.trim()) {
        toast.warn("Please enter Roll Number.");
      }
      return;
    }

    try {
      const formData = new FormData();

      const learnerData = {
        id: rowId,
        learner_name: clientName,
        email: formDetails.email,
        phone: formDetails.phone,
        guardian_name: formDetails.guardian_name,
        guardian_email: formDetails.guardian_email,
        guardian_phone: formDetails.guardian_phone,
        course_id: selectedCource,
        batch_id: selectedBatch,
        gender: formDetails.gender ? formDetails.gender : null,
        dob: formDetails.dob ? formDetails.dob : null,
        address: formDetails.address ? formDetails.address : null,
        password: formDetails.password,
        about: formDetails.about,
        facebook_link: formDetails.facebook_link,
        roll_number:formDetails.roll_number,
        instagram_link: formDetails.instagram_link,
        linkedin_link: formDetails.linkedin_link,
        state_id: selectedStateId ? selectedStateId : null,
        district_id: selectedDistrictId ? selectedDistrictId : null,
        pincode: formDetails.pincode ? formDetails.pincode : null,
      };

      formData.append("learner", JSON.stringify(learnerData));
      formData.append("file", thumbnailImage);
      console.log(thumbnailImage, "thumbnailImage");
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Learner updated successfully!");
        setTimeout(() => {
          navigate("/admin/learner");
        }, 2000);
      } else {
        // Handling other successful status codes if needed
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display the error message from the API response
        toast.error(error.response.data.message);
      } else {
        // Generic error message for other types of errors
        toast.error("An error occurred while creating the learner.");
      }
      console.error("An error occurred:", error);
    }
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.learner;

        const initialData = {
          learner_name: data?.full_name ? data.full_name : null,
          email: data?.email ? data.email : null,
          phone: data?.phone ? data.phone : null,
          course: data?.learner_information?.course
            ? data.learner_information.course
            : null,
          gender: data?.learner_information?.gender
            ? data.learner_information.gender
            : null,
          guardian_name: data?.learner_information?.guardian_name
            ? data.learner_information.guardian_name
            : null,
          guardian_email: data?.learner_information?.guardian_email
            ? data.learner_information.guardian_email
            : null,
          guardian_phone: data?.learner_information?.guardian_phone
            ? data.learner_information.guardian_phone
            : null,
          dob: data?.learner_information?.dob
            ? data.learner_information.dob.split("T")[0]
            : "",
          about: data?.learner_information?.about
            ? data.learner_information.about
            : null,
          password: data?.learner_information?.password
            ? data.learner_information.password
            : null,
          facebook_link: data?.learner_information?.facebook_link
            ? data.learner_information.facebook_link
            : null,
          instagram_link: data?.learner_information?.instagram_link
            ? data.learner_information.instagram_link
            : null,
          linkedin_link: data?.learner_information?.linkedin_link
            ? data.learner_information.linkedin_link
            : null,
          state_id: data?.learner_information?.state_id
            ? data.learner_information.state_id
            : null,
          district_id: data?.learner_information?.district_id
            ? data.learner_information.district_id
            : null,
          address: data?.learner_information?.address
            ? data.learner_information.address
            : null,
          pincode: data?.learner_information?.pincode
            ? data.learner_information.pincode
            : null,
          roll_number:data?.learner_information?.roll_number
            ?data?.learner_information?.roll_number
            :''
        };

        setFormDetails(initialData);
        setClientName(data?.full_name);
        setSelectedDistrict(data?.learner_information?.district);
        setSelectedState(data?.learner_information?.state);
        setSelectedDistrictId(data?.learner_information?.district_id);
        setSelectedStateId(data?.learner_information?.state_id);
        setSelectedBatch(data?.learner_information?.batch?.id);
        setSelectedCource(data?.learner_information?.course?.id);
        setThumbnailImage(data?.image_url);
        setThumbnailImagePreview(data?.image_url);
        setRollNumber(data?.learner_information?.roll_number);
      } else {
        // toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };
  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h78vh}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py1} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.mt0} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Learner Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Learner Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleLearnerNameChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  value={clientName}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Learner Name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <NameIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Display error message for learner name */}
                {learnerNameError && (
                  <Typography color="error" className={classes.errorMessage}>
                    Please enter a valid name.
                  </Typography>
                )}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} 
              ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleStudentEmailChange(e.target.value)}
                  value={formDetails.email}
                  type="email"
                  variant="outlined"
                  required
                  placeholder="Enter Email Address"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Display error message for student email */}
                {studentEmailError && (
                  <Typography color="error" className={classes.errorMessage}>
                    Please enter a valid email address
                  </Typography>
                )}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Mobile No. <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="91XXXXXXXX"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Display error message for phone */}
                {phoneError && (
                  <Typography color="error" className={classes.errorMessage}>
                    {phoneErrorMessage}
                  </Typography>
                )}
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
                Guardian / Father Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Guardian / Father Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.guardian_name}
                  onChange={(e) =>
                    handleGuardianNameChange(e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Father Name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <NameIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                  {/* Display error message for guardian name */}
                  {guardianNameError && (
                  <Typography color="error" className={classes.errorMessage}>
                    Please enter a valid name.
                  </Typography>
                )}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} 
              ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Guardian / Father Email Address
                </FormLabel>
                <TextField
                  name="guardian_email"
                  type="email"
                  variant="outlined"
                  required
                  placeholder="Enter Father Email"
                  value={formDetails.guardian_email}
                  onChange={(e) => handleGuardianEmailChange(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Display error message for guardian's email */}
                {guardianEmailError && (
                  <Typography color="error" className={classes.errorMessage}>
                    Please enter a valid email address
                  </Typography>
                )}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Guardian / Father Mobile No.{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.guardian_phone}
                  onChange={(e) => handleGuardianPhoneChange(e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="91XXXXXXXX"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {guardianPhoneError && (
                  <Typography color="error" className={classes.errorMessage}>
                    {guardianPhoneErrorMessage}
                  </Typography>
                )}
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
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} 
              ${classes.lineheight}`}
                >
                  Course <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedCource}
                  onChange={handleCourceChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Course
                  </MenuItem>
                  {cources &&
                    cources.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.course_name}
                      </MenuItem>
                    ))}
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Batch <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Batch
                  </MenuItem>
                  {batches &&
                    batches.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.batch_name}
                      </MenuItem>
                    ))}
                </Select>
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Roll Number
                </FormLabel>
                <TextField
                  value={formDetails.roll_number}
                  onChange={(e) => handleFormChange("roll_number", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Roll Number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <NameIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} 
               ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  D.O.B
                </FormLabel>
                <TextField
                  name="dob"
                  type="date"
                  variant="outlined"
                  required
                  value={formDetails.dob}
                  onChange={(e) => handleFormChange("dob", e.target.value)}
                  InputProps={{
                    inputProps: {
                      max: new Date().toISOString().split("T")[0],
                    },
                  }}
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
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal}
               ${classes.fw400} ${classes.lineheight}`}
                >
                  Gender
                </FormLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  name="gender"
                  value={formDetails.gender}
                  onChange={(e) => handleFormChange("gender", e.target.value)}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Gender
                  </MenuItem>
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Create Password{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  required
                  placeholder="********"
                  value={formDetails.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24} ${classes.mt1_5}`}
              >
                <Button
                  onClick={handleGeneratePassword}
                  className={`${classes.custombtnblue}`}
                >
                  Auto Generate
                </Button>
              </div>
            </div>
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1_5}`}
            >
              <Typography
                className={` ${classes.w24}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  About
                </FormLabel>
                <TextField
                  value={formDetails.about}
                  onChange={(e) => handleFormChange("about", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadButtons
                  onImageChange={handleThumbnailImageChange}
                  thumbnailImage={thumbnailImage}
                  thumbnailImagePreview={thumbnailImagePreview}
                  setThumbnailImagePreview={setThumbnailImagePreview}
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
                  Facebook Link
                </FormLabel>
                <TextField
                  type="link"
                  variant="outlined"
                  required
                  value={formDetails.facebook_link}
                  onChange={(e) =>
                    handleFormChange("facebook_link", e.target.value)
                  }
                  placeholder=""
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Instagram Link
                </FormLabel>
                <TextField
                  type="link"
                  variant="outlined"
                  required
                  value={formDetails.instagram_link}
                  onChange={(e) =>
                    handleFormChange("instagram_link", e.target.value)
                  }
                  placeholder=""
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  LinkedIn Link
                </FormLabel>
                <TextField
                  type="link"
                  variant="outlined"
                  required
                  value={formDetails.linkedin_link}
                  onChange={(e) =>
                    handleFormChange("linkedin_link", e.target.value)
                  }
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py1} ${classes.px1_5} ${classes.mt1}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Address
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w74}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address
                </FormLabel>
                <TextField
                  value={formDetails.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  multiline
                  rows={6}
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
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} 
              ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  State
                </FormLabel>
                {/* <Select
                  labelId="category-label"
                  id="state_id"
                  value={selectedState}
                  onChange={handleStateChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select State
                  </MenuItem>
                  {states &&
                    states.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.name}
                      </MenuItem>
                    ))}
                </Select> */}
                <Autocomplete
                  id="state-autocomplete"
                  options={states || []}
                  value={selectedState}
                  onChange={handleStateChange}
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select State"
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
                  District
                </FormLabel>
                {/* <Select
                  labelId="category-label"
                  id="district_id"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select District
                  </MenuItem>
                  {districts &&
                    districts.map((dist) => (
                      <MenuItem key={dist.id} value={dist.id}>
                        {dist.name}
                      </MenuItem>
                    ))}
                </Select> */}
                <Autocomplete
                  options={districts || []}
                  id="district_id"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select District"
                      variant="outlined"
                      {...params}
                    />
                  )}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} 
              ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Pincode
                </FormLabel>
                <TextField
                  name="pincode"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Pincode"
                  value={formDetails.pincode}
                  onChange={(e) => handleFormChange("pincode", e.target.value)}
                  error={pincodeError}
                  helperText={pincodeError ? pincodeErrorMessage : ""}
                  inputProps={{ maxLength: 6, pattern: "\\d*" }}
                />
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
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
export default EditLearnerForm;
