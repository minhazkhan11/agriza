import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
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

function CreateSmsTemplate({ handleChange }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const CHARACTER_LIMIT = 160;

  const initialData = {
    name: "",
    message: "",
  };
  const [formDetails, setFormDetails] = useState(initialData);

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = () => {
    if (!formDetails.name) {
      toast.warn("Please enter Name.");
      return;
    }

    if (!formDetails.message) {
      toast.warn("Please enter Message.");
      return;
    }

    const data = {
      template: {
        name: formDetails.name,
        message: formDetails.message,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatesms/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTimeout((e) => {
          handleChange(e, 0);
        }, 2000);
        toast.success("Sms Template Created Successfully");
      })
      .catch((error) => {
        toast.error("Failed to Create Sms Template");
      });
  };

  return (
    <>
      <ToastContainer />

      <FormControl className={`${classes.w100}`}>
        <div className={`${classes.py2} ${classes.px1_5}`}>
          <Typography className={`${classes.fw600}`}>
            Create Sms Template
          </Typography>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6} ${classes.mt1}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Name <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <TextField
              value={formDetails.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              type="text"
              variant="outlined"
              required
              placeholder="Type Here"
            />
          </div>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w75} ${classes.mt1}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                 ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Message <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <TextField
              className={`${classes.helpertext}`}
              value={formDetails.message}
              onChange={(e) => handleFormChange("message", e.target.value)}
              type="text"
              variant="outlined"
              required
              inputProps={{
                maxlength: CHARACTER_LIMIT,
              }}
              helperText={`${formDetails.message.length}/${CHARACTER_LIMIT}`}
              placeholder="Type Here"
              multiline
              rows={6}
            />
          </div>
        </div>

        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            className={`${classes.custombtnoutline}`}
            onClick={(e) => handleChange(e, 0)}
          >
            Cancel
          </Button>
          <Button
            className={`${classes.custombtnblue}`}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </FormControl>
    </>
  );
}
export default CreateSmsTemplate;
