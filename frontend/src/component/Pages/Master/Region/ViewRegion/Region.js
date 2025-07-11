import React from "react";
import PageHeader from "../../../PageHeader";
import ViewRegion from "./ViewRegion";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function Region() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Region",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Region",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-region",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewRegion />
    </div>
  );
}
export default Region;
