import React, { useState } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
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
import CloseIcon from "@material-ui/icons/Close";

function AlreadyPopUp({ handlePopUp, data }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const handleCheck = () => {
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
        const localState = response.data;
        navigate("/edit-business-entity", { state: localState });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1}  ${classes.w35} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
  
        <FormControl className={`${classes.w100} ${classes.positionrelative}`}>
          <div
            className={`${classes.bgwhite} ${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <Typography
              variant="h3"
              className={`${classes.mt1} ${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.dflex} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Business Entity Already Registered
            </Typography>
            <Typography
              variant="h3"
              className={`${classes.mt1} ${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Are You want to Edit
            </Typography>
            <div
              className={`${classes.mt1} ${classes.dflex} ${classes.justifyflexend}`}
            >
              <Button
                onClick={handlePopUp}
                className={`${classes.ml1} ${classes.custombtnoutline}`}
              >
                No
              </Button>

              <Button
                className={`${classes.ml1} ${classes.custombtnblue}`}
                onClick={handleCheck}
              >
                Yes
              </Button>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default AlreadyPopUp;
