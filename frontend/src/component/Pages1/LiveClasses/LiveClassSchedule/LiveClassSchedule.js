import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import ViewLiveClassSchedule from "./ViewLiveClassSchedule";

function LiveClassSchedule() {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [liveClassesDetails, setLiveClassesDetails] = useState({
    id: "",
    liveClassName: "",
    subjects: "",
    course: "",
    batch: "",
    logo: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/${rowId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          const liveClassData = response?.data?.liveclassData;

          setLiveClassesDetails({
            id: liveClassData?.id,
            liveClassName: liveClassData?.live_class_name,
            subjects: liveClassData?.subject.subject_name,
            course: liveClassData?.course.course_name,
            batch: liveClassData?.batch.batch_name,
            logo: liveClassData?.image_url,
            start_date: liveClassData?.start_date,
            end_date: liveClassData?.end_date,
          });
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchDataFromAPI();
  }, [rowId, decryptedToken]);

  const Heading = [
    {
      id: 1,
      logo: liveClassesDetails.logo,
      path: "/admin/liveclasses",
      headings: [
        {
          id: 11,
          label: "Name",
          content: liveClassesDetails.liveClassName,
        },
        {
          id: 12,
          label: "Subject",
          content: liveClassesDetails.subjects,
        },
        {
          id: 13,
          label: "Course",
          content: liveClassesDetails.course,
        },
        {
          id: 14,
          label: "Batch",
          content: liveClassesDetails.batch,
        },
      ],
    },
  ];


  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <QuestionHead Heading={Heading} />
      <ViewLiveClassSchedule liveClassesDetails={liveClassesDetails} />
    </div>
  );
}

export default LiveClassSchedule;
