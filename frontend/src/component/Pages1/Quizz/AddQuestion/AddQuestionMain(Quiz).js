import React from "react";
import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";

import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import AddQuestion from "./AddQuestionTab(Quiz)";


function AddQuestionMainQuiz() {
  const classes = useStyles();
  // const Heading = [
  //   {
  //     id: 1,
  //     pageicon: <ExamIcon />,
  //     mainheading: "Exam",
  //     addbtntext: "Create New Exam",
  //     addbtnicon: <AddIcon />,
  //     addbtnstyle: "bluebtn",
  //     path: "/admin/addexam",
  //   },
  // ];

  const Heading = [
    {
      id: 1,
      logo: ExamLogo,
      path: "/admin/quizz",
      headings: [
        {
          id: 11,
          label: "Name",
          content: "SSC CHSL",
        },
        {
          id: 12,
          label: "Subject",
          content: "History",
        },
        {  
          id: 13,
        label: "Course",
          content: "SSC CHSL",
        },
        {
          id: 14,
          label: "Batch",
          content: "SSC CHSL",
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
export default AddQuestionMainQuiz;

