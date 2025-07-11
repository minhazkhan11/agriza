import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactComponent as NameIcon } from "../../../images/learnersimage/nameicon.svg";
import { ReactComponent as PhoneIcon } from "../../../images/learnersimage/phoneicon.svg";
import { ReactComponent as EmailIcon } from "../../../images/learnersimage/emailicon.svg";
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import { Divider } from "@material-ui/core";
import AddMoreAndRemoveButton from "../../../CustomComponent/AddMoreAndRemoveButton";
import { Autocomplete } from "@material-ui/lab";

function AddTeacherForm() {
  const classes = useStyles();
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
    teacher_name: "",
    email: "",
    phone: "",
    degree: "",
    dob: "",
    education_collage_or_school_name: "",
    board_or_university_name: "",
    started_at: "",
    ended_at: "",
    percentage: "",
    experience_collage_or_school_or_university_name: "",
    role_and_responsibility: "",
    joining_date: "",
    leaving_date: "",
    total_months: "",
    about: "",
    password: "",
    facebook_link: "",
    instagram_link: "",
    linkedin_link: "",
    address: "",
    state_id: "",
    district_id: "",
    pincode: "",

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [clientName, setClientName] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [cources, setCources] = useState([]);
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
        console.log(cources);
        console.log(data.courses, "courses");
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
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const decryptedToken = decryptData(sessionStorage.getItem("token"));

        // Ensure selectedCourses is not empty before making the request
        if (selectedCourses.length > 0) {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_course_ids/list`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${decryptedToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                batch: {
                  course_ids: selectedCourses,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setBatches(data.batches);
          } else {
            console.error("Failed to fetch batches data:", response);
          }
        }
      } catch (error) {
        console.error("Error fetching batches data:", error);
      }
    };

    fetchBatches();
  }, [selectedCourses]); // Dependency array includes selectedCourses

  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);

  const handleCourseDropdownOpen = () => {
    setIsCourseDropdownOpen(true);
  };

  const handleCourseDropdownClose = () => {
    setIsCourseDropdownOpen(false);
  };

  const handleCourseChange = (event) => {
    setSelectedCourses(event.target.value);
    handleCourseDropdownClose(); // Close the dropdown after selection
  };

  const handleBatchDropdownOpen = () => {
    setIsBatchDropdownOpen(true);
  };

  const handleBatchDropdownClose = () => {
    setIsBatchDropdownOpen(false);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    handleBatchDropdownClose();
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
    setSelectedStateId(value.id);
    setSelectedState(value);
  };

  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value);
    setSelectedDistrictId(value.id);
  };

  const [pincodeError, setPincodeError] = useState(false);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState("");

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
    navigate("/admin/teacher");
  };

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

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

  // State for student email error
  const [EmailError, setEmailError] = useState(false);

  // Function to validate email
  const validateEmail = (email) => {
    // Standard email regex pattern
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handler for student email field
  const handleEmailChange = (email) => {
    if (!validateEmail(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    handleFormChange("email", email); // Assuming your state_id field is named 'studentEmail'
  };

  const [educationRows, setEducationRows] = useState([initialData]);

  const handleAddRow = () => {
    setEducationRows([...educationRows, initialData]);
  };

  const [percentageError, setPercentageError] = useState(false);
  const [percentageErrorMessage, setPercentageErrorMessage] = useState("");

  const handleRemoveEducationRow = () => {
    setEducationRows((prevRows) => {
      if (prevRows.length > 1) {
        // Remove the last row and update state
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleRemoveExperienceRow = () => {
    setExperienceRows((prevRows) => {
      if (prevRows.length > 1) {
        // Remove the last row and update state
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleEducationRowChange = (index, fieldName, value) => {
    const updatedRows = [...educationRows];
    let row = { ...updatedRows[index] };

    if (fieldName === "percentage") {
      if (value === "") {
        setPercentageError(false);
        setPercentageErrorMessage("");
        row[fieldName] = value;
      } else {
        const percentageValue = parseFloat(value);
        if (
          percentageValue < 0 ||
          percentageValue > 100 ||
          isNaN(percentageValue)
        ) {
          setPercentageError(true);
          setPercentageErrorMessage("Percentage must be between 0 and 100");
          return; // Prevent the state update
        } else {
          setPercentageError(false);
          setPercentageErrorMessage("");
          row[fieldName] = value;
        }
      }
    } else {
      row[fieldName] = value;
    }

    if (fieldName === "started_at") {
      if (new Date(value) > new Date()) {
        toast.warn("Start date cannot be in the future.");
        return; // Don't update the state
      } else {
        row[fieldName] = value;
      }
    } else if (fieldName === "ended_at") {
      if (new Date(value) < new Date(row.started_at)) {
        toast.warn("End date cannot be before the start date.");
        return; // Don't update the state
      } else {
        row[fieldName] = value;
      }
    } else {
      row[fieldName] = value;
    }

    updatedRows[index] = row;
    setEducationRows(updatedRows);
  };

  const [experienceRows, setExperienceRows] = useState([initialData]);

  const handleAddExpRow = () => {
    setExperienceRows([...experienceRows, initialData]);
  };

  const calculateMonthDifference = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    return Math.max(0, months);
  };

  const [maxJoiningDate, setMaxJoiningDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [minLeavingDate, setMinLeavingDate] = useState("");

  const handleExperienceRowChange = (index, fieldName, value) => {
    const updatedRows = [...experienceRows];
    let row = { ...updatedRows[index] };

    if (fieldName === "joining_date") {
      if (new Date(value) > new Date()) {
        toast.warn("Joining date cannot be in the future.");
        return; // Don't update the state_id
      } else {
        row[fieldName] = value;
        setMinLeavingDate(value); // Update the minimum leaving date
      }
    } else if (fieldName === "leaving_date") {
      if (new Date(value) < new Date(row.joining_date)) {
        toast.warn("Leaving date cannot be earlier than the joining date.");
        return; // Don't update the state_id
      } else {
        row[fieldName] = value;
      }
    } else {
      row[fieldName] = value;
    }

    // If either joining_date or leaving_date changes, calculate the months difference
    if (fieldName === "joining_date" || fieldName === "leaving_date") {
      row.total_months = calculateMonthDifference(
        row.joining_date,
        row.leaving_date
      );
    }

    updatedRows[index] = row;
    setExperienceRows(updatedRows);
  };

  const validateEducationRows = () => {
    let isValid = true;
    let errorMessage = "";

    for (let i = 0; i < educationRows.length; i++) {
      const row = educationRows[i];

      if (!row.degree.trim()) {
        isValid = false;
        errorMessage = "Please enter Degree Name in Education Details.";
        break;
      } else if (!row.education_collage_or_school_name.trim()) {
        isValid = false;
        errorMessage = "Please enter School/Collage Name in Education Details.";
        break;
      } else if (!row.board_or_university_name.trim()) {
        isValid = false;
        errorMessage =
          "Please enter Board/University Name in Education Details.";
        break;
      } else if (!row.started_at.trim()) {
        isValid = false;
        errorMessage = "Please enter Start Date in Education Details.";
        break;
      } else if (!row.ended_at.trim()) {
        isValid = false;
        errorMessage = "Please enter End Date in Education Details.";
        break;
      } else if (!row.percentage.trim()) {
        isValid = false;
        errorMessage = "Please enter Percentage in Education Details.";
        break;
      }
    }

    if (!isValid) {
      toast.warn(errorMessage);
    }

    return isValid;
  };

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleFormSubmit = async () => {
    // Reset password error state before validation
    setPasswordError(false);
    setPasswordErrorMessage("");

    // Other validations as before...

    // Validate password length
    if (formDetails.password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long");
      toast.warn("Password must be at least 6 characters long");
      return; // Prevent form submission
    }

    if (
      !clientName.trim() ||
      !formDetails.email.trim() ||
      !formDetails.phone.trim() ||
      formDetails.phone.length !== 10 ||
      !formDetails.password.trim()
    ) {
      // Provide specific messages based on the validation that failed
      if (!clientName.trim()) {
        toast.warn("Please enter a teacher name.");
      }
      if (!formDetails.email.trim()) {
        toast.warn("Please enter an email.");
      }
      if (!formDetails.phone.trim()) {
        toast.warn("Please enter a phone number.");
      }
      if (formDetails.phone.length !== 10) {
        toast.warn("Phone number must be exactly 10 digits.");
      }
      if (!formDetails.password.trim()) {
        toast.warn("Please enter a password.");
      }
      // Prevent form submission if any validation fails
      return;
    }

    // New addition: Validate education rows
    if (!validateEducationRows()) {
      return; // Halt the submission if validation fails
    }

    try {
      const formData = new FormData();

      // Constructing the data object as per API requirements
      const teacherData = {
        // course_ids: selectedCourses,
        // batch_ids: selectedBatch,
        course_ids: null,
        batch_ids: null,
        teacher_name: clientName || null,
        email: formDetails.email || null,
        phone: formDetails.phone || null,
        about: formDetails.about || null,
        password: formDetails.password || null,
        dob: formDetails.dob || null,
        state_id: selectedStateId || null,
        district_id: selectedDistrictId || null,
        address: formDetails.address || null,
        pincode: formDetails.pincode || null,
        facebook_link: formDetails.facebook_link || null,
        instagram_link: formDetails.instagram_link || null,
        linkedin_link: formDetails.linkedin_link || null,
        educations: educationRows.map((row) => ({
          degree: row.degree || null,
          college_name: row.education_collage_or_school_name || null,
          univercity_name: row.board_or_university_name || null,
          started_at: row.started_at || null,
          ended_at: row.ended_at || null,
          percentage: row.percentage.toString() || null,
        })),
        experience: experienceRows.map((row) => ({
          role_and_responsibility: row.role_and_responsibility || null,
          college_name:
            row.experience_collage_or_school_or_university_name || null,
          univercity_name:
            row.experience_collage_or_school_or_university_name || null,
          joining_date: row.joining_date || null,
          leaving_date: row.leaving_date || null,
          total_months: row.total_months.toString() || null,
        })),
      };

      formData.append("teacher", JSON.stringify(teacherData));

      console.log("teacherData", teacherData);

      formData.append("file", thumbnailImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if the response status code indicates success
      if (response.status === 200) {
        toast.success("Teacher created successfully!");
        setTimeout(() => {
          navigate("/admin/teacher");
        }, 2000);
      } else {
        // If the response status code is not successful, display the error message
        toast.error(
          `Error: ${response.data.message || "Teacher could not be created."}`
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Displaying the error message from the API response, if available
      toast.error(
        `Error: ${
          error.response?.data?.message || "Teacher could not be created."
        }`
      );
    }
  };

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
            <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Teacher Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Teacher Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="Enter Teacher Name"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => handleEmailChange(e.target.value)}
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
                {EmailError && (
                  <Typography color="error" className={classes.errorMessage}>
                    Please enter a valid email address
                  </Typography>
                )}
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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

              {/* <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cources <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  multiple
                  open={isCourseDropdownOpen}
                  onOpen={handleCourseDropdownOpen}
                  onClose={handleCourseDropdownClose}
                  value={selectedCourses}
                  onChange={handleCourseChange}
                  displayEmpty
                  variant="outlined"
                  inputProps={{ name: "courses", id: "courses-select" }}
                  MenuProps={menuProps}
                >
                  {selectedCourses.length === 0 && (
                    <MenuItem disabled value="">
                      <em>Select Course</em>
                    </MenuItem>
                  )}
                  {cources?.map((data, index) => (
                    <MenuItem key={index} value={data.id}>
                      {data.course_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Batches <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  multiple
                  open={isBatchDropdownOpen}
                  onOpen={handleBatchDropdownOpen}
                  onClose={handleBatchDropdownClose}
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  displayEmpty
                  variant="outlined"
                  inputProps={{ name: "batches", id: "batches-select" }}
                  MenuProps={menuProps}
                >
                  {selectedBatch.length === 0 && (
                    <MenuItem disabled value="">
                      <em>Select Batch</em>
                    </MenuItem>
                  )}
                  {batches?.map((data, index) => (
                    <MenuItem key={index} value={data.id}>
                      {data.batch_name}
                    </MenuItem>
                  ))}
                </Select>
              </div> */}
            </div>

            {educationRows.map((row, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                )}
                <div>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    >
                      {index === 0 && <div>Education Details</div>}
                    </Typography>
                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Degree Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        value={row.degree}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        // label="Degree Name"
                        placeholder="Enter Degree Name"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        School/Collage Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        value={row.education_collage_or_school_name}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "education_collage_or_school_name",
                            e.target.value
                          )
                        }
                        // label="School/Collage Name"
                        placeholder="Enter School/Collage Name"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Board/University Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        value={row.board_or_university_name}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "board_or_university_name",
                            e.target.value
                          )
                        }
                        // label="Board/University Name"
                        placeholder="Enter Board Name"
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Started at{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="date"
                        variant="outlined"
                        required
                        value={row.started_at}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "started_at",
                            e.target.value
                          )
                        }
                        // label="Started At"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Completed at{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="date"
                        variant="outlined"
                        required
                        value={row.ended_at}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "ended_at",
                            e.target.value
                          )
                        }
                        // label="Completed At"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Percentage{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        type="number"
                        variant="outlined"
                        required
                        value={row.percentage}
                        onChange={(e) =>
                          handleEducationRowChange(
                            index,
                            "percentage",
                            e.target.value
                          )
                        }
                        placeholder="Enter %"
                        error={percentageError}
                        helperText={
                          percentageError ? percentageErrorMessage : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography>%</Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                    {/* Add and Remove Buttons */}
                  </div>
                </div>
              </React.Fragment>
            ))}
            {educationRows.length && (
              <AddMoreAndRemoveButton
                handleAdd={handleAddRow}
                handleRemove={handleRemoveEducationRow}
                data={educationRows}
              />
            )}

            {experienceRows.map((row, index) => (
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
                      {index === 0 && <div>Experience Details</div>}
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Name of School/Collage
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        value={
                          row.experience_collage_or_school_or_university_name
                        }
                        onChange={(e) =>
                          handleExperienceRowChange(
                            index,
                            "experience_collage_or_school_or_university_name",
                            e.target.value
                          )
                        }
                        // label="School/Collage/University Name"
                        placeholder="Enter Name of School/Collage/University"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Designation
                      </FormLabel>
                      <TextField
                        type="text"
                        variant="outlined"
                        required
                        value={row.role_and_responsibility}
                        onChange={(e) =>
                          handleExperienceRowChange(
                            index,
                            "role_and_responsibility",
                            e.target.value
                          )
                        }
                        // label="Roles and Responsibilities"
                        placeholder="Enter Designation"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Joining Date
                      </FormLabel>
                      <TextField
                        type="date"
                        variant="outlined"
                        value={row.joining_date}
                        onChange={(e) =>
                          handleExperienceRowChange(
                            index,
                            "joining_date",
                            e.target.value
                          )
                        }
                        InputProps={{
                          inputProps: { max: maxJoiningDate },
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
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Leaving Date
                      </FormLabel>
                      <TextField
                        type="date"
                        value={row.leaving_date}
                        variant="outlined"
                        onChange={(e) =>
                          handleExperienceRowChange(
                            index,
                            "leaving_date",
                            e.target.value
                          )
                        }
                        InputProps={{
                          inputProps: { min: minLeavingDate },
                        }}
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Total Months
                      </FormLabel>
                      <TextField
                        type="number"
                        variant="outlined"
                        required
                        disabled
                        value={row.total_months}
                        onChange={(e) =>
                          handleExperienceRowChange(
                            index,
                            "total_months",
                            e.target.value
                          )
                        }
                        // label="Total Months"
                        placeholder="00"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
                    ></div>
                  </div>
                </>
              </React.Fragment>
            ))}
            {experienceRows.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddExpRow}
                  handleRemove={handleRemoveExperienceRow}
                  data={experienceRows}
                />
              </div>
            )}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Date Of Birth
                </FormLabel>
                <TextField
                  type="date"
                  variant="outlined"
                  placeholder="01/01/1995"
                  value={formDetails.dob}
                  onChange={(e) => handleFormChange("dob", e.target.value)}
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
                  Create Password{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
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
                          // aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
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
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex}  ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div className={` ${classes.w49}`}>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    About
                  </FormLabel>
                  <TextField
                    type="text"
                    variant="outlined"
                    required
                    value={formDetails.about}
                    onChange={(e) => handleFormChange("about", e.target.value)}
                    placeholder="Type Here"
                    multiline
                    rows={7}
                  />
                </div>
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w74}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  value={formDetails.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="Enter Address"
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
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  State
                </FormLabel>
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
                {/* <Select
                  // labelId="category-label"
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
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  District
                </FormLabel>
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
                {/* <Select
                  // labelId="category-label"
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
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
export default AddTeacherForm;
