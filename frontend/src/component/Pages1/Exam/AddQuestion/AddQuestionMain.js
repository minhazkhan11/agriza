import React , {useEffect, useState} from "react";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import AddQuestion from "./AddQuestionTab";

import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";

function AddQuestionMain() {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [questionsCount, setQuestionsCount] = useState("");
  const [examDetails, setExamDetails] = useState({
    examName: '',
    courseName: '',
    batchName: '',
    subjectNames: '',
    examImage: '',
  });

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/${rowId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
  
        const exam = response.data.exam;
        const subjectNames = exam.subjects.map(sub => sub.subject_name).join(', ');
        setQuestionsCount(exam.question_count);
        setExamDetails({
          examName: exam.exam_name,
          courseName: exam.course.course_name,
          batchName: exam.batch.batch_name,
          subjectNames: subjectNames,
          examImage: exam.image_url,
        });
      } catch (error) {
        console.error("Error fetching exam data: ", error);
      }
    };
  
    fetchExamData();
  }, [rowId, decryptedToken]);
  


  const Heading = [
    {
      id: 1,
      logo: examDetails.examImage,
      path: "/admin/exam",
      headings: [
        {
          id: 11,
          label: "Name",
          content: examDetails.examName,
        },
        // {
        //   id: 12,
        //   label: "Subject",
        //   content: examDetails.subjectNames,
        // },
        {
          id: 13,
          label: "Course",
          content: examDetails.courseName,
        },
        {
          id: 14,
          label: "Batch",
          content: examDetails.batchName,
        },
      ]
    },
  ];


  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <QuestionHead  Heading={Heading}/>
      <AddQuestion questionsCount={questionsCount} />

    </div>
  );
}
export default AddQuestionMain;
