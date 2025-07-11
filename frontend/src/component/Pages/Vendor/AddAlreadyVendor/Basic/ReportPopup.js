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
    color: 'white',
    borderRadius: "50% !important",
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
    height: "40vh",
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
    color: "#FFFFFF !important",
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

function ReportPopup(props) {
  const { open, handleOpenClose,  setRemark, remark , rowId } = props;
    const decryptedToken = decryptData(sessionStorage.getItem("token"));
    const navigate = useNavigate();
  const classes = useStyles();
  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleStatus = async (currentStatus) => {
   
      const data = {
        brand: {
          active_status: currentStatus,
          remark: remark,
          id: rowId,
        },
      };

      try {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/auth/remark/update`,
          data,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        toast.success("Brand status changed successfully");
        setTimeout(() => {
          navigate("/brand-approval-list");
        }, 1000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to change the Brand";
        toast.error(errorMessage);
      
    }
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
            {/* <CloseIcon className={classes.closeicon} /> */}
            X
          </Button>
          <div className={classes.modalheading}>
            <Typography variant="h6">Report</Typography>
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
                placeholder="Type Here..."
                rows={4}
              />
              <div className={classes.btncontainer}>
                <Button
                  className={classes.bluebtn}
                  variant="contained"
                  onClick={() => handleStatus("cancelled")}
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

export default ReportPopup;
