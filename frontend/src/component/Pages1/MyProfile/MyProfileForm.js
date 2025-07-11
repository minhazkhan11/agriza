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
import { ReactComponent as NameIcon } from "../../images/learnersimage/nameicon.svg";
import { ReactComponent as PhoneIcon } from "../../images/learnersimage/phoneicon.svg";
import { ReactComponent as EmailIcon } from "../../images/learnersimage/emailicon.svg";
import UploadButtons from "../../CustomComponent/UploadButton";
import useStyles from "../../../styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { decryptData } from "../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImageComponent from "./ImageComponent";
import { Autocomplete } from "@mui/material";

function MyProfileForm({ fetchDataFromAPI }) {
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
    full_name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    address: "",
    pincode: "",
    file: null,
    accountHoldName: "",
    branchName: "",
    accountNo: "",
    ifsc: "",
    panNo: "",
    Gst: "",
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const [clientName, setClientName] = useState("");

  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedGstFile, setSelectedGstFile] = useState();
  const [selectedPanFile, setSelectedPanFile] = useState();
  const [selectedAadharFile, setSelectedAadharFile] = useState();
  const [selectedMomFile, setSelectedMomFile] = useState();
  const [selectedCancelChequeFile, setSelectedCancelChequeFile] = useState();

  const [selectedGSTFile, setSelectedGSTFile] = useState(null);
  const [selectedPANFile, setSelectedPANFile] = useState(null);
  const [selectedAadharCardFile, setSelectedAadharCardFile] = useState(null);
  const [selectedCancelCheckFile, setSelectedCancelCheckFile] = useState(null);
  const [aadharCardPreview, setAadharCardPreview] = useState(null);
  const gstInputRef = React.createRef();
  const panInputRef = React.createRef();
  const aadharInputRef = React.createRef();
  const cancelCheckInputRef = React.createRef();
  const momcancelref = React.createRef();
  const handleFilesssChange = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        switch (fieldName) {
          case "GST":
            setSelectedGSTFile(file);
            break;
          case "PAN":
            setSelectedPANFile(file);
            break;
          case "AADHAR":
            setSelectedAadharCardFile(file);
            break;
          case "CANCELCHECK":
            setSelectedCancelCheckFile(file);
            break;
          case "MOM":
            setSelectedMomFile(file);
            break;
          default:
            break;
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDocumentInputClick = (fieldName) => {
    switch (fieldName) {
      case "GST":
        gstInputRef.current.click();
        break;
      case "PAN":
        panInputRef.current.click();
        break;
      case "AADHAR":
        aadharInputRef.current.click();
        break;
      case "CANCELCHECK":
        cancelCheckInputRef.current.click();
        break;
      case "MOM":
        momcancelref.current.click();
        break;
      default:
        break;
    }
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
        setStates(data?.states);
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

  const handleStateChange = (event, value) => {
    setSelectedState(value.id);
    setSelectedStateId(value);
  };
   console.log(selectedStateId,"idididid")
  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value.id);
    setSelectedDistrictId(value);
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };
  console.log(selectedAadharFile, "profileData");

  const handleFormSubmit = async () => {
   if(!clientName){
    toast.warn("Please Fill Name.");
    return;
   }
   if(!formDetails.email){
    toast.warn("Please Fill Email.");
    return;
   }
   if(!formDetails.phone){
    toast.warn("Please Enter Your Mobile Number.");
    return;
   }
   if(!formDetails.address){
    toast.warn("Please Enter Your Address.");
    return;
   }
   if(!selectedStateId){
    toast.warn("Please Choose Your State.");
    return;
   }
   if(!selectedDistrictId){
    toast.warn("Please Choose Your District.");
    return;
   }
   if(!formDetails.pincode){
    toast.warn("Please Enter Your Pincode.");
    return;
   }
  
    try {
      const formData = new FormData();
      const profileData = {
        full_name: clientName,
        email: formDetails.email,
        phone: formDetails.phone,
        state: selectedStateId.id,
        district: selectedDistrictId.id,
        address: formDetails.address,
        pincode: formDetails.pincode,
        account_holder_name: formDetails.accountHoldName,
        branch_name: formDetails.branchName,
        bank_account_no: formDetails.accountNo,
        ifsc_code: formDetails.ifsc,
        pan_no: formDetails.panNo,
        gst_no: formDetails.Gst,
        about: formDetails.about,
      };

      formData.append("user", JSON.stringify(profileData));

      formData.append("gst", selectedGSTFile);
      formData.append("pan", selectedPANFile);
      formData.append("aadhar", selectedAadharCardFile);
      formData.append("cheque", selectedCancelCheckFile);
      formData.append("mom", selectedMomFile);
      console.log(formData, "profileData");

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          fetchData();
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        const errorMessage = response.data?.message || "Update failed!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    }
  };
  

  const fetchData = async () => {
    // const response = await fetchDataFromAPI(decryptedToken);
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/profile`,
     
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      }
    );

    
    if (response.data) {
      console.log(selectedDistrict,"datadata")
      const userData = response.data.user;
      const userInfo = userData.user_information;

     
      setClientName(userInfo.contact_person_name || "");
      setFormDetails({
        ...formDetails,
        email: userData.email || "",
        phone: userData.phone || "",
        address: userInfo.address || "",
        about: userInfo.about || "",
        pincode: userInfo.pincode || "",
        accountHoldName: userInfo.account_holder_name || "",
        branchName: userInfo.branch_name || "",
        accountNo: userInfo.bank_account_no || "",
        ifsc: userInfo.ifsc_code || "",
        panNo: userInfo.pan_no || "",
        Gst: userInfo.gst_no || "",
      });
    
      setSelectedStateId(userInfo.state || "");
      setSelectedDistrictId(userInfo.district ||""
      )
      setSelectedGSTFile(userInfo?.gst_image_url);
      setSelectedMomFile(userInfo?.mom_image_url);
      setSelectedAadharCardFile(userInfo?.aadhar_image_url);
      console.log(userInfo?.pan_image_url, "datadata");
      setSelectedPANFile(userInfo?.pan_image_url);
      setSelectedCancelCheckFile(userInfo?.cheque_image_url);
    } else {
      console.log("Data not found");
    }
  };

  useEffect(() => {
    fetchData();
  }, [decryptedToken]);
  const renderMediaContent = (fileFormat, contentUrl) => {
    console.log(contentUrl, "contentUrl");
    if (contentUrl && contentUrl.length > 0) {
      const newWindow = window.open(contentUrl, "_blank");
      if (newWindow && newWindow.length) {
        newWindow.focus();
      } else {
        console.error("Failed to open PDF in a new window.");
      }
    } else {
      console.error("Content URL is undefined or empty.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh75}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween}  ${classes.alignitemscenter}`}
            >
              <ImageComponent fetchDataFromAPI={fetchDataFromAPI} />

              <div className={classes.w75}>
                <div
                  className={`${classes.dflex} ${classes.w100} ${classes.justifyspacebetween}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Name <span className={classes.textcolorred}>*</span>
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
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Email Address{" "}
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      disabled
                      type="text"
                      variant="outlined"
                      required
                      value={formDetails.email}
                      onChange={(e) =>
                        handleFormChange("email", e.target.value)
                      }
                      placeholder="Type Here"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Mobile No. <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      disabled
                      type="text"
                      variant="outlined"
                      required
                      value={formDetails.phone}
                      onChange={(e) =>
                        handleFormChange("phone", e.target.value)
                      }
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
                  <div
                    className={`${classes.dflex} ${classes.w100} ${classes.flexdirectioncolumn}`}
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
                      placeholder="Type Here"
                      value={formDetails.about}
                      multiline
                      minRows={3}
                      onChange={(e) =>
                        handleFormChange("about", e.target.value)
                      }
                    />
                  </div>
                </div>
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
                className={`${classes.dflex}  ${classes.w75} ${classes.flexdirectioncolumn}  `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Address <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  multiline
                  minRows={3}
                  placeholder="Type Here"
                  value={formDetails.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
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
                  State <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                id="state-autocomplete"
                options={states || []}
                value={selectedStateId}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleStateChange}
                disableClearable
                getOptionLabel={(option) => option?.name || ""}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Here"
                    variant="outlined"
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
                  District <span className={classes.textcolorred}>*</span>
                </FormLabel>
               
                <Autocomplete
                id="state-autocomplete"
                options={districts || []}
                value={selectedDistrictId}
                classes={{ inputRoot: classes.inputRoot }}
                onChange={handleDistrictChange}
                disableClearable
                getOptionLabel={(option) => option?.name || ""}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Here"
                    variant="outlined"
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
                  Pincode <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  onChange={(e) => handleFormChange("pincode", e.target.value)}
                  value={formDetails.pincode}
                  placeholder="Type Here"
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt2}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Account Details
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Account Holder Name
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    handleFormChange("accountHoldName", e.target.value)
                  }
                  value={formDetails.accountHoldName}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Branch Name
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    handleFormChange("branchName", e.target.value)
                  }
                  value={formDetails.branchName}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Account No.
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  onChange={(e) =>
                    handleFormChange("accountNo", e.target.value)
                  }
                  value={formDetails.accountNo}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  IFSC Code
                </FormLabel>
                <TextField
                  type="text"
                  variant="outlined"
                  required
                  onChange={(e) => handleFormChange("ifsc", e.target.value)}
                  value={formDetails.ifsc}
                  placeholder="Type Here"
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt2}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Business Info
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  PAN No.
                </FormLabel>
                <TextField
                  // type="number"
                  variant="outlined"
                  required
                  onChange={(e) => handleFormChange("panNo", e.target.value)}
                  value={formDetails.panNo}
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST No.
                </FormLabel>
                <TextField
                  // type="number"
                  variant="outlined"
                  required
                  onChange={(e) => handleFormChange("Gst", e.target.value)}
                  value={formDetails.Gst}
                  placeholder="Type Here"
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt2}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Documents Info
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w37} ${classes.fileinput}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST
                </FormLabel>
                <input
                  type="file"
                  // accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  ref={gstInputRef} 
                  onChange={(e) => handleFilesssChange("GST", e)}
                />
                <Button
                  onClick={() => renderMediaContent("jpg", selectedGSTFile)}
                  className={classes.bluebtn}
                  variant="contained"
                  fullWidth
                >
                  Show
                </Button>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.fileinput} ${classes.w37}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  PAN
                </FormLabel>
                <input
                  type="file"
                  // accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  ref={panInputRef} // Assign the ref to the GST file input
                  onChange={(e) => handleFilesssChange("PAN", e)}
                />
                <Button
                  onClick={() => renderMediaContent("jpeg", selectedPANFile)}
                  className={classes.bluebtn}
                  variant="contained"
                  fullWidth
                >
                  Show
                </Button>
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt2}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5} ${classes.fileinput}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Aadhar Card
                </FormLabel>
                <input
    type="file"
    // accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ref={aadharInputRef} // Assign the ref to the GST file input
    onChange={(e) => handleFilesssChange("AADHAR", e)}
    
/>

                <Button
                  onClick={() =>
                    renderMediaContent("link", selectedAadharCardFile)
                  }
                  className={classes.bluebtn}
                  variant="contained"
                  fullWidth
                >
                  Show
                </Button>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5} ${classes.fileinput}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  MOM Upload
                </FormLabel>
                <input
                  type="file"
                  // accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  ref={momcancelref}
                  onChange={(e) => handleFilesssChange("MOM", e)}
                />
                <Button
                  onClick={() => renderMediaContent("image", selectedMomFile)}
                  className={classes.bluebtn}
                  variant="contained"
                  fullWidth
                >
                  Show
                </Button>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24_5} ${classes.fileinput}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Cancel Cheque
                </FormLabel>
                <input
                  type="file"
                  // accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  // value={selectedCancelCheckFile}
                  ref={cancelCheckInputRef}
                  onChange={(e) => handleFilesssChange("CANCELCHECK", e)}
                />

                <Button
                  onClick={() =>
                    renderMediaContent("jpg", selectedCancelCheckFile)
                  }
                  className={classes.bluebtn}
                  variant="contained"
                  fullWidth
                >
                  Show
                </Button>
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
export default MyProfileForm;
