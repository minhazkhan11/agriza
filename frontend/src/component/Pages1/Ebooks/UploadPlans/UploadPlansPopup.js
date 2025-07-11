import React, { useState } from "react";
import {
  makeStyles,
  Modal,
  Backdrop,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  textcolorred: {
    color: "red",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "10px",
    outline: "none",
    minWidth: "500px",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.grey[500],
    cursor: "pointer",
  },
  formControl: {
    margin: theme.spacing(2, 0),
    width: "100%",
    "& .MuiFormLabel-root": {
      marginBottom: "0.6rem"
    }
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  inputFile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  pdfPreview: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  inputpadding: {
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: "0px !important",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px !important",
    },
    "& .MuiOutlinedInput-multiline": {
      padding: "0px 0px",
    },
  },
  
  inputborder: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
      borderWidth: "1px !important",
    },
  },
}));

function UploadPlansPopup({ fetchUploadPlans ,open, handleClosePopup, ebookId , ebookanme }) {
  const classes = useStyles();

  const [contentName, setContentName] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  // const { rowId } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileUrl, setPdfFileUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const handlePdfFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setPdfFileUrl(fileUrl);
    }
  };

  const handleSubmit = async () => {

    if (!contentName.trim()) {
      toast.warn("Please enter content heading.");
      return;
    }

    if (pdfFile == null) {
      toast.warn("Please select a PDF.");
      return;
    }

    try {
      handleLoading();
      setLoading(true);
      const formData = new FormData();

      formData.append(
        "upload_plan",
        JSON.stringify({
          ebook_id: ebookId,
          name: contentName,
        })
      );

      formData.append("file", pdfFile);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/add`,

        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      // Assuming the response includes the ebook ID and indicates success
      if (response.data.success) {
        toast.success("Upload plan created successfully!");
        fetchUploadPlans();
        handleClosePopup();
        setProgress(0);
      } else {
        toast.error(
          "Upload plan added, but encountered an issue with navigation."
        );
      }
    } catch (error) {
      setProgress(0);
      console.error("Error in uploading plan:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add ebook. Please try again.");
      }
    }finally {
      setLoading(false); // Step 3
      // handleOpenclose();
    }
  };

  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };
  const [progress, setProgress] = useState(10);

  const handleLoading = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }

  return (
    <>
      <ToastContainer />
      <Modal
        open={open}
        onClose={handleClosePopup}
        className={classes.modal}
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <div className={classes.paper}>
          <IconButton className={classes.closeIcon} onClick={handleClosePopup}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Upload new plan for E-book : {ebookanme}
          </Typography>
     
          <FormControl className={`${classes.formControl} ${classes.inputpadding} ${classes.inputborder}`}>
            <FormLabel>
              Content Heading <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <TextField
              type="text"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Enter content heading"
            />
          </FormControl>
          <div className={classes.inputFile}>
            <FormLabel>
              Upload PDF / E-Book{" "}
              <span className={classes.textcolorred}>*</span>
            </FormLabel>
            <input
              accept=".pdf"
              type="file"
              id="upload-pdf"
              style={{ display: "none" }}
              onChange={handlePdfFileChange}
            />
            <label htmlFor="upload-pdf">
              <Button variant="contained" color="primary" component="span">
                Select Here
              </Button>
            </label>
            {pdfFileName && <div>Selected PDF file is: {pdfFileName}</div>}
            {pdfFileUrl && (
              <object
                data={pdfFileUrl}
                type="application/pdf"
                width="100%"
                height="200px"
              >
                <p>
                  Your browser does not support PDFs. Please download the PDF to
                  view it: <a href={pdfFileUrl}>Download PDF</a>.
                </p>
              </object>
            )}
            {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgressWithLabel value={progress} />
          </div>
        )}
          </div>
          <div className={classes.actionButtons}>
            <Button
              variant="outlined"
              onClick={handleClosePopup}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UploadPlansPopup;
