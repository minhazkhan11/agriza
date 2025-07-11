import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import {Tooltip, withStyles } from "@material-ui/core";
import { ReactComponent as UploadIcon } from "../images/CustomComponent/uploadicon.svg";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { ReactComponent as UploadIconTest } from "../images/CustomComponent/uploadicontest.svg";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { decryptData } from "../../crypto";
import axios from "axios"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  linkcont:{
    display:'flex',
    "& .MuiIconButton-root": {
      background: "transparent",
      width: "30px",
      borderRadius: "5px",
      border: "none",
      padding: "0",
    },
  }
}));

export default function UploadButtons({
  onImageChange,
  handleThumbnailImageChangeTest,
  setThumbnailImage,
  thumbnailImage,
  thumbnailImagePreview,
  setThumbnailImagePreview,
  fieldName
}) {
  const classes = useStyles();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

 


  const fullUrl = thumbnailImage?.fileUrl
const fileName = fullUrl?.split('/').pop();

  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      toast.success("Business Segment deleted successfully");
      setThumbnailImage(null)
      setThumbnailImagePreview(null);
    } catch (error) {
      toast.error("Business Segment is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

    const LightTooltip = withStyles((theme) => ({
      tooltip: {
        backgroundColor: theme.palette.common.white,
        color: "rgba(0, 0, 0, 0.87)",
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }))(Tooltip);

  return (
    <div className={classes.root}>
      <label htmlFor="thumbnail-image-input">
        {thumbnailImagePreview ? (
          <div className={classes.linkcont}>
            {/* <Link className={classes.textdecorationnone} to={thumbnailImage}>
              {thumbnailImage}
            </Link> */}

            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(thumbnailImage?.fileUrl, "_blank", "noopener,noreferrer");
              }}
            >
              {fileName}
            </Link>
            <IconButton
              onClick={() => deleteDataOfRow(thumbnailImage.id)}
                >
                  <LightTooltip title="Delete">
                    <CancelOutlinedIcon />
                  </LightTooltip>
                </IconButton>
          </div>
        ) : (
          <IconButton
            variant="contained"
            color="primary"
            component="span"
            className="upload-button"
          >
            {/* <UploadIcon width="100%" /> */}
            <UploadIconTest width="30px" />
            <Typography>Upload Your File</Typography>
            <input
              accept="image/*"
              className={classes.input}
              id="thumbnail-image-input"
              name={fieldName}
              type="file"
              labelId="thumbnail-image-input"
              onClick={(e)=>handleThumbnailImageChangeTest(e , fieldName)}
            />
          </IconButton>
        )}
      </label>
    </div>
  );
}
