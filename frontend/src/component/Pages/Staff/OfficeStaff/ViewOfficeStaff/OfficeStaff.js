import React from "react";
import PageHeader from "../../../PageHeader";
import ViewOfficeStaff from "./ViewOfficeStaff";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function OfficeStaff() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Office Staff",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Office Staff",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-staff",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewOfficeStaff />
  </div>
  );
}
export default OfficeStaff;