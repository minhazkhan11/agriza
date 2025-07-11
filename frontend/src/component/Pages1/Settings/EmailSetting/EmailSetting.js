import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmailSetting() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const initial = {
    userName: "",
    password: "",
    senderEmail: "",
    smtpHost: "",
    smtpPort: "",
    smtpEncryption: "",
    imapHost: "",
    imapPort: "",
    imapEncryption: "",
  };
  const [formDetails, setFormDetails] = useState(initial);
  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const handleFormSubmit = () => {
    if (!formDetails.userName) {
      toast.warn("Please enter Username.");
      return;
    }

    if (!formDetails.password) {
      toast.warn("Please enter Password.");
      return;
    }
    if (!formDetails.senderEmail) {
      toast.warn("Please enter Sender Email.");
      return;
    }
    if (!formDetails.smtpHost) {
      toast.warn("Please enter SMTP Host.");
      return;
    }
    if (!formDetails.smtpPort) {
      toast.warn("Please enter SMTP Port.");
      return;
    }
    if (!formDetails.smtpEncryption) {
      toast.warn("Please select SMTP Encryption.");
      return;
    }
    if (!formDetails.imapHost) {
      toast.warn("Please enter IMAP Host.");
      return;
    }
    if (!formDetails.imapPort) {
      toast.warn("Please enter IMAP Port.");
      return;
    }
    if (!formDetails.imapEncryption) {
      toast.warn("Please select IMAP Encryption.");
      return;
    }

    const data = {
      config: {
        username: formDetails.userName,
        password: formDetails.password,
        sender_email: formDetails.senderEmail,
        smtp_host: formDetails.smtpHost,
        smtp_port: formDetails.smtpPort,
        smtp_encryption: formDetails.smtpEncryption,
        imap_host: formDetails.imapHost,
        imap_port: formDetails.imapPort,
        imap_encryption: formDetails.imapEncryption,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/config`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        toast.success("Email Settings Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to update Email Settings");
      });
  };

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.mail;
        
        const initialData = {
          userName: data[0]?.username,
          password: data[0]?.password,
          senderEmail: data[0]?.sender_email,
          smtpHost: data[0]?.smtp_host,
          smtpPort: data[0]?.smtp_port,
          smtpEncryption: data[0]?.smtp_encryption,
          imapHost: data[0]?.imap_host,
          imapPort: data[0]?.imap_port,
          imapEncryption: data[0]?.imap_encryption,
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
                User Config
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
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
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Sender Email <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.senderEmail}
                  onChange={(e) =>
                    handleFormChange("senderEmail", e.target.value)
                  }
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
              >
                SMTP Config
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  SMTP Host <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.smtpHost}
                  onChange={(e) => handleFormChange("smtpHost", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  SMTP Port <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.smtpPort}
                  onChange={(e) => handleFormChange("smtpPort", e.target.value)}
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  SMTP Encryption{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="state"
                  value={formDetails.smtpEncryption}
                  onChange={(e) =>
                    handleFormChange("smtpEncryption", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Here
                  </MenuItem>
                  <MenuItem value="ssl">SSL</MenuItem>
                  <MenuItem value="tls">TLS</MenuItem>
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
                IMAP Config
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  IMAP Host <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.imapHost}
                  onChange={(e) => handleFormChange("imapHost", e.target.value)}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  IMAP Port <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={formDetails.imapPort}
                  onChange={(e) => handleFormChange("imapPort", e.target.value)}
                  type="number"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  IMAP Encryption{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>

                <Select
                  labelId="category-label"
                  id="state"
                  value={formDetails.imapEncryption}
                  onChange={(e) =>
                    handleFormChange("imapEncryption", e.target.value)
                  }
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    Select Here
                  </MenuItem>
                  <MenuItem value="ssl">SSL</MenuItem>
                  <MenuItem value="tls">TLS</MenuItem>
                </Select>
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
export default EmailSetting;
