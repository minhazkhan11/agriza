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
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AlreadyPopUp from "./AlreadyPopUp";

const initialData = {
  is_Business: "",
};

function AddVendorForm() {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const decryptedEntityDetails = JSON.parse(
    sessionStorage?.getItem("entityDetails") || "{}"
  );

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formDetails, setFormDetails] = useState(initialData);
  const [state, setState] = useState();

  const [isBusiness, setIsBusiness] = useState("registered");
  const [open, setOpen] = useState();

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handlePopUp = () => {
    setOpen(!open);
  };

  const classes = useStyles();

  const data = {
    be_information: {
      pan_number: name,
    },
  };

  const handleCheck = () => {
    const gstRegex = /^[a-zA-Z0-9]{15}$/;
    const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;
    if (!name.trim()) {
      toast.warn("Please enter PAN Number.");

      return;
    }
    if (!panRegex.test(name)) {
      toast.warn("PAN Number must be in a valid format (e.g., ABCDE1234F).");
      return;
    }

    const data = {
      be_information: {
        pan_number: name,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_vendor/gstpan`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const localState = response.data;
        response.data.message === "Business Entity Already Registered"
          ? handlePopUp()
          : navigate("/create-vendor-more", { state: data });
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.bgwhite} ${classes.inputborder} ${classes.pagescroll} ${classes.h76}`}
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
                {" "}
                Basic Information
              </Typography>

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
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    value={name}
                    type="text"
                    inputProps={{
                      maxLength: 10,
                    }}
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

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
          </div>
        </FormControl>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={open}
          onClose={handlePopUp}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AlreadyPopUp handlePopUp={handlePopUp} data={data} open={open} />
        </Modal>
      </div>
    </>
  );
}
export default AddVendorForm;
