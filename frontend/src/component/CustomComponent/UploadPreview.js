import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as UploadIcon } from "../images/CustomComponent/uploadicon.svg";
import useCustomStyles from "../../styles";
import { Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    "& > *": {},
    "& .MuiIconButton-root": {
      height: "100%",
      background: "#EDFAFF",
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #DADADA",
      padding: "0",
    },
  },
  input: {
    display: "none",
  },
}));

export default function UploadPreview({
  onImageChange,
  thumbnailImagePreview,
  setThumbnailImagePreview,
}) {
  const classes = useStyles();
  const customclasses = useCustomStyles();

  const handleThumbnailImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`${classes.root} ${customclasses.w50} ${
        thumbnailImagePreview ? "" : customclasses.borderblack
      } ${customclasses.p0_2} ${customclasses.justifycenter} ${
        customclasses.justifycenter
      } ${customclasses.alignitemscenter}`}
      style={{ width: "200px", height: "100px" }}
    >
      {thumbnailImagePreview ? (
        <img
          src={thumbnailImagePreview}
          alt="Image_preview"
          style={{ width: "100%" }}
        />
      ) : (
        <>
          <Typography> Image Preview </Typography>
        </>
      )}
    </div>
  );
}
