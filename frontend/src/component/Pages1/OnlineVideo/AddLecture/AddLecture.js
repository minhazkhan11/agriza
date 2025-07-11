import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Divider,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useStyles from "../../../../styles";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

function AddLecture(props) {
  const { handleOpenclose, open, fetchContentByNoteId, rowIdDDD } = props;
  const {rowId} = useParams();
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const initialData = {
    content_heading: "",
    description: "",
    file: null,
  };

  const [formDetails, setFormDetails] = useState(initialData);

  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoFileUrl, setVideoFileUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [driveUrl, setDriveUrl] = useState("");

  const [selectedHost, setSelectedHost] = useState("");

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileUrl = URL.createObjectURL(file);
      setVideoFileUrl(fileUrl);
      setYoutubeUrl("");
      setDriveUrl("");
    }
  };

  const handleYoutubeChange = (fieldName, value) => {
    setYoutubeUrl(value);
    setDriveUrl("");
    setVideoFile("");
  };

  const handleDriveChange = (fieldName, value) => {
    setDriveUrl(value);
    setYoutubeUrl("");
    setVideoFile("");
  };

  useEffect(() => {});
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!formDetails.content_name) {
      toast.warn("Please enter lecture name.");
      return;
    }
    if (!formDetails.duration) {
      toast.warn("Please enter duration number.");
      return;
    }
    if (!selectedHost) {
      toast.warn("Please Selecte host");
      return;
    }

    if (videoFile == null) {
      toast.warn("Please select a video.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append(
        "lecture",
        JSON.stringify({
          online_video_id: rowId,
          lecture_name: formDetails.content_name,
          duration: formDetails.duration,
          lecture_host: selectedHost,
          description: formDetails.description,
          link: youtubeUrl || driveUrl,
          // lecture_no:,
        })
      );
      

      formData.append("file", videoFile);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/onlinevideolectures/add`,

        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Upload plan created successfully!");
        fetchContentByNoteId(rowId);
       
      } else {
        toast.error(
          "Upload plan added, but encountered an issue with navigation."
        );
      }
    } catch (error) {
      console.error("Error in uploading plan:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        // toast.error("Failed to add lecture. Please try again.");
      }
    } finally {
      setIsLoading(false);
      handleOpenclose();
    }
  };

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const extractYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const extractGoogleDriveFileId = (url) => {
    const match = url.match(/\/file\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.paperpopup} ${classes.p1} ${classes.positionrelative}`}
      >
        <IconButton
          onClick={props.handleOpenclose}
          className={classes.closeIcon}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          className={`${classes.lightblackcolor} ${classes.fontfamilyDMSans} ${classes.fontsize} ${classes.fw700} ${classes.lineheight} ${classes.ml2}`}
        >
          Add Lecture
        </Typography>
        <Divider className={`${classes.mt1} ${classes.background00577B}`} />

        <FormControl
          className={`${classes.inputpadding} ${classes.w100} ${classes.maxh75} ${classes.pagescroll}`}
        >
          <div className={`${classes.dflex} ${classes.justifyspacebetween} `}>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Lecture Name
                <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                type="text"
                required
                variant="outlined"
                InputProps={{ disableUnderline: true }}
                value={formDetails.content_name}
                onChange={(e) =>
                  handleFormChange("content_name", e.target.value)
                }
                placeholder="Type Here.."
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Duration <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                type="number"
                variant="outlined"
                required
                InputProps={{ disableUnderline: true }}
                value={formDetails.duration}
                onChange={(e) => handleFormChange("duration", e.target.value)}
                placeholder="Type Here.."
              />
            </div>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} `}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.selectinput}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Lecture Host <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
                displayEmpty
                required
                variant="outlined"
                name="lecture_host"
                MenuProps={menuProps}
                disableUnderline="true"
              >
                <MenuItem disabled value="">
                  <em className={classes.defaultselect}>Select Here</em>
                </MenuItem>

                <MenuItem value="youtube">Youtube</MenuItem>
                <MenuItem value="google_drive">Google Drive</MenuItem>
                <MenuItem value="server">Server</MenuItem>
              </Select>
            </div>
          </div>
          {selectedHost === "youtube" && (
            <>
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Youtube Link
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    required
                    value={youtubeUrl}
                    InputProps={{ disableUnderline: true }}
                    onChange={(e) =>
                      handleYoutubeChange("youtube_link", e.target.value)
                    }
                    placeholder="Type Here"
                  />
                </div>
              </div>
              {youtubeUrl && (
                <div className={`${classes.w69} ${classes.m1auto}`}>
                  <iframe
                    width="100%"
                    height="auto"
                    src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                      youtubeUrl
                    )}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </>
          )}

          {selectedHost === "google_drive" && (
            <>
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween}`}
              >
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Google Drive Link
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    InputProps={{ disableUnderline: true }}
                    required
                    value={driveUrl}
                    onChange={(e) =>
                      handleDriveChange("google_drive_link", e.target.value)
                    }
                    placeholder="Type Here"
                  />
                </div>
              </div>
              {driveUrl && (
                <div className={`${classes.w69} ${classes.m1auto}`}>
                  <iframe
                    src={`https://drive.google.com/file/d/${extractGoogleDriveFileId(
                      driveUrl
                    )}/preview`}
                    width="100%"
                    height="auto"
                    title="Google Drive Preview"
                    frameBorder="0"
                    allow="encrypted-media"
                  ></iframe>
                </div>
              )}
            </>
          )}

          {selectedHost === "server" && (
            <div className={`${classes.mt1}`}>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Upload Lecture Video <span className={classes.required}>*</span>
              </FormLabel>
              <br></br>
              <input
                accept="video/*"
                className={classes.input}
                id="raised-button-file"
                multiple
                type="file"
                style={{ display: "none" }}
                onChange={handleVideoFileChange}
              />
              <div className={classes.uploadButtonContainer}>
                <label htmlFor="raised-button-file" className={classes.w100}>
                  <Button
                    component="span"
                    className={classes.bluebtn}
                    fullWidth
                  >
                    Select Video here
                  </Button>
                </label>
              </div>
              {videoFileUrl && (
                <div className={`${classes.w69} ${classes.m1auto}`}>
                  <video controls width="100%" height="auto">
                    <source src={videoFileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}
          {isLoading && <Loader />}

          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn}`}
          >
            <FormLabel
              className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
            >
              Description
            </FormLabel>
            <TextField
              variant="outlined"
              type="text"
              multiline
              placeholder="Type description you are posting on the Notes post"
              InputProps={{ disableUnderline: true }}
              value={formDetails.description}
              onChange={(e) =>
                handleFormChange("description", e.target.value)
              }
              rows={4}
            />
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt2}`}
          >
            <Button
              className={`${classes.custombtnoutline} ${classes.w20}`}
              onClick={handleOpenclose}
              color="default"
            >
              Cancel
            </Button>
            <Button
              className={`${classes.bluebtn} ${classes.w20}`}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}

export default AddLecture;
