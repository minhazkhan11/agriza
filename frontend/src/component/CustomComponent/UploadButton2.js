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
  handleThumbnailImageChangeTest,
  setThumbnailImage,
  thumbnailImage,
  thumbnailImagePreview,
  setThumbnailImagePreview,
  fieldName,
}) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const deleteDataOfRow = async (rowId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      toast.success("File deleted successfully");
      setThumbnailImage((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
      setThumbnailImagePreview((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    } catch (error) {
      toast.error("File deletion failed.");
      console.error("Delete error:", error);
    }
  };

const fullUrl = thumbnailImage?.[fieldName] || "";
const fileName = fullUrl ? fullUrl.split("/").pop() : "";



  return (
    <div className={classes.root}>
      <label htmlFor={`upload-${fieldName}`}>
        {thumbnailImage?.[fieldName] ? (
          <div className={classes.linkcont}>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(fullUrl, "_blank", "noopener,noreferrer");
              }}
            >
            
              {fileName}
            </Link>
            <IconButton onClick={() => deleteDataOfRow(thumbnailImage[`${fieldName}_id`])}>
              <CancelOutlinedIcon />
            </IconButton>
          </div>
        ) : (
          <IconButton variant="contained" color="primary" component="span">
            <UploadIconTest width="30px" />
            <Typography>Upload File</Typography>
            <input
              accept="image/*"
              className={classes.input}
              id={`upload-${fieldName}`}
              name={fieldName}
              type="file"
              onChange={(e) => handleThumbnailImageChangeTest(e, fieldName)}
            />
          </IconButton>
        )}
      </label>
    </div>
  );
}
