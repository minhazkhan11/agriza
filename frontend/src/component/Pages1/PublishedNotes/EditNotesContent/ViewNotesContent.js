import React, { useState, useEffect } from "react";

import useStyles from "../../../../styles";
import {
  Backdrop,
  Button,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  withStyles,
  Modal,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { ReactComponent as EditIcon } from "../../../images/NotesImage/editicon.svg";
import { ReactComponent as MoveIcon } from "../../../images/NotesImage/moveicon.svg";
import { ReactComponent as PdfIcon } from "../../../images/NotesImage/pdficon.svg";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import DeleteIcon from "@material-ui/icons/Delete";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { decryptData } from "../../../../crypto";
import { useNavigate, useParams } from "react-router-dom";

import CreateContent from "./CreateContent";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios"; // Import Axios

import CloseIcon from "@material-ui/icons/Close";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import CircularProgress from '@material-ui/core/CircularProgress';


import ImageIcon from "@material-ui/icons/Image";
import LinkIcon from "@material-ui/icons/Link";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import MovieIcon from "@material-ui/icons/Movie";
import DescriptionIcon from "@material-ui/icons/Description";

function ViewNotesContent({ notename }) {
  const classes = useStyles();
  const { rowId } = useParams();
  const [mediaLoading, setMediaLoading] = useState(true);
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [openAddContent, setOpenAddContent] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState();

  const [contentData, setContentData] = useState([]);
  const handleCreateContentOpenclose = () => {
    setOpenAddContent(!openAddContent);
  };

  const formatToIcon = {
    doc: <DescriptionIcon />,
    pdf: <PictureAsPdfIcon />,
    image: <ImageIcon />,
    link: <LinkIcon />,
    audio: <AudiotrackIcon />,
    video: <MovieIcon />,
  };

  const fetchContentByNoteId = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/note_contents/publishby_note_id/${rowId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setContentData(data.contents);
      } else {
        // Handle the API error here
      }
    } catch (error) {
      // Handle any other errors here
    }
  };

  useEffect(() => {
    fetchContentByNoteId();
  }, []);

  const rowdataForContent = contentData
    ? contentData.map((c) => ({
        id: c?.id ? c.id : null,
        heading: c?.content_heading ? c.content_heading : "",
        content_path: c?.content_path ? c.content_path : "",
        file_format: c?.file_format ? c.file_format : "",
        payment_status: c?.payment_status ? c?.payment_status : "",
        active_status: c?.active_status ? c.active_status : "",
      }))
    : [];

  const handleSave = () => {
    toast.success("Saved successfully", {
      position: "top-right",
      hideProgressBar: true,
    });
    setTimeout(() => {
      navigate("/admin/publishednotes");
    }, 1500);
  };

  // Function to delete a book
  const deleteContent = async (contentID) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/note_contents/publish/${contentID}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      fetchContentByNoteId();

      toast.success("Content deleted successfully");
      const updatedBooks = contentData.filter((tpc) => tpc.id !== contentID);
      setContentData(updatedBooks);
    } catch (error) {
      toast.error("Content is not deleted");
      console.error("Error deleting tpc: ", error);
    }
  };

  const handleStatusForContent = (contentId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      content: {
        active_status: newStatus,
        id: contentId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/note_contents/publish/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchContentByNoteId();
        toast.success("Content status changed successfully");
      })
      .catch((error) => {
        console.error("Error changed Content status:", error);
        toast.error("Content status is not changed");
      });
  };

  const [openContentModal, setOpenContentModal] = useState(false);
  const [contentUrl, setContentUrl] = useState("");

  const openContent = (url, rowId) => {
    setContentUrl(url);
    setOpenContentModal(true);
    setSelectedRowIndex(rowId);
    setMediaLoading(true); 
  };

  const closeContentModal = () => {
    setOpenContentModal(false);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setMediaLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [contentUrl]);

  const renderMediaContent = (fileFormat, contentUrl) => {
    // Adjustments for iframe height
    const iframeHeight = "80vh"; 

    switch (fileFormat) {
      case "doc":
      case "pdf":
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${contentUrl}&embedded=true`}
            title="Document"
            style={{ width: "100%", height: iframeHeight }} // Adjusted height for iframe
            frameBorder="0"
          />
        );
      case "image":
        return (
          <img
            src={contentUrl}
            alt="Content"
            style={{ maxWidth: "100%", height: "auto" }} // Using height: auto for images
          />
        );
      case "link":
        // Handling for links might differ as they open in a new tab
        return (
          <a href={contentUrl} target="_blank" rel="noopener noreferrer">
            Open Link
          </a>
        );
      case "audio":
        return (
          <audio controls style={{ width: "100%" }}>
            <source src={contentUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case "video":
        return (
          <video controls style={{ width: "100%", height: "auto" }}>
            <source src={contentUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return null; // Handle unsupported formats
    }
  };
  const navigate = useNavigate();
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const handleStatusForLockUnlock = (contentId, currentStatus) => {
    const newStatus = currentStatus === "free" ? "paid" : "free";
    const data = {
      content: {
        payment_status: newStatus,
        id: contentId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/note_contents/publish/payment_status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Status changed successfully", response);
        fetchContentByNoteId();
        toast.success("Status changed successfully");
      })
      .catch((error) => {
        console.error("Error changed Content status:", error);
        toast.error(" Status is not changed");
      });
  };

  return (
    <>
      <ToastContainer />
      <div>
      <div
        className={` ${classes.mt1} ${classes.p1} ${classes.h60vh}`}
      >
      <div
        className={`${classes.boxshadow3} ${classes.bgwhite} ${classes.mt1} ${classes.p1} ${classes.h65vh}`}
      >
        <div
          className={`${classes.bgdarkblue} ${classes.py0_5x0}  ${classes.pl0_5} ${classes.dflex} ${classes.justifyspacebetween} ${classes.borderradiuscustom1}`}
        >
          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w32}`}
          >
            <Typography
              className={`${classes.textcolorwhite} ${classes.fontfamilyDMSans}`}
            >
              Content Name
            </Typography>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w15}`}
          >
            <IconButton
              className={`${classes.bgorange}`}
              onClick={() => setOpenAddContent(true)}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>

        {rowdataForContent.length === 0 ? (
          <Typography variant="h6">
            Oops... ! No content available for this note right now .
          </Typography>
        ) : (
          rowdataForContent.map((rowData, i) => (
            <div
              className={`${classes.bgskylite} ${classes.borderbottom1}  ${classes.py0_5x1} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
            >
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w60}`}
              >
                <Typography className={`${classes.w75}`}>
                  {rowData.heading}
                </Typography>
                <Button
                  className={`${classes.boxshadow4} ${classes.bgwhite} ${classes.borderradius6px} `}
                  onClick={() => openContent(rowData.content_path, i)}
                >
                  {/* <PdfIcon /> */}
                  {formatToIcon[rowData.file_format]}
                </Button>
              </div>

              <div
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
            >
              <button
                title={rowData.payment_status}
                onClick={() =>
                  handleStatusForLockUnlock(rowData.id, rowData.payment_status)
                }
              >
                {rowData.payment_status === "free" ? (
                  <LockOpenIcon />
                ) : (
                  <LockOutlinedIcon />
                )}
              </button>
            </div>
           
              <Paper>
                <IconButton
                  onClick={(event) => {
                    handleStatusForContent(rowData.id, rowData.active_status);
                  }}
                >
                  <LightTooltip title="Disable">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>

                <IconButton>
                  <LightTooltip title="Delete">
                    <DeleteIcon onClick={() => deleteContent(rowData.id)} />
                  </LightTooltip>
                </IconButton>
              </Paper>
              <div
                className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1} ${classes.w15}`}
              >
                <Typography
                  className={`${classes.dflex} ${classes.alignitemscenter}`}
                  variant="h6"
                >
                  {rowData.active_status === "active" ? (
                    <ActiveIcon />
                  ) : (
                    <InactiveIcon fontSize="small" />
                  )}
                  {rowData.active_status}
                </Typography>
              </div>
            </div>
          ))
        )}

        
        </div>
         <div
          className={`${classes.dflex} ${classes.justifycontentflexend} ${classes.mt1}`}
          style={{ justifyContent: "flex-end" }}
        >
          <Button
            onClick={handleSave}
            className={classes.bluebtn}
            variant="contained"
            align="right"
          >
            Save
          </Button>
        </div>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openAddContent}
          onClose={handleCreateContentOpenclose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <CreateContent
            fetchContentByNoteId={fetchContentByNoteId}
            noteId={rowId}
            handleOpenclose={handleCreateContentOpenclose}
            open={openAddContent}
            notename={notename}
          />
        </Modal>

        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openContentModal}
        onClose={closeContentModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.notescontentpopup}>
          <IconButton
            onClick={closeContentModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#000",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
              padding: "5px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
            }}
          >
            <CloseIcon style={{ fontSize: "30px" }} />
          </IconButton>

          {mediaLoading ? (
            <div className={classes.loadingSpinner}>
              <CircularProgress />
            </div>
          ) : (
            // Render media content based on file format when loading is complete
            renderMediaContent(
              contentData[selectedRowIndex]?.file_format,
              contentUrl
            )
          )}
        </div>
      </Modal>
      </div>
      </div>
    </>
  );
}

export default ViewNotesContent;
