import React, {useState} from "react";
import useStyles from "../../../../styles";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import { Button, Divider, Typography, Modal, Backdrop } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { ReactComponent as OrangeDot } from "../../../images/TimetableIcon/orangedot.svg";
import { ReactComponent as GreenDot } from "../../../images/TimetableIcon/greendot.svg";
import { ReactComponent as SkyDot } from "../../../images/TimetableIcon/skydot.svg";
import { ReactComponent as GreyDot } from "../../../images/TimetableIcon/greydot.svg";
import { ReactComponent as RedDot } from "../../../images/TimetableIcon/reddot.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import AddSchedulePopup from "./AddSchedulePopup";

function TimeTableHeader({ timetableData, fetchScheduleData }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const startDate = new Date(timetableData?.start_date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );
  const endDate = new Date(timetableData?.end_date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );

  function formatTotalDaysAvailable(totalDays) {
    const months = Math.floor(totalDays / 30); // Assuming 30 days per month
    const remainingDays = totalDays % 30;

    let result = "";

    if (months > 0) {
      result += `${months} month${months > 1 ? "s" : ""}`;
    }

    if (remainingDays > 0) {
      if (result !== "") {
        result += " ";
      }
      result += `${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
    }

    return result;
  }

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setOpen(!open);
  };


  return (
    <>
      <div className={`${classes.p1} ${classes.bgwhite} ${classes.boxshadow3}`}>
        <div
          className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
        >
          <Typography
            className={`${classes.fontsize5} ${classes.fontfamilyDMSans} ${classes.fw700}`}
          >
            {timetableData?.batch?.batch_name}
          </Typography>
          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.w47}`}
          >
            <div>
              <GreyDot className={`${classes.mr0_5}`} />
              <Typography
                component="span"
                className={`${classes.fontsize3} ${classes.fontfamilyDMSans} ${classes.fw500}`}
              >
                Upcoming
              </Typography>
            </div>
            <div>
              <OrangeDot className={`${classes.mr0_5}`} />
              <Typography
                component="span"
                className={`${classes.fontsize3} ${classes.fontfamilyDMSans} ${classes.fw500}`}
              >
                Reschedule
              </Typography>
            </div>
            <div>
              <RedDot className={`${classes.mr0_5}`} />
              <Typography
                component="span"
                className={`${classes.fontsize3} ${classes.fontfamilyDMSans} ${classes.fw500}`}
              >
                Unprocessed
              </Typography>
            </div>
            <div>
              <GreenDot className={`${classes.mr0_5}`} />
              <Typography
                component="span"
                className={`${classes.fontsize3} ${classes.fontfamilyDMSans} ${classes.fw500}`}
              >
                Completed
              </Typography>
            </div>
            <div>
              <SkyDot className={`${classes.mr0_5}`} />
              <Typography
                component="span"
                className={`${classes.fontsize3} ${classes.fontfamilyDMSans} ${classes.fw500}`}
              >
                Underprocess
              </Typography>
            </div>
          </div>
        </div>
        <div
          className={`${classes.mt1} ${classes.w37} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
        >
          <Typography
            component="span"
            className={`${classes.textcolorgreen} ${classes.bggreen} ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600} ${classes.py0_2x0_5}`}
          >
            Batch Starts :
          </Typography>
          <Typography
            component="span"
            className={` ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600}`}
          >
            {startDate}
          </Typography>
          <Typography
            component="span"
            className={` ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600}`}
          >
            TO
          </Typography>
          <Typography
            component="span"
            className={` ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600}`}
          >
            {endDate}
          </Typography>
        </div>
        <div
          className={`${classes.mt1} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
        >
          <div
            className={` ${classes.w65} ${classes.dflex} ${classes.alignitemscenter}`}
          >
            <div
              className={`${classes.mt1} ${classes.w40} ${classes.dflex} ${classes.alignitemscenter}`}
            >
              <Typography
                component="span"
                className={`${classes.textcolorblue1} ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600} ${classes.py0_2x0_5}`}
              >
                Total Time :
              </Typography>
              <Typography
                component="span"
                className={` ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500}`}
              >
                {formatTotalDaysAvailable(timetableData?.total_days_available)}
              </Typography>
            </div>
            <Divider
              className={`${classes.mx1} ${classes.dividerheight} ${classes.mt1}`}
              orientation="vertical"
              flexItem
            />
            <div
              className={`${classes.mt1} ${classes.w45} ${classes.dflex} ${classes.alignitemscenter}`}
            >
              <Typography
                component="span"
                className={`${classes.textcolorblue1} ${classes.fontfamilyDMSans} ${classes.fontsize6} ${classes.fw600} ${classes.py0_2x0_5}`}
              >
                Training Days :
              </Typography>
              <Typography
                component="span"
                className={` ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500}`}
              >
                {formatTotalDaysAvailable(timetableData?.total_training_days)}
              </Typography>
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenClose}
              className={`${classes.bluebtn}`}
            >
              <AddIcon />
              Create New Schedule
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/timetable")}
              className={classes.transparentbtn}
            >
              <BackIcon />
              Back
            </Button>
          </div>
        </div>
      </div>
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <AddSchedulePopup
          handleOpenClose={handleOpenClose}
          open={open}
          rowId={timetableData?.id}
          fetchScheduleData={fetchScheduleData}
          timetableData={timetableData}
        />
      </Modal>
    </>
  );
}
export default TimeTableHeader;
