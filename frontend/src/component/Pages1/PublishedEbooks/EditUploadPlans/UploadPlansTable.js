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

import UploadPlansPopup from "./UploadPlansPopup";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios"; // Import Axios

import CloseIcon from "@material-ui/icons/Close";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

function UploadPlansTable({ ebookanme }) {
  const classes = useStyles();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const { rowId } = useParams();

  const [openAddContent, setOpenAddContent] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState();
  const [contentData, setContentData] = useState([]);

  const handleCreateContentOpenclose = () => {
    setOpenAddContent(!openAddContent);
  };

  const fetchUploadPlans = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/publishby_ebookid/${rowId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setContentData(data.upload_plans);
      } else {
        // Handle the API error here
      }
    } catch (error) {
      // Handle any other errors here
    }
  };

  useEffect(() => {
    fetchUploadPlans();
  }, []);

  const rowdataForContent = contentData
    ? contentData.map((c) => ({
        id: c?.id ? c.id : null,
        name: c?.name ? c.name : "",
        file_url: c?.file_url ? c.file_url : "",
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
      navigate("/admin/publishedebooks");
    }, 1500);
  };

  // Function to delete a book
  const deleteContent = async (contentID) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/publish/${contentID}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      fetchUploadPlans();

      toast.success("Upload Plan deleted successfully");
      const updatedBooks = contentData.filter((tpc) => tpc.id !== contentID);
      setContentData(updatedBooks);
    } catch (error) {
      toast.error("Upload Plan is not deleted");
      console.error("Error deleting tpc: ", error);
    }
  };

  const handleStatusForContent = (contentId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      upload_plan: {
        active_status: newStatus,
        id: contentId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/publish/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchUploadPlans();
        toast.success("Upload Plan status changed successfully");
      })
      .catch((error) => {
        console.error("Error changed Upload Plan status:", error);
        toast.error("Upload Plan status is not changed");
      });
  };

  const [openContentModal, setOpenContentModal] = useState(false);
  const [contentUrl, setContentUrl] = useState("");

  const openContent = (url, rowId) => {
    setContentUrl(url);
    setOpenContentModal(true);
    setSelectedRowIndex(rowId);
  };

  const closeContentModal = () => {
    setOpenContentModal(false);
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
      upload_plan: {
        payment_status: newStatus,
        id: contentId,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebook_upload_plans/publish/payment_status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Status changed successfully", response);
        fetchUploadPlans();
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
              Upload Plan Content Heading
            </Typography>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w15}`}
          >
            <Button
              className={`${classes.bgorange} ${classes.texttransformcapitalize}`}
              onClick={() => setOpenAddContent(true)} // Corrected
            >
              <EditIcon className={`${classes.mr0_5}`} />
              Add
            </Button>
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
                  {" "}
                  {rowData.name}
                </Typography>
                <Button
                  className={`${classes.boxshadow4} ${classes.bgwhite} ${classes.borderradius6px}`}
                  onClick={() => openContent(rowData.file_url, rowData.id)}
                >
                  <PictureAsPdfIcon />
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

        <div>
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
          <UploadPlansPopup
            fetchUploadPlans={fetchUploadPlans}
            ebookId={rowId}
            ebookanme={ebookanme}
            handleClosePopup={handleCreateContentOpenclose}
            open={openAddContent}
          />
        </Modal>

        {/* Modal to display content */}

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
            {/* Close icon */}
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

            {/* Display the PDF file within an iframe */}
            {contentUrl && (
              <iframe
                src={`https://docs.google.com/gview?url=${contentUrl}&embedded=true`}
                title="Document"
                style={{ width: "100%", height: "80vh" }}
                frameBorder="0"
              />
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default UploadPlansTable;
