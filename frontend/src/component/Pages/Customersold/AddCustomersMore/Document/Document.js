import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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
const initialData = {
  is_Business: "",
};
function Document() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [zoomAPIKey, setZoomAPIKey] = useState("");
  const [zoomAPISecret, setZoomAPISecret] = useState("");
  const [formDetails, setFormDetails] = useState(initialData);
  const [isBusiness, setIsBusiness] = useState("registered");
  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoom`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.zoom;

        setZoomAPIKey(data[0]?.api_key ? data[0]?.api_key : "");
        setZoomAPISecret(data[0]?.api_secret ? data[0]?.api_secret : "");
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
    if (!zoomAPIKey) {
      toast.warn("Please enter a Zoom API Key.");
      return;
    }

    if (!zoomAPISecret) {
      toast.warn("Please enter a Zoom API Secret.");
      return;
    }

    const data = {
      config: {
        api_key: zoomAPIKey,
        api_secret: zoomAPISecret,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoom/config`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        toast.success("Zoom Account Config Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to update Zoom Account Config");
      });
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
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
                Documents
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setZoomAPIKey(e.target.value)}
                  value={zoomAPIKey}
                  name="category_name"
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Type Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
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
export default Document;
