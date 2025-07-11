import React, { useState, useEffect } from "react";

import useStyles from "../../../../styles";
import {
  Backdrop,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  withStyles,
  Modal,
} from "@material-ui/core";
import CastForEducationIcon from "@material-ui/icons/CastForEducation";
import { ReactComponent as EditIcon } from "../../../images/NotesImage/editicon.svg";
import DeleteIcon from "@material-ui/icons/Delete";
import { decryptData } from "../../../../crypto";
import { useNavigate, useParams } from "react-router-dom";

import CreateSchedule from "./CreateSchedule";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios"; // Import Axios

function ScheduleList({ liveClassesDetails }) {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [openAddContent, setOpenAddContent] = useState(false);

  const [contentData, setContentData] = useState([]);
  const handleOpenClose = () => {
    setOpenAddContent(!openAddContent);
  };

  const fetchScheduleByLiveClassId = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/publish/liveclass/${rowId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setContentData(data?.liveclassData?.lectures);
      } else {
        // Handle the API error here
      }
    } catch (error) {
      // Handle any other errors here
    }
  };

  useEffect(() => {
    fetchScheduleByLiveClassId();
  }, []);

  const getFormattedTime = (time) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const formattedTime = date?.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  };
  const rowdataForContent = contentData
    ? contentData.map((v, i) => ({
        id: v?.id ? v.id : null,
        srno: i + 1,
        heading: v?.topic_name ? v.topic_name : "",
        date: v?.date
          ? new Date(v.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
        start_time: v?.start_time ? getFormattedTime(v.start_time) : "",
        end_time: v?.end_time ? getFormattedTime(v.end_time) : "",
        active_status: v?.active_status ? v.active_status : "",
      }))
    : [];

  const handleSave = () => {
    toast.success("Saved successfully", {
      position: "top-right",
      hideProgressBar: true,
    });
    setTimeout(() => {
      navigate("/admin/liveclasses");
    }, 1500);
  };

  const deleteContent = async (scheduleID) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasslectures/publish/${scheduleID}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      fetchScheduleByLiveClassId();

      toast.success("Schedule deleted successfully");
      const updatedSchedules = contentData.filter((tpc) => tpc.id !== scheduleID);
      setContentData(updatedSchedules);
    } catch (error) {
      toast.error("Schedule is not deleted");
      console.error("Error deleting tpc: ", error);
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

  return (
    <>
      <ToastContainer />

      <div className={` ${classes.mt1}`}>
        <div
          className={`${classes.boxshadow3} ${classes.bgwhite} ${classes.mt1} ${classes.p1}`}
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
                Live Class Name: {liveClassesDetails?.liveClassName}
              </Typography>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w10}`}
            >
              <Button
                className={`${classes.bgorange} ${classes.texttransformcapitalize}`}
                onClick={handleOpenClose}
              >
                <EditIcon className={`${classes.mr0_5}`} />
                Add
              </Button>
            </div>
          </div>
          <div className={`${classes.showscroll} ${classes.h46vh}`}>
            {rowdataForContent.length === 0 ? (
              <Typography variant="h6">
                Oops... ! No schedule available for this live class right now .
              </Typography>
            ) : (
              rowdataForContent.map((data, i) => (
                <div
                  className={`${classes.bgskylite} ${classes.borderbottom1}  ${classes.py0_5x1} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w32}`}
                  >
                    <Typography>{`${data.srno}) ${data.heading}`}</Typography>
                  </div>

                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.w40}`}
                  >
                    <Typography>Date - {data.date}</Typography>
                    <Typography>
                      {data.start_time} to {data.end_time}
                    </Typography>
                  </div>

                  <Paper>
                    <IconButton>
                      <LightTooltip title="Delete">
                        <DeleteIcon
                        onClick={() => deleteContent(data.id)}
                        />
                      </LightTooltip>
                    </IconButton>
                  </Paper>
                </div>
              ))
            )}
          </div>
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
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <CreateSchedule
            handleOpenClose={handleOpenClose}
            open={openAddContent}
            fetchScheduleByLiveClassId={fetchScheduleByLiveClassId}
            liveClassesDetails={liveClassesDetails}
          />
        </Modal>
      </div>
    </>
  );
}

export default ScheduleList;
