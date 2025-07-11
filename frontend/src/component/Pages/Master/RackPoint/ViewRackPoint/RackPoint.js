import React from "react";
import PageHeader from "../../../PageHeader";
import ViewRackPoint from "./ViewRackPoint";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function RackPoint() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Rack Point",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Rack Point",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-rack-point",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewRackPoint />
  </div>
  );
}
export default RackPoint;