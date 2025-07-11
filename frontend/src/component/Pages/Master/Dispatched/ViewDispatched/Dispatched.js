import React from "react";
import PageHeader from "../../../PageHeader";
import ViewDispatched from "./ViewDispatched";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function Dispatched() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Dispatched",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Dispatched",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-dispatched",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewDispatched />
  </div>
  );
}
export default Dispatched;