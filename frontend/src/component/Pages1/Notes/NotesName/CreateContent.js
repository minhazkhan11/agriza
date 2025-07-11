import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Adjusted for vertical spacing
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  btnContainer: {
    display: "flex",
    justifyContent: "flex-end", // Align buttons to the right
    "& > *": {
      marginLeft: theme.spacing(2), // Space between buttons
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120, 
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(1),
  },
  previewContainer: {
    display: "flex", // Use flexbox to align children
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    width: "100%", // Ensure the container takes full width of its parent
    marginTop: theme.spacing(2), // Optional: Add some space above the container
  },
  previewImage: {
    // Your existing styles for the image
    width: "150px",
    height: "100px",
    objectFit: "cover",
  },
  fileInput: {
    display: "none",
  },
  fileNameDisplay: {
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    marginTop: theme.spacing(1),
  },
  fileTypeContainer: {
    display: "flex",
    alignItems: "center", // Align items vertically in the center
    flexWrap: "wrap", // Allow items to wrap as needed
    gap: theme.spacing(1), // Add some space between the items
  },
  fileTypeLabel: {
    marginRight: theme.spacing(2), // Add some space after the label
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

function CreateContent(props) {
  const { notename, open, handleOpenclose, fetchContentByNoteId, noteId } =
    props;

  const classes = useStyles();

  const navigate = useNavigate();

  // Initialize formDetails state
  const [formDetails, setFormDetails] = useState({
    content_heading: "",
    file_format: "",
    file: null,
  });

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [linkInput, setLinkInput] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());

  // Function to handle changes in the form fields
  const handleFormChange = (fieldName, value) => {
    setFormDetails((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setInputKey(Date.now());
    // Reset input
    event.target.value = null;

    const fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    let isValidType = false;
    switch (selectedFileType) {
      case "doc":
        isValidType = ["csv", "xlsx", "xls", "docx"].includes(fileExtension);
        break;
      case "image":
        isValidType = fileType.startsWith("image/");
        break;
      case "pdf":
        isValidType = fileExtension === "pdf";
        break;
      case "audio":
        isValidType = fileExtension === "mp3";
        break;
      case "video":
        isValidType = fileExtension === "mp4";
        break;
      default:
        toast.warning("Unsupported file type selected");
        return;
    }

    if (!isValidType) {
      toast.warning(`Please select a valid ${selectedFileType} file.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadTypeChange = (type) => {
    setSelectedFileType(type);
    setSelectedFile(null);
    setLinkInput("");
  };

  const fileInputTypes = {
    doc: ".csv,.xlsx,.xls,.docx",
    image: "image/*",
    pdf: ".pdf",
    audio: "audio/mp3",
    video: "video/mp4",
  };

  const renderUploadInput = () => {
    if (selectedFileType === "link") {
      <hr className={classes.dottedhr} />;
      return (
        <TextField
          fullWidth
          variant="outlined"
          label="Enter Link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
        />
      );
    } else if (selectedFileType) {
      return (
        <>
          <input
            key={inputKey}
            accept={fileInputTypes[selectedFileType]}
            className={classes.fileInput}
            id="contained-button-file"
            multiple={false}
            type="file"
            onChange={handleFileChange}
          />

          <div>
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                className={classes.uploadButton}
              >
                Upload Your {selectedFileType} File *
              </Button>
            </label>
          </div>

          {selectedFile && (
            <div className={classes.fileNameDisplay}>
              <Typography variant="body1">
                Selected file: {selectedFile.name}
              </Typography>
            </div>
          )}
        </>
      );
    }
  };

  const renderImagePreview = () => {
    if (selectedFileType === "image" && selectedFile) {
      return (
        <div className={classes.previewContainer}>
          {" "}
          {/* Use the new style here */}
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className={classes.previewImage}
          />
        </div>
      );
    }
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      handleLoading();
      setLoading(true);
      if (!formDetails.content_heading) {
        toast.error("Please enter the content heading.");
        return;
      }
      if (!selectedFile && selectedFileType !== "link") {
        toast.error(`Please select a file for ${selectedFileType}`);
        return;
      }
      if (selectedFileType === "link" && linkInput === "") {
        toast.error(`Please enter a link`);
        return;
      }

      const requestData = {
        note_id: noteId,
        heading: formDetails.content_heading,
        file_format: selectedFileType,
      };

      if (selectedFileType === "link") {
        requestData.content_path = linkInput ? linkInput : null;
      }

      const formData = new FormData();
      formData.append("content", JSON.stringify(requestData));

      if (selectedFileType === "link") {
        formData.append("file", null);
      } else {
        formData.append("file", selectedFile);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/note_contents/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Content created successfully!");
        handleOpenclose();
        fetchContentByNoteId();
        setProgress(0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Handle and show error message
      toast.error("An error occurred:", error.response.data.message);
    } finally {
      // setLoading(false); 
      setProgress(0);
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
      <div className={classes.paper}>
        <IconButton
          onClick={props.handleOpenclose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Create content for : {notename}
        </Typography>
        <hr className={classes.dottedhr} />
        <FormControl className={`${classes.formControl} ${classes.inputpadding} ${classes.inputborder}`}>
          <FormLabel>
            Content Heading <span className={classes.textcolorred}>*</span>
          </FormLabel>
          <br></br>
          <TextField
            name="content_heading"
            onChange={(e) =>
              handleFormChange("content_heading", e.target.value)
            }
            value={formDetails.content_heading}
            type="text"
            variant="outlined"
            placeholder="Type Content Heading here"
          />
        </FormControl>

        <hr className={classes.dottedhr} />

        <FormControl fullWidth className={classes.formControl}>
          <div className={classes.fileTypeContainer}>
            <FormLabel component="legend" className={classes.fileTypeLabel}>
              File Type <span className={classes.textcolorred}>*</span>
            </FormLabel>
            {/* ["doc", "link", "image", "pdf", "audio", "video"] */}
            {["pdf", "video"].map((type) => (
              <Button
                key={type}
                variant={selectedFileType === type ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleUploadTypeChange(type)}
                className={classes.uploadButton}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </FormControl>

        {renderUploadInput()}

        {renderImagePreview()}

        <hr className={classes.dottedhr} />
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
        <div className={classes.btnContainer}>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={handleOpenclose} color="default">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateContent;
