import React, { useEffect, useState, useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";

import {
  FormLabel,
  Typography,
  Button,
  Modal,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import { ReactComponent as ImportIcon } from "../../../images/commonicon/importicon.svg";
import { ReactComponent as QuestionIcon } from "../../../images/questionimage/questionicon.svg";
import { toast } from "react-toastify";
import bulkQuestions from "../../../../bulkQuestions.csv";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ReactComponent as ExportIcon } from "../../../images/commonicon/exporticon.svg";
import { useNavigate, useParams } from "react-router-dom";

function PageHeader({ questionList,examName,fetchData }) {
  const classes = useStyles();
  // Inside your PageHeader component
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    backgroundColor: "white",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "8px",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "#000",
    cursor: "pointer",
  };

  const formLabelStyle = {
    marginBottom: "10px",
    display: "block",
    color: "#333",
    fontSize: "16px",
  };

  const buttonContainerStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  };

  const { rowId } = useParams();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async (rowId) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/subjects/${rowId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);

          // Automatically select the first subject if subjects are loaded successfully
          if (data.subjects.length > 0) {
            setSelectedSubject(data.subjects[0].id);
          }
        } else {
          console.error("API Error:", response.status);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects(rowId);
  }, [decryptedToken, rowId]);

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bulkQuestions;
    link.setAttribute("download", "bulkQuestions.csv");

    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Check if the download started (link exists in document)
    if (document.body.contains(link)) {
      toast.success(
        "Sample file for adding questions in bulk has been downloaded"
      );
    } else {
      toast.error(
        "Failed to download the bulk questions file. Please try again."
      );
    }

    // Clean up
    link.parentNode.removeChild(link);
  };

  const fileInputRef = useRef();

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const QuestionsData = {
      test_series_id: rowId,
      subject_id: selectedSubject,
    };

    formData.append("question", JSON.stringify(QuestionsData));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries_questions/import/csv`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Questions uploaded successfully");
        handleModalClose();
        fetchData();
      } else {
        throw new Error("Failed to upload questions");
      }
    } catch (error) {
      fetchData();
      toast.error(
        error.message || "An error occurred while uploading questions"
      );
    }
  };

  // const handleUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  const handleUploadClick = () => {
    if (selectedSubject) {
      fileInputRef.current.click();
     
    } else {
      toast.error("Please select a subject before uploading");
    }
  };

  const handleModalSubmit = () => {
    handleUploadClick();
  };





  

  const [fileURL, setFileURL] = useState("");
  const exportApi = async (decryptedToken) => {
    try {

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries_questions/export/${rowId}`
          , {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        setFileURL(response.data.file_url);
        fetchData();
        // toast.success("Result CSV has been downloaded successfully.");
      } else {
        // toast.error("Failed to download the CSV file.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while fetching the data.";
      toast.error(errorMessage);
      fetchData();

    }
  };

  useEffect(() => {
    if (questionList && decryptedToken) {
      exportApi(decryptedToken);
    }
  }, [questionList, decryptedToken]);

  const handleExportClick = () => {
    if (fileURL && decryptedToken) {
      window.open(fileURL, "_blank");
      toast.success("CSV has been downloaded successfully.");
    } else {
      toast.error("Export file is not available for this.");
    }
  };







  return (
    <>
      <div className={`${classes.bgwhite} ${classes.boxshadow3}`}>
        <div
          className={`${classes.boxshadow4} ${classes.borderradius6px} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.py0_5} ${classes.px1_5}`}
        >
          <div className={classes.heading}>
            <div className={`${classes.dflex} `}>
              <div className={classes.mr0_5}>
                {" "}
                <QuestionIcon />
              </div>
              <Typography
                variant="h3"
                className={`${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}`}
              >
                Questions
              </Typography>
            </div>
            <div className={`${classes.dflex} ${classes.alignitemscenter} `}>
              <Typography
                variant="subtitle1"
                className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fontsize3}`}
              >
                Want to Add in Bulk ?
              </Typography>
              <Button
                onClick={handleDownload}
                className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_5}`}
              >
                Download bulk Sample Files
              </Button>
            </div>
          </div>
          <div className={classes.btnContainer}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{ display: "none" }}
              accept=".xlsx, .csv"
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.transparentbtn}
              onClick={handleModalOpen} // Open the modal on click
            >
              Import CSV File <ImportIcon className={`${classes.ml1}`} />
            </Button>
            <Button
              className={`${classes.custombtnblue} ${classes.ml1}`}
                onClick={handleExportClick}
              type=""
            >
              Export File <ExportIcon className={`${classes.ml1}`} />
            </Button>

            <Modal open={open} onClose={handleModalClose}>
              <div style={modalStyle}>
                <IconButton style={closeButtonStyle} onClick={handleModalClose}>
                  <CloseIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  style={{ marginBottom: "16px", textAlign: "center" }}
                >
                  Select Subject for Test Series : {examName} 
                </Typography>

                <div>
                  <FormLabel style={formLabelStyle}>
                    Subject <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: "20px" }}
                  >
                    <MenuItem disabled value="">
                      <em className={classes.defaultselect}>Select Subject</em>
                    </MenuItem>
                    {loading ? (
                      <MenuItem disabled value="">
                        Loading Subjects...
                      </MenuItem>
                    ) : (
                      subjects.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.subject_name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </div>
                <div style={buttonContainerStyle}>
                  <Button
                    onClick={handleModalClose}
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleModalSubmit} color="primary">
                    Save & Choose CSV file
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageHeader;
