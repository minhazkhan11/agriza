import React, { useState, useEffect } from "react";
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

function SmsSetting() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const initial = {
    userName: "",
    password: "",
    senderId: "",
    clientSmsId: "",
    entityId: "",
    tempId: "", 
  };
  const [formDetails, setFormDetails] = useState(initial);
  const handleClose = () => {
    navigate("/admin/dashboard");
  };
  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/sms`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.sms;
        
        const initialData = {
          userName: data?.username,
          password: data?.password,
          senderId: data?.sender_id,
          clientSmsId: data?.client_sms_id,
          entityId: data?.entity_id,
          tempId: data?.temp_id,
        };
        setFormDetails(initialData);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleFormSubmit = () => {
    if (!formDetails.userName) {
      toast.warn("Please enter Username.");
      return;
    }

    if (!formDetails.password) {
      toast.warn("Please enter Password.");
      return;
    }
    if (!formDetails.senderId) {
      toast.warn("Please enter Sender Id.");
      return;
    }
    if (!formDetails.clientSmsId) {
      toast.warn("Please enter Client Sms Id.");
      return;
    }
    if (!formDetails.entityId) {
      toast.warn("Please enter Entity Id.");
      return;
    }
    if (!formDetails.tempId) {
      toast.warn("Please enter Temp Id.");
      return;
    }

    const data = {
      config: {
        username: formDetails.userName,
        password: formDetails.password,
        sender_id: formDetails.senderId,
        client_sms_id: formDetails.clientSmsId,
        entity_id: formDetails.entityId,
        temp_id: formDetails.tempId
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/sms/config`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        toast.success("SMS Settings Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to update SMS Settings");
      });
  };
  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
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
                Dove Soft
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Username <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  value={formDetails.userName}
                  onChange={(e) => handleFormChange("userName", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Password <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  value={formDetails.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Sender Id <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) => handleFormChange("senderId", e.target.value)}
                  value={formDetails.senderId}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Client Sms Id <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) => handleFormChange("clientSmsId", e.target.value)}
                  value={formDetails.clientSmsId}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Entity Id <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) => handleFormChange("entityId", e.target.value)}
                  value={formDetails.entityId}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w36_6}`}
              >
                {/* <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Temp Id <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <TextField
                  onChange={(e) => handleFormChange("tempId", e.target.value)}
                  value={formDetails.tempId}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                /> */}
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              className={`${classes.custombtnoutline}`}
              onClick={handleClose}
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
      </div>
    </>
  );
}
export default SmsSetting;
