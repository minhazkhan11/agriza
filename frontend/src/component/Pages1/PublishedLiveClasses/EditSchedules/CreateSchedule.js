import React, { useState } from "react";
import {
  Button,
  Divider,
  Fade,
  FormControl,
  FormLabel,
  TextField,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";

function CreateSchedule({ open, handleOpenClose, fetchScheduleByLiveClassId, liveClassesDetails }) {
  const classes = useStyles();

  const initialData = {
    topic: "",
    date: "",
    start_time: "",
    end_time: "",
  };
  const [formDetails, setFormDetails] = useState(initialData);

  console.log("formDetails", formDetails) 
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formDetails.topic) {
        toast.error("Please Enter Topic Name");
        return;
      }
      if (!formDetails.date) {
        toast.error("Please Enter Date");
        return;
      }
      if (!formDetails.start_time) {
        toast.error("Please Enter Start Time");
        return;
      }
      if (!formDetails.end_time) {
        toast.error("Please Enter End Time");
        return;
      }

      let lectureData;

      lectureData = {
        lecture: {
          live_classes_id: liveClassesDetails?.id,
          topic_name: formDetails.topic,
          date: formDetails.date,
          start_time: formDetails.start_time,
          end_time: formDetails.end_time,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/add/lecture`,
        lectureData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Schedule created successfully!");
        fetchScheduleByLiveClassId(liveClassesDetails?.id);
        handleOpenClose();
      } else {
        toast.error("Schedule is not created!");
      }
    } catch (error) {
      console.error("An error occurred:", error.response.data);
      let errorMessage = "Schedule is not created!";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <ToastContainer />
      <Fade in={open}>
        <div className={`${classes.ordersmodal} ${classes.w45}`}>
          <Button onClick={handleOpenClose} className={classes.closeIcon}>
            <CloseIcon />
          </Button>
          <div>
            <Typography
              className={`${classes.fontsize} ${classes.fontfamilyoutfit} ${classes.fw600}`}
              variant="h2"
            >
              Create Schedule
            </Typography>
          </div>
          <Divider className={classes.dottedhr} />

          <FormControl
            className={` ${classes.w100} ${classes.maxh65} ${classes.pagescroll} ${classes.inputpadding} ${classes.inputborder}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Topic
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="text"
                  required
                  variant="outlined"
                  value={formDetails.topic}
                  onChange={(e) => handleFormChange("topic", e.target.value)}
                  placeholder="Enter Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Date <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="date"
                  required
                  variant="outlined"
                  value={formDetails.date}
                  onChange={(e) => handleFormChange("date", e.target.value)}
                  placeholder="Enter Here"
                  inputProps={{
                  min: liveClassesDetails.start_date.split("T")[0],
                  max: liveClassesDetails.end_date.split("T")[0],
                }}
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Start Time
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="time"
                  required
                  variant="outlined"
                  value={formDetails.start_time}
                  onChange={(e) =>
                    handleFormChange("start_time", e.target.value)
                  }
                  placeholder="Enter Here"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  End Time <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  type="time"
                  required
                  variant="outlined"
                  value={formDetails.end_time}
                  onChange={(e) => handleFormChange("end_time", e.target.value)}
                  placeholder="Enter Here"
                />
              </div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt2}`}
            >
              <Button
                onClick={handleSubmit}
                className={`${classes.bluebtn} ${classes.w20}`}
              >
                Submit
              </Button>
            </div>
          </FormControl>
        </div>
      </Fade>
    </>
  );
}

export default CreateSchedule;
