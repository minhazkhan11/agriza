import React, { useState, useEffect } from "react";
import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { Modal, Backdrop, Typography } from "@material-ui/core";
import axios from "axios";
import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import useStyles from "../../../../styles";
import TimetableHeader from "./TimeTableHeader";
import TableSchedulingList from "./TableSchedulingList";
import { Button } from "@material-ui/core";
import AddSchedulePopup from "./AddSchedulePopup";
import CustomCalender from "./CustomCalender";
import { decryptData } from "../../../../crypto";
import { useParams } from "react-router-dom";

function TimetableSettings() {
  const classes = useStyles();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [open, setOpen] = useState(false);
  const { rowId } = useParams();

  const handleOpenClose = (data) => {
    setOpen(!open);
  }
  
  const [timetableData, setTimetableData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/timetable/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setTimetableData(response?.data?.timetable);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const [scheduleData, setScheduleData] = useState([]);

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/schedule/by_timetableId/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setScheduleData(response.data?.shedule);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    fetchScheduleData();
  }, []);

  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes.pagescroll} ${classes.h90vh}`}
    >
      <TimetableHeader timetableData={timetableData} fetchScheduleData = {fetchScheduleData} />
      <TableSchedulingList fetchScheduleData={fetchScheduleData} scheduleData={scheduleData} setScheduleData={setScheduleData} timetableData={timetableData} />
    </div>
  );
}
export default TimetableSettings;
