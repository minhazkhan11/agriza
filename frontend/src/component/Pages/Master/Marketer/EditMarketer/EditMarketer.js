import React from "react";
import PageHeader from "../../../PageHeader";
import EditMarketerForm from "./EditMarketerForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";




function EditMarketer() {
  const classes = useStyles();




  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Edit Marketer",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/marketer-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditMarketerForm />
    </div>
  );
}
export default EditMarketer;
