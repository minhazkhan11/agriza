import React from "react";
import PageHeader from "../../PageHeader";
import EditExamForm from "./EditExamForm";
import { ReactComponent as ExamIcon } from "../../../images/subjectimage/subjecticon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function EditExam() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<ExamIcon />,
      mainheading: "Edit Exam details",
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
      <EditExamForm />
    </div>
  );
}
export default EditExam;
