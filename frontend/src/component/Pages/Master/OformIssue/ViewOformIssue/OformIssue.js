import React from "react";
import PageHeader from "../../../PageHeader";
import ViewOformIssue from "./ViewOformIssue";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function OformIssue() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "O-form Issue",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New O-form-Issue",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-oform",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewOformIssue />
  </div>
  );
}
export default OformIssue;