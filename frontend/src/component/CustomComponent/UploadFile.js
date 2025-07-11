import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as UploadFileIcon } from "../images/CustomComponent/uploadfileicon.svg";

const useStyles = makeStyles((theme) => ({
  main: {
    width: "100%",
    padding: "1rem 0",
    border: "1px solid #FFC855",
    borderRadius: " 0.375rem",
    textAlign: "center",
    background: "#EDFAFF",
    "& .MuiTypography-h6": {
      color: "#FF3939",
      fontFamily: "Jost",
      fontSize: "16px",
      fontWeight: 500,
    },
    "& .MuiTypography-h5": {
      color: "#353535",
      fontFamily: "Jost !important",
      fontSize: "16px",
      fontWeight: 500,
    },
    "& .MuiTypography-h4": {
      color: "#444",
      fontFamily: "Jost",
      fontSize: "10px",
      fontWeight: "400",
      marginTop: "0.1rem",
    },
    "& .MuiTypography-caption": {
      color: "#2E2E2E",
      fontFamily: " Playfair Display",
      fontSize: "26px",
      fontStyle: "normal",
      fontWeight: "700",
      textDecoration: "underline",
      marginTop: "1rem",
    },
  },
  dragdrop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const UploadFile = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.main}>
        <label role="button" datacy="uploadImage">
            <input type="file" accept="image/png, image/jpeg" hidden />
            <UploadFileIcon />
            <div className={classes.dragdrop}>
              <Typography variant="h6">Drag & Drop</Typography>
              <Typography variant="h5">Your Files Here</Typography>
            </div>
            <Typography variant="h4">
              Supports : Pdf, JPEG, Png, Word Document,
            </Typography>
        </label>
      </div>
    </>
  );
};

export default UploadFile;
