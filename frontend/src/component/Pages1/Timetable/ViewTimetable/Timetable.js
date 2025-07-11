import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TimetableIcon } from "../../../images/TimetableIcon/calendericon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewTimetable from "./ViewTimetable";


function Timetable() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<TimetableIcon />,
      mainheading: "Time Table",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Add Time Table",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addtimetable",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading}/>
      <ViewTimetable/>
    </div>
  );
}
export default Timetable;