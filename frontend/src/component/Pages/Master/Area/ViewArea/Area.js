import React from "react";
import PageHeader from "../../../PageHeader";
import ViewArea from "./ViewArea";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function Area() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Area",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Area",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-area",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewArea />
    </div>
  );
}
export default Area;
