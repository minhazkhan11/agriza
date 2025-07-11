import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import useStylesCustom from "../../../../../styles";
import {
  Button,
  Fade,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../../crypto";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    width: "35%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      color: "#000",
      fontSize: "1.125rem",
    },
    "& .MuiFormLabel-root": {
      margin: "1rem 0 0.5rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },
  },
  closebtn: {
    position: "absolute",
    top: "-18px",
    right: "-18px",
    padding: "0px !important",
    backgroundColor: "#FD6E38 !important",
    height: "35px",
    minWidth: "35px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#FD6E38 !important313866",
    },
  },
  closeicon: {
    fill: "#fff",
    width: "25px",
    height: "25px",
  },
  modalheading: {
    padding: "1rem 2rem 0rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dottedhr: {
    borderTop: "1px dashed #676767",
  },
  required: {
    color: "red",
  },
  form: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    height: "30vh",
    overflow: "scroll",
    justifyContent: "center",
    alignItems: "center",
    "&::-webkit-scrollbar ": {
      display: "none",
    },
  },
  forminner: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    "&::file-selector-button": {
      display: "none",
    },
  },
  btncontainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem 0 2rem 0",
    "& .MuiButton-contained": {
      width: "55%",
    },
    "& .MuiButton-outlined": {
      width: "40%",
    },
  },
  bluebtn: {
    background: "#FD6E38 !important",
    color: "#FFFFFF",
    fontSize: "0.875rem",
  },
  outlinebtn: {
    borderColor: "#676767",
    color: "#676767",
    fontSize: "0.875rem",
  },
  uploadlable: {
    borderColor: "rgba(0, 0, 0, 0.23)",
    fontSize: "0.875rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "14px",
    "&:hover": {
      borderColor: "rgba(0, 0, 0, 0.87)",
    },
    "& .MuiSvgIcon-root": {
      width: "0.9em",
      height: "0.9em",
      marginRight: "5px",
    },
  },
  descriptioninput: {
    "& .MuiOutlinedInput-multiline": {
      padding: "10px 14px",
    },
    "& .MuiOutlinedInput-inputMultiline": {
      padding: "0",
    },
  },
}));

function RemarkPopup({ handlePopUp, data, open }) {
  const classes = useStyles();
  const classesCustom = useStylesCustom();
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
        console.log("localState", localState);

        navigate("/edit-business-entity", { state: localState });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Fade in={open}>
        <div className={classes.paper}>
          <Button onClick={handlePopUp} className={classes.closebtn}>
            <CloseIcon className={classes.closeicon} />
          </Button>
          <FormControl
            className={`${classesCustom.w100} ${classesCustom.positionrelative}`}
          >
            <div
              className={`${classesCustom.bgwhite} ${classesCustom.dflex} ${classesCustom.flexdirectioncolumn}  ${classesCustom.boxshadow3} ${classesCustom.borderradius6px} ${classesCustom.pb1} ${classesCustom.px1_5} ${classesCustom.mt1}`}
            >
              <Typography
                variant="h3"
                className={`${classesCustom.mt1} ${classesCustom.textcolorformlabel} ${classesCustom.fontfamilyoutfit} ${classesCustom.dflex} ${classesCustom.dflex} ${classesCustom.flexdirectioncolumn} ${classesCustom.fontsize} ${classesCustom.fontstylenormal} ${classesCustom.fw400} ${classesCustom.lineheight}`}
              >
                Business Entity Already Registered
              </Typography>
              <Typography
                variant="h3"
                className={`${classesCustom.textcolorformlabel} ${classesCustom.fontfamilyoutfit}  ${classesCustom.fontsize} ${classesCustom.fontstylenormal} ${classesCustom.fw400} ${classesCustom.lineheight}`}
              >
                Are You want to Edit
              </Typography>
              <div
                className={`${classesCustom.mt1} ${classesCustom.dflex} ${classesCustom.justifyflexend}`}
              >
                <Button
                  onClick={handlePopUp}
                  className={`${classesCustom.ml1} ${classesCustom.custombtnoutline}`}
                >
                  No
                </Button>

                <Button
                  className={`${classesCustom.ml1} ${classesCustom.custombtnblue}`}
                  onClick={handleCheck}
                >
                  Yes
                </Button>
              </div>
            </div>
          </FormControl>
        </div>
      </Fade>
    </>
  );
}

export default RemarkPopup;
