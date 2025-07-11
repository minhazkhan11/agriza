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

function AddCoachingForm() {
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
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}`}
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
                Coaching Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Coaching Name *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="Type Here"
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
                  Email Address *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  value={formDetails.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="Type Here"
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Mobile No. *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  value={formDetails.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  placeholder="+91 4891 265 515"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
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
              >
                Other Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Coaching Website *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="www.coaching.com"
                 
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Contact Person Name *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="Type Here"
                 
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Contact Person Mobile No. *
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="+91 5697 549 674"
                 
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
                  No. Of Learners *
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                  placeholder="Type Here"
                 
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Create Password *
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
                          // onClick={handleToggleShowPassword}
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
              className={` ${classes.w100} ${classes.justifyspacebetween} ${classes.dflex} ${classes.mt1}`}
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
          </div>
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
                Address
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  State *
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
                  District *
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {districts &&
                    districts.map((dist) => (
                      <MenuItem key={dist.id} value={dist.id}>
                        {dist.name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address *
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                  value={formDetails.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                />
              </div>
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
export default AddCoachingForm;
