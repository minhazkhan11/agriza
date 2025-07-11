import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
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

function AddGstForm({ style }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gstRate, SetGSTRate] = useState("");
  const [textBlityType, setTextBlityType] = useState([
    "Exempt",
    "Nil Rated",
    "Non GST",
    "GST Rate",
  ]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const [selectedTextBlityType, setSelectedTextBlityType] = useState("");

  const classes = useStyles();

  const handleClose = () => {
    style?.isPopUp ? style?.onClose() : navigate("/gst-list");
  };

  const handleFormSubmit = () => {
    // const gstRegex = /^\d{6}$/;
    if (!name.trim()) {
      toast.warn("Please Enter GST .");
      return;
    }
    // if (!gstRegex.test(gstRate)) {
    //   toast.warn("Only numbers are allowed and it must be exactly 6 digits.");
    //   return;
    // }
    const data = {
      gst_percent: {
        gst_name: name,
        gst_percent: gstRate || 0,
        taxablity_type: selectedTextBlityType,
        description: description,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/gst_percent/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("GST Created Successfully");
        setTimeout(() => {
          style?.isPopUp
          ? style?.onClose()
          : navigate("/gst-list");;
        style?.isPopUp && style?.onClose();
        style?.isPopUp && style?.fetchGst();
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
                GST Percent Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  GST Name <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Taxablity Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Select
                  labelId="category-label"
                  id="state"
                  required
                  value={selectedTextBlityType || ""}
                  onChange={(e) => setSelectedTextBlityType(e.target.value)}
                  displayEmpty
                  className={classes.selectEmpty}
                  MenuProps={menuProps}
                  variant="outlined"
                >
                  <MenuItem disabled value="">
                    <em className={classes.defaultselect}>Select Here</em>
                  </MenuItem>
                  {textBlityType.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                {selectedTextBlityType === "GST Rate" && (
                  <>
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      GST Rate
                    </FormLabel>
                    <TextField
                      onChange={(e) => SetGSTRate(e.target.value)}
                      value={gstRate}
                      type="text"
                      variant="outlined"
                      required
                      placeholder="Enter Description"
                    />
                  </>
                )}
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
                  Description
                </FormLabel>
                <TextField
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Description"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w24}`}
              ></div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1} ${classes[style?.marginbottom]}`}
          >
            <Button
              onClick={handleClose}
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
export default AddGstForm;
