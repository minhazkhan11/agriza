import React from "react";
import PageHeader from "../../PageHeader";
import AddExamForm from "./AddExamForm";
import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function AddExam() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ExamIcon />,
      mainheading: "Add Exam",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/exam",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddExamForm />
    </div>
  );
}
export default AddExam;
