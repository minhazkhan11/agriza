import React, { useEffect, useState } from "react";
import { ReactComponent as FeedbackIcon } from "../../../images/mainheadingicon/feedback.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import PageHeader from "../../PageHeader";
import ViewReceivedFeedback from "./ViewReceivedFeedback";
import axios from "axios";
import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";

function ReceivedFeedbacks() {
  const classes = useStyles();
const [feedBack,setFeedBack]=useState();
const {rowId}=useParams();
const decryptedToken = decryptData(sessionStorage.getItem("token"));

console.log("feedBack", feedBack);
  const PageHeading = [
    {
      id: 1,
      pageicon: <FeedbackIcon />,
      mainheading: "List of Received Feedback",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/feedback",
    },
  ];
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/feedback/response/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setFeedBack(response.data.feedback);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rowId]);
  const QuestionHeading = [
    {
      id: 1,
      // logo: ExamLogo,
      // path: "/admin/feedback",
      headings: [
        {
          id: 11,
          label: "Course Name",
          content: feedBack?.course?.course_name,
        },
        {
          id: 12,
          label: "Batch",
          content: feedBack?.batch?.batch_name,
        },
        {
          id: 13,
          label: "Subject",
          content: feedBack?.subject?.subject_name,
        },
        {
          id: 13,
          label: "Teacher",
          content: feedBack?.teacher?.full_name,
        },
        {
          id: 14,
          label: "Scheduled Date",
          content: feedBack?.schedule_date ? (() => {
            const date = new Date(feedBack.schedule_date);
            const monthString = date.toLocaleString('default', { month: 'long' });
            return `${monthString} ${date.getDate()}, ${date.getFullYear()}`;
          })() : "N/A"
        },
      ],
    },
  ];

 

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={PageHeading} />
      <div className={classes.mt1}>
        <QuestionHead Heading={QuestionHeading} />
      </div>
      <div className={classes.mt1}>
        <ViewReceivedFeedback feedBack={feedBack} />
      </div>
    </div>
  );
}
export default ReceivedFeedbacks;
