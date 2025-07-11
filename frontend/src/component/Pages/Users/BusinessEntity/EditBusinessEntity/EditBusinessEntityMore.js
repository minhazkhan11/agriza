import React from "react";
import PageHeader from "../../../PageHeader";
import EditBusinessEntityMoreForm from "./EditBusinessEntityMoreForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";
import { useLocation } from "react-router-dom";

function EditBusinessEntityMore() {
  const classes = useStyles();
  const location = useLocation();

  const getHeading = () => {
    if (location.pathname === "/myprofile") {
      return "Business Profiling";
    }
    return "Edit Business Entity";
  };
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: getHeading(),
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/business-entity-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditBusinessEntityMoreForm />
    </div>
  );
}
export default EditBusinessEntityMore;
