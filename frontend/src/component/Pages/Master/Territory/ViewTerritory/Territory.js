import React from "react";
import PageHeader from "../../../PageHeader";
import ViewTerritory from "./ViewTerritory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function Territory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Territory",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Territory",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-territory",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewTerritory />
    </div>
  );
}
export default Territory;
