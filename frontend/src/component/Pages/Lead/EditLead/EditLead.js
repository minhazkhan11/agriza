import React from "react";
import PageHeader from "../../PageHeader";
import EditLeadForm from "./EditLeadForm";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";




function EditLead() {
  const classes = useStyles();




  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Edit Lead",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/lead-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditLeadForm />
    </div>
  );
}
export default EditLead;
