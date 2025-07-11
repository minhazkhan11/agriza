import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    width: "35%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      color: "#00577B",
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
    background: "#00577B",
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

function RemarkPopup(props) {
  const { open, handleOpenClose, remark, setRemark, handleStatus } =
    props;
  const classes = useStyles();

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
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
            <Typography variant="h6">Remark</Typography>
          </div>
          <hr className={classes.dottedhr} />
          <FormControl className={classes.form}>
            <div className={classes.forminner}>
              <TextField
                name="remark"
                value={remark}
                onChange={handleRemarkChange}
                type="text"
                variant="outlined"
                multiline
                placeholder="remark"
                rows={4}
              />
              <div className={classes.btncontainer}>
                <Button
                  className={classes.bluebtn}
                  variant="contained"
                  onClick={() => handleStatus(remark)}
                >
                  Submit
                </Button>
                <Button
                  className={classes.outlinebtn}
                  onClick={handleOpenClose}
                  variant="outlined"
                >
                  Cancel
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
