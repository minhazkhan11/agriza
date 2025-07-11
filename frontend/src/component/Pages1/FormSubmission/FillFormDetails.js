import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
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
import { useNavigate, useParams } from "react-router-dom";

function FillFormDetails() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { formId } = useParams();

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
    name: "",
    email: "",
    phone: "",

    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);

  const [fetchedFormData, setFetchedFormData] = useState([]);

  const [answers, setAnswers] = useState({});

  const fetchFormData = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/forms/${formId}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const data = response.data?.form;
        setFetchedFormData(data);
      } else {
        console.log("data not found");
      }
    } catch (error) {
      console.error("Error fetching Form data API:", error);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, [formId]);

  const handleFormChange = (fieldName, value) => {
    if (fieldName === "phone") {
      if (/^[0-5]/.test(value)) {
        toast.warn("Phone number should start from 6, 7, 8, or 9");
        return;
      }

      if (value.length > 10) {
        return;
      }
    }
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleAnswerChange = async (index, value, type) => {
    if (type === "file") {
      const fileLink = await getFileUpload(value);
      setAnswers({ ...answers, [index]: fileLink });
    } else {
      setAnswers({ ...answers, [index]: value });
    }
  };
  const handleCheckboxChange = (fieldId, optionId, checked) => {
    const field = fetchedFormData.fields.find((field) => field.id === fieldId); // Find the field object
    const optionName = field.options.find(
      (option) => option.id === optionId
    )?.option; // Find the option name
    const fieldValue = checked ? optionName : ""; // Set to optionName if checked, otherwise empty string
    setAnswers({
      ...answers,
      [fieldId]: { ...answers[fieldId], [optionId]: fieldValue },
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Regular expression to match Indian phone numbers starting with 6, 7, 8, or 9
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for basic email format validation
    return emailRegex.test(email);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const renderFormField = (field, index) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            key={index}
            type="text"
            value={answers[field.id] || ""}
            onChange={(event) =>
              handleAnswerChange(field.id, event.target.value)
            }
            placeholder="Enter Your Answer"
            variant="outlined"
            className={classes.w40}
          />
        );
      case "checkbox":
        return (
          <FormControl component="fieldset" key={index}>
            {field.options.map((option, optionIndex) => (
              <FormControlLabel
                key={optionIndex}
                control={
                  <Checkbox
                    checked={Boolean(
                      answers[field.id] && answers[field.id][option.id]
                    )}
                    onChange={(event) =>
                      handleCheckboxChange(
                        field.id,
                        option.id,
                        event.target.checked
                      )
                    }
                    color="primary"
                  />
                }
                label={option.option}
              />
            ))}
          </FormControl>
        );
      case "radio":
        return (
          <FormControl component="fieldset" key={index}>
            <RadioGroup
              row
              value={answers[field.id] || ""}
              onChange={(event) =>
                handleAnswerChange(field.id, event.target.value)
              }
            >
              {field.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={option.option}
                  control={<Radio />}
                  label={option.option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "textarea":
        return (
          <TextField
            key={index}
            value={answers[field.id] || ""}
            onChange={(event) =>
              handleAnswerChange(field.id, event.target.value)
            }
            minRows={4}
            multiline
            className={classes.w50}
            placeholder="Enter Your Answer"
            variant="outlined"
          />
        );
      case "date":
        return (
          <TextField
            key={index}
            type="date"
            value={answers[field.id] || ""}
            onChange={(event) =>
              handleAnswerChange(field.id, event.target.value)
            }
            variant="outlined"
            className={classes.w40}
          />
        );
      case "file":
        return (
          <input
            key={index}
            type="file"
            onChange={(event) =>
              handleAnswerChange(field.id, event.target.files[0], field.type)
            }
          />
        );
      // Handle other field types similarly
      default:
        return null;
    }
  };

  const getFileUpload = async (file) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/upload/file`;
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(apiUrl, formData);

      if (response.status === 200) {
        const data = response.data?.file_url;
        return data;
      } else {
        console.log("data not found");
      }
    } catch (error) {
      console.error("Error fetching Form data API:", error);
    }
  };

  const handleFormSubmit = async () => {
    let error = false;
    if (!formDetails.name) {
      toast.warn("Please Enter Your Name");
      return;
    }

    if (!formDetails.phone) {
      toast.warn("Please Enter Your Phone");
      return;
    }

    if (!validatePhoneNumber(formDetails.phone)) {
      toast.warn(
        "Please enter a valid phone number starting with 6, 7, 8, or 9"
      );
      return;
    }

    if (!formDetails.email) {
      toast.warn("Please Enter Your Email");
      return;
    }

    if (!validateEmail(formDetails.email)) {
      toast.warn("Please enter a valid email address");
      return;
    }

    fetchedFormData.fields.forEach((field, i) => {
      if (field.required && !answers[field.id]) {
        toast.warn(`Question No. ${i + 1} is required`);
        error = true;
      }
      return;
    });

    if (error) {
      return;
    }

    try {
      const responseFields = fetchedFormData.fields.map((field) => {
        let responseValue = answers[field.id];

        // If it's a checkbox field and response value is an object, convert it to comma-separated string
        if (field.type === "checkbox" && typeof responseValue === "object") {
      
          const selectedOptions = Object.values(responseValue).filter(Boolean);

          responseValue = selectedOptions.length > 0 ? selectedOptions.join(", ") : "";
        }
        return {
          id: field.id,
          response: responseValue || "",
        };
      });

      const responseUser = {
        name: formDetails.name,
        mobile: formDetails.phone,
        email: formDetails.email,
      };

      const formData = {
        response: {
          fields: responseFields,
          user: responseUser,
        },
      };
      console.log("API Response:", formData);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/forms/response/add`,
        formData
      );

      // toast.success("Form submitted successfully!");
      toast.success(response?.data?.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      console.log("API Response:", response);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.h80vh}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.pagescroll} ${classes.h77vh} ${classes.quillcontainer} ${classes.py2} ${classes.px1_5}`}
          >
            <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
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
                  value={formDetails.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
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
                  Phone No. <span className={`${classes.textcolorred}`}>*</span>
                </FormLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  required
                  value={formDetails.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  placeholder="Type Here"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w32}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Email <span className={classes.textcolorred}>*</span>
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
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div>
              {fetchedFormData?.fields?.map((field, index) => (
                <div
                  key={index}
                  className={`${classes.mt2} ${classes.formquestion}`}
                >
                  {field.required && (
                    <span
                      className={`${classes.textcolorred} ${classes.fontsize1}`}
                    >
                      Required*
                    </span>
                  )}
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter} `}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize6} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Question {index + 1} :-
                    </FormLabel>
                    <div
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight} ${classes.ml0_5}`}
                      dangerouslySetInnerHTML={{ __html: field.label }}
                    />
                  </div>
                  {/* Render input based on field type */}
                  {renderFormField(field, index)}
                </div>
              ))}
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
export default FillFormDetails;
