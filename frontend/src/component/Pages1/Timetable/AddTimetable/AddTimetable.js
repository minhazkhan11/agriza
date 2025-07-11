import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TimetableIcon } from "../../../images/TimetableIcon/calendericon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import AddTimetableForm from "./AddTimetableForm";

function AddTimetable() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TimetableIcon />,
      mainheading: "Time Table",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/timetable",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddTimetableForm />
    </div>
  );
}
export default AddTimetable;
