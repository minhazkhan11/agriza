import React, { useState, useEffect } from "react";
import {
  Button,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { decryptData } from "../../../../crypto";

function EditSchedulePopup(props) {
  const { open, handleOpenClose, fetchData, rowId, timetableId, handleStatus } = props;
  const classes = useStyles();

  const [type, setType] = useState("classes");

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [formDetails, setFormDetails] = useState({
    title: "",
    teacher_name: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/schedule/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        const schedulesData = response.data?.shedule;

        // Updating formDetails with the timetable's details
    
        setFormDetails((prevDetails) => ({
          ...prevDetails,
          title: schedulesData?.tittle,
          teacher_name: schedulesData?.teacher_name,
          date: schedulesData?.select_date.split("T")[0],
          start_time: schedulesData?.start_time,
          end_time: schedulesData?.end_time,
        }));
        setType(schedulesData?.type);
      } else {
        toast.error("Failed to fetch schedule details.");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
      toast.error("An error occurred while fetching schedule details.");
    }
  };
  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const handleSubmit = async () => {
    if (!formDetails?.title) {
      toast.warn("Please enter a title.");
      return;
    }

    if (!formDetails?.teacher_name) {
      toast.warn("Please enter teacher name.");
      return;
    }

    if (!formDetails?.date) {
      toast.warn("Please select a date.");
      return;
    }

    if (!formDetails?.start_time?.trim()) {
      toast.warn("Please enter start time.");
      return;
    }
    if (!formDetails?.end_time?.trim()) {
      toast.warn("Please enter end time.");
      return;
    }
    const startTime = new Date(`2000-01-01T${formDetails.start_time}`);
    const endTime = new Date(`2000-01-01T${formDetails.end_time}`);

    if (endTime < startTime) {
      toast.error("End time cannot be less than start time.");
      return;
    }
    if (!type) {
      toast.warn("Please select a type.");
      return;
    }

    try {
      const scheduleData = {
        schedule: {
          id: rowId,
          time_table_id: timetableId,
          tittle: formDetails?.title,
          teacher_name: formDetails.teacher_name,
          start_time: formDetails?.start_time,
          end_time: formDetails?.end_time,
          select_date: formDetails.date,
          type: type,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/schedule/update`,
        scheduleData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Schedule updated successfully!");
        setTimeout(() => {
          handleOpenClose();
          fetchData();
        }, 2000);
      } else {
        toast.error(`Schedule is not updated! ${response.message}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Schedule is not updated!");
    }
  };

  const handleCancel = () => {
    handleOpenClose();
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Fade in={open}>
        <div className={classes.paperpopup}>
          <Button onClick={handleOpenClose} className={classes.closebtn}>
            <CloseIcon
              className={`${classes.popupclosefill} ${classes.w25px} ${classes.h25px}`}
            />
          </Button>
          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.px2} ${classes.pt1} ${classes.pb0}`}
          >
            <Typography variant="h6">Edit Schedule</Typography>
          </div>
          <FormControl
            className={`${classes.dflex} ${classes.w80} ${classes.m0auto}`}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5}`}
            >
              <FormLabel>
                Enter Title <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="title"
                value={formDetails.title}
                onChange={handleChange}
                type="text"
                variant="outlined"
                placeholder="Type Here.."
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5}`}
            >
              <FormLabel>
                Teacher Name <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="teacher_name"
                value={formDetails.teacher_name}
                onChange={handleChange}
                type="text"
                variant="outlined"
                placeholder="Type Here.."
              />
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5}`}
            >
              <FormLabel>
                Select Date <span className={classes.textcolorred}>*</span>
              </FormLabel>
              <TextField
                name="date"
                value={formDetails.date}
                onChange={handleChange}
                type="date"
                variant="outlined"
                placeholder="Type Here.."
              />
            </div>
            <div className={classes.inputcontainer}>
              <div className={classes.w49}>
                <FormLabel>
                  Start Time <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="start_time"
                  value={formDetails.start_time}
                  onChange={handleChange}
                  type="time"
                  variant="outlined"
                  defaultValue="05:30"
                />
              </div>
              <div className={classes.w49}>
                <FormLabel>
                  End Time <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="end_time"
                  value={formDetails.end_time}
                  onChange={handleChange}
                  type="time"
                  variant="outlined"
                  defaultValue="07:30"
                  inputProps={{
                    placeholder: "07",
                  }}
                />
              </div>
            </div>
            <div className={`${classes.dflex} ${classes.mt0_5} `}>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.mt0_7} ${classes.fontfamilyoutfit}  ${classes.fontSize7} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheightnormal}
              ${classes.pl0_5} ${classes.w20}
             `}
              >
                Type <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <RadioGroup
                aria-label="type"
                name="type"
                className={`${classes.dflex} ${classes.flexdirectionrow} `}
                value={type}
                onChange={handleTypeChange}
              >
                <FormControlLabel
                  className={`${classes.mr0_5}`}
                  value="classes"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      Classes
                    </Typography>
                  }
                />
                <FormControlLabel
                  className={`${classes.ml0_5} ${classes.mr0_5}`}
                  value="test"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400} `}
                    >
                      Test
                    </Typography>
                  }
                />
                <FormControlLabel
                  className={`${classes.ml0_5} ${classes.mr0_5}`}
                  value="other activity"
                  control={<Radio style={{ padding: "0.5rem" }} />}
                  label={
                    <Typography
                      className={`${classes.fontSize7} ${classes.fontfamilyoutfit} ${classes.fw400}  `}
                    >
                      Other Activity
                    </Typography>
                  }
                />
              </RadioGroup>
            </div>
            <div
              className={`${classes.my1} ${classes.dflex} ${classes.justifyspacebetween}`}
            >
              <Button
                className={`${classes.custombtnoutline} ${classes.w45}`}
                variant="contained"
                onClick={handleOpenClose}
              >
                Cancel
              </Button>
              <Button
                className={`${classes.custombtnblue} ${classes.w45}`}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </FormControl>
        </div>
      </Fade>
    </>
  );
}

export default EditSchedulePopup;
