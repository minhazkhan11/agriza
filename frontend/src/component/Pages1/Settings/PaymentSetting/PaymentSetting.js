import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PaymentSetting() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/razorpay`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.razorpay;

        setKeyId(data[0]?.key_id ? data[0]?.key_id : "");
        setKeySecret(data[0]?.key_secret ? data[0]?.key_secret : "");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleFormSubmit = () => {
    if (!keyId) {
      toast.warn("Please enter a Key Id.");
      return;
    }

    if (!keySecret) {
      toast.warn("Please enter a Key Secret.");
      return;
    }

    const data = {
      config: {
        key_id: keyId,
        key_secret: keySecret,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/razorpay/config`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
        toast.success("Payment Config Updated Successfully");
      })
      .catch((error) => {
        toast.error("Failed to update Payment Config");
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
                Razorpay Config
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Key Id <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setKeyId(e.target.value)}
                  value={keyId}
                  name="category_name"
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
                  Key Secret <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setKeySecret(e.target.value)}
                  value={keySecret}
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
export default PaymentSetting;
