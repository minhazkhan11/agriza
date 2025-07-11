import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewExam from "./ViewExam";


function Exam() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<ExamIcon />,
      mainheading: "Exam",
      addbtntext:"Create New Exam",
      downloadexam:'true',
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addexam",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewExam/>
    </div>
  );
}
export default Exam;