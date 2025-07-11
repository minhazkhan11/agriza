import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as SubjectIcon } from "../../../images/subjectimage/subjecticon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewSubject from "./ViewSubject";


function Subject() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<SubjectIcon />,
      mainheading: "Subject",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Subject",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addsubject",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewSubject/>
    </div>
  );
}
export default Subject;