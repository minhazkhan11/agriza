import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    width: "35%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      fontSize: "1.125rem",
    },
    "& .MuiTypography-h5": {
      color: "#00577B",
      fontSize: "1rem",
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
    color: "white",
    top: "-18px",
    right: "-18px",
    padding: "0px !important",
    backgroundColor: "#00577B",
    height: "35px",
    minWidth: "35px !important",
    borderRadius: "50% !important",
    border: "3px solid #FFF",
    "&:hover": {
      backgroundColor: "#00577B !important",
    },
  },
  closeicon: {
    fill: "#D9D9D9",
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
    marginTop: "0.6rem",
  },
  input: {
    "&::file-selector-button": {
      display: "none",
    },
  },
  btncontainer: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "1rem 0 2rem 0",
    "& .MuiButton-contained": {
      width: "30%",
    },
    "& .MuiButton-outlined": {
      width: "40%",
    },
  },
  bluebtn: {
    background: "#00577B",
    color: "#FFFFFF",
    fontSize: "0.875rem",
    textTransform: "capitalize",
  },
  outlinebtn: {
    borderColor: "#676767",
    color: "#676767",
    fontSize: "0.875rem",
  },
}));

function FormLinkPopup(props) {
  const { open, handleOpenClose, formId, coachingName } = props;
  const classes = useStyles();
  const [link, setLink] = useState("");

  let formattedCoachingName;

  if (coachingName.includes(" ")) {
    formattedCoachingName = coachingName.replace(/\s+/g, "_");
  } else {
    formattedCoachingName = coachingName;
  }

  useEffect(() => {
    setLink(
      `https://coaching-dev.parikshado.com/${formattedCoachingName}/${formId}`
    );
    // setLink(`http://localhost:3000/${formattedCoachingName}/${formId}`);
  }, [formId]);

  // Function to copy the link to the clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy link to clipboard");
        console.error("Failed to copy link: ", error);
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
          <Button onClick={handleOpenClose} className={classes.closebtn}>
            <CloseIcon className={classes.closeicon} />
          </Button>
          <div className={classes.modalheading}>
            <Typography variant="h6">Form Link</Typography>
          </div>
          <hr className={classes.dottedhr} />
          <FormControl className={classes.form}>
            <Typography variant="h5">Form Link is Generated..!!</Typography>
            <div className={classes.forminner}>
              <TextField
                name="link"
                value={link}
                inputProps={{ readOnly: true }}
                type="text"
                variant="outlined"
                placeholder="remark"
              />
              <div className={classes.btncontainer}>
                <Button
                  className={`${classes.bluebtn}`}
                  variant="contained"
                  onClick={copyLinkToClipboard}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </FormControl>
        </div>
      </Fade>
    </>
  );
}

export default FormLinkPopup;
