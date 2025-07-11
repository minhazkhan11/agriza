import React from "react";
import PageHeader from "../../PageHeader";
import AddSubjectForm from "./AddSubjectForm";
import { ReactComponent as SubjectIcon } from "../../../images/subjectimage/subjecticon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function AddSubject() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <SubjectIcon />,
      mainheading: "Add Subject",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/subject",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddSubjectForm />
    </div>
  );
}
export default AddSubject;
