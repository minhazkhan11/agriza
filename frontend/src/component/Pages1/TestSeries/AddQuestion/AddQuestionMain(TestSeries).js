import React , {useEffect, useState} from "react";

import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";

import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import AddQuestion from "./AddQuestionTab(TestSeries)";



import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";



function AddQuestionMainTestSeries() {
  const classes = useStyles();



  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [questionsCount, setQuestionsCount] = useState("");

  const [testSeriesLogo, setTestSeriesLogo] = useState("");



  const [testSeriesDetails, setTestSeriesDetails] = useState({
    testSeriesName: '',
    start_time: '',
    start_date: '',
  });

  useEffect(() => {
    const fetchtestSeriesdata = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/${rowId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
  
        const testSeriesDDD = response.data.test_series;
  
        setQuestionsCount(testSeriesDDD.question_count);
        setTestSeriesLogo(testSeriesDDD.image_url);
  
        // Format date
        const date = new Date(testSeriesDDD.start_date);
        const formattedDate = date.toLocaleDateString('en-US', {
          day: 'numeric', // numeric, 2-digit
          month: 'short', // numeric, 2-digit, long, short, narrow
          year: 'numeric', // numeric, 2-digit
        });
  
        // Format time
        const time = new Date('1970-01-01T' + testSeriesDDD.start_time + 'Z');
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
  
        setTestSeriesDetails({
          testSeriesName: testSeriesDDD.name,
          start_time: formattedTime,
          start_date: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching testSeriesDDD data: ", error);
      }
    };
  
    fetchtestSeriesdata();
  }, [rowId, decryptedToken]);
  
  

  const Heading = [
    {
      id: 1,
      logo: testSeriesLogo,
      path: "/admin/quizz",
      headings: [
        {
          id: 11,
          label: "Test Series Name",
          content: testSeriesDetails.testSeriesName,

        },
        // {
        //   id: 12,
        //   label: "Subject",
        //   content: "History",
        // },
        {  
          id: 13,
          label: "Test Series Date",
          content: testSeriesDetails.start_date,
        },
        {
          id: 14,
          label: "Test Series Start Time",
          content: testSeriesDetails.start_time,
        },
      ]
    },
  ];
  
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <QuestionHead Heading={Heading}/>
      <AddQuestion />
    </div>
  );
}
export default AddQuestionMainTestSeries;

