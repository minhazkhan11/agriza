import React, { useState } from "react";
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
import useStyles from "../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialData = {
  is_Business: "",
};

function AddCustomersForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formDetails, setFormDetails] = useState(initialData);
  const [state, setState] = useState();

  const [isBusiness, setIsBusiness] = useState("registered");

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const classes = useStyles();

  const handleCheck = () => {
    if (!name.trim()) {
      toast.warn("Please enter a GST Number & PAN Number.");
      return;
    }
    // if (!description.trim()) {
    //   toast.warn("Please enter a description.");
    //   return;
    // }

    const data = {
      be_information: {
        [isBusiness === "registered" ? "gst_number" : "pan_number"]: name,
        registerd_type: isBusiness,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/gstpan`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message, "GST Created Successfully");
        const localState = response.data;
        setTimeout(() => {
          navigate("/create-customers-more", { state: localState });
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
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
                Basic Information
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Is Business
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <RadioGroup
                  className={`${classes.radiocolor}`}
                  row
                  aria-label="is Business"
                  name="is Business"
                  value={isBusiness}
                  onChange={(e) =>
                    handleFormChange("is_Business", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="registered"
                    control={
                      <Radio onClick={() => setIsBusiness("registered")} />
                    }
                    label="Registered"
                  />
                  <FormControlLabel
                    value="notregistered"
                    control={
                      <Radio onClick={() => setIsBusiness("notregistered")} />
                    }
                    label="Not Registered"
                  />
                </RadioGroup>
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              {isBusiness === "registered" ? (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    GST Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <div className={`${classes.dflex} `}>
                    <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    />
                    <Button
                      onClick={handleCheck}
                      className={`${classes.ml1} ${classes.custombtnoutline}`}
                    >
                      Get
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    PAN Number <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <div className={`${classes.dflex} `}>
                    <TextField
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Name"
                    />
                    <Button
                      onClick={handleCheck}
                      className={`${classes.ml1} ${classes.custombtnoutline}`}
                    >
                      Get
                    </Button>
                  </div>
                </div>
              )}

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AddCustomersForm;
