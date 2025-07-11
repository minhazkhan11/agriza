import React from "react";
import PageHeader from "../../PageHeader";
import ViewCourses from "./ViewCourses";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";


function Courses() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Courses",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Course",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-business-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewCourses />
  </div>
  );
}
export default Courses;