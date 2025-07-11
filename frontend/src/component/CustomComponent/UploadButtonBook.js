import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as UploadIcon } from "../images/CustomComponent/uploadicon.svg";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    "& > *": {
    },
    '& .MuiIconButton-root':{
        height: '100%',
        background: '#EDFAFF',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #DADADA',
        padding: "1rem",
      },
      "& .MuiIconButton-label": {
        display: "block",
      },
      "& .MuiTypography-caption": {
        color: "#000",
      }
  },
  input: {
    display: "none",
  },
}));

export default function UploadButtonsBook({ onImageChange, thumbnailImagePreview , setThumbnailImagePreview, inputFor }) {
  const classes = useStyles();

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
    <div className={classes.root}>
      <label htmlFor="thumbnail-image-input">
        <IconButton
          variant="contained"
          color="primary"
          component="span"
          className="upload-button"
        >
          {thumbnailImagePreview ? (
            <img
              src={thumbnailImagePreview}
              alt="Image_preview"
              style={{ maxWidth: "200px" }}
            />
          ) : (
            // Use the UploadIcon component here
            <>
              <UploadIcon width="100%" />
              <Typography variant="caption">{inputFor}</Typography>
            </>
          )}
        </IconButton>
      </label>
      <input
        accept="image/*"
        className={classes.input}
        id="thumbnail-image-input"
        type="file"
        labelId="thumbnail-image-input"
        onChange={handleThumbnailImageChange}
      />
    </div>
  );
}