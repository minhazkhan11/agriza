import React from "react";
import PageHeader from "../../../PageHeader";
import EditRackPointForm from "./EditRackPointForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";




function EditRackPoint() {
  const classes = useStyles();




  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Edit Rack Point",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/rack-point-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditRackPointForm />
    </div>
  );
}
export default EditRackPoint;
