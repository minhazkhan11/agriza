import React from "react";
import PageHeader from "../../PageHeader";
import EditTeacherForm from "./EditTeacherForm";
import { ReactComponent as TeachersIcon } from "../../../images/teachersimage/teachersicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function EditTeacher() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TeachersIcon />,
      mainheading: "Edit Teacher",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/teacher",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <EditTeacherForm />
    </div>
  );
}
export default EditTeacher;
