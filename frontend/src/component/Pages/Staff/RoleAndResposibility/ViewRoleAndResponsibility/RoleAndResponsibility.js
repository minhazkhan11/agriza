import React from "react";
import PageHeader from "../../../PageHeader";
import ViewRoleAndResponsibility from "./ViewRoleAndResponsibility";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function RoleAndResponsibility() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Roles & Responsbility",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Roles",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-roles",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewRoleAndResponsibility />
  </div>
  );
}
export default RoleAndResponsibility;