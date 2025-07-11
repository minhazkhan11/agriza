import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TimetableIcon } from "../../../images/TimetableIcon/calendericon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import EditTimetableForm from "./EditTimetableForm";

function EditTimetable() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TimetableIcon />,
      mainheading: "Edit Time Table",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/timetable",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <EditTimetableForm />
    </div>
  );
}
export default EditTimetable;
