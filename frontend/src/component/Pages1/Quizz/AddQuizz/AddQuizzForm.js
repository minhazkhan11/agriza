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
import UploadButtons from "../../../CustomComponent/UploadButton";
import useStyles from "../../../../styles";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddQuizzForm() {
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
    about: "",
    password: "",
    state: "",
    district: "",
    address: "",
    language: ["en"],

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [clientName, setClientName] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const fetchDistricts = async (selectedState) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/state/${selectedState}`,
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
    fetchDistricts(selectedState);
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };
  
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(!languageMenuOpen);
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
    navigate("/admin/quizz");
  };

  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);

  const handleThumbnailImageChange = (image) => {
    setThumbnailImage(image);
  };

  const handleFormSubmit = async () => {

    if (!clientName.trim()) {
      toast.warn("Please enter a teacher name.");
      return;
    }
  
    if (!formDetails?.email?.trim()) {
      toast.warn("Please enter an email.");
      return;
    }
  
    if (!formDetails?.phone?.trim()) {
      toast.warn("Please enter a phone number.");
      return;
    }
  
    if (!formDetails?.password?.trim()) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const formData = new FormData();

      const teacherData = {
        teacher_name: clientName,
        email: formDetails.email,
        phone: formDetails.phone,
        about: formDetails.about,
        password: formDetails.password,
        state: selectedState,
        district: selectedDistrict,
        address: formDetails.address,
      };

      formData.append("teacher", JSON.stringify(teacherData));

      // console.log("teacherData", teacherData);

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

      if (response.status === 200) {
        toast.success("Teacher created successfully!");
        setTimeout(() => {
          navigate("/admin/coaching");
        }, 2000);
      } else {
        toast.error(`Teacher is not created! ${response.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Teacher is not created!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.h72vh}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Quizz Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Quiz Name *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  // value={clientName}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Code *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  value={formDetails.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="Type Here"
                />
              </div>
              
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={` ${classes.textcolorformhead} ${classes.w24} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
             <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Course *
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {states &&
                    states.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.name}
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
                  Batch *
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {states &&
                    states.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.name}
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
                  Subject *
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {states &&
                    states.map((st) => (
                      <MenuItem key={st.id} value={st.id}>
                        {st.name}
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
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Languages *
                </FormLabel>
                <Select
                  labelId="language-label"
                  id="language"
                  multiple
                  open={languageMenuOpen}
                  onOpen={handleLanguageMenuToggle}
                  onClose={handleLanguageMenuToggle}
                  value={formDetails.language}
                  onChange={(e) => {
                    handleFormChange("language", e.target.value);
                    handleLanguageMenuToggle(); // Close the dropdown after selection
                  }}
                  renderValue={(selected) =>
                    selected
                      .map((code) => (code === "en" ? "English" : "Hindi"))
                      .join(", ")
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Duration *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  // value={clientName}
                  placeholder="Type Here"
                 
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  No. of Questions *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  // value={clientName}
                  placeholder="Type Here"
                 
                />
              </div>
            </div>
            
            <div
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt2}`}
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
                  Description
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
          </div>
          
          <div className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}>
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
              Save & Continue
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddQuizzForm;
