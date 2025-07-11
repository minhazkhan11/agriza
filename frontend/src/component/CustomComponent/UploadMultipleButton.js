import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as UploadIcon } from "../images/CustomComponent/uploadicon.svg";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { DialogActions } from "@mui/material";

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
      padding: "1rem",
    },
    "& .MuiIconButton-label": {
      display: "block",
    },
    "& .MuiTypography-caption": {
      color: "#000",
    },
  },
  input: {
    display: "none",
  },
  main: {
    display: "flex",
    flex: "wrap",
    width: "100%",
  },
  w100: {
    width: "100%",
  },
  w30: {
    maxWidth: "30%",
  },
  positionrelative: {
    position: "relative",
  },
  dflex: {
    display: "flex",
  },
  flexwrapwrap: {
    flex: "wrap",
  },
  flexdirectionrow: {
    flexDirection: "row",
  },
}));

export default function UploadMultipleButton({
  onImageChange,
  thumbnailImagePreview,
  setThumbnailImagePreview,
  inputFor,
  handleImageDelete,
}) {
  const classes = useStyles();

  // const handleThumbnailImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     onImageChange(file);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setThumbnailImagePreview(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className={classes.main}>
      <div className={classes.root}>
        <input
          accept="image/*"
          multiple
          className={classes.input}
          id="thumbnail-image-input"
          type="file"
          labelId="thumbnail-image-input"
          onChange={onImageChange}
        />
        <label htmlFor="thumbnail-image-input">
          <IconButton
            variant="contained"
            color="primary"
            component="span"
            className="upload-button"
            style={{ maxWidth: "200px" }}
          >
            <UploadIcon width="100%" />
            <Typography variant="caption">{inputFor}</Typography>
          </IconButton>
        </label>
      </div>

      <div
        className={` ${classes.w30} ${classes.m0_5} ${classes.positionrelative} ${classes.dflex} ${classes.flexwrapwrap}`}
      >
        {thumbnailImagePreview.map((preview, index) => (
          <>
            <IconButton
              variant="contained"
              color="primary"
              component="span"
              className="upload-button"
              style={{ maxWidth: "500px" }}
            >
              <img
                src={preview}
                alt={`Preview ${index}`}
                width="97px"
              />
              <IconButton
                onClick={() => handleImageDelete(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
              >
                <ClearIcon />
              </IconButton>
            </IconButton>
          </>
        ))}
      </div>
    </div>
  );
}
