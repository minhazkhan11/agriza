import React from "react";
import PageHeader from "../../../PageHeader";
import AddOfficeStaffForm from "./AddOfficeStaffForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";
import { useLocation } from "react-router-dom";

function AddOfficeStaff() {
  const classes = useStyles();
  const location = useLocation();

  const getHeading = () => {
    if (location.pathname === "/profile") {
      return "My Profile";
    }
    return "Create Office Staff";
  };

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: getHeading(),
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: location.pathname === "/profile" ? "" : "Back",
      addbtnicon: location.pathname === "/profile" ? "" : <BackIcon />,
      addbtnstyle: location.pathname === "/profile" ? "" : "transparentbtn",
      path: location.pathname === "/profile" ? "/dashboard" : "/staff-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddOfficeStaffForm />
    </div>
  );
}
export default AddOfficeStaff;
