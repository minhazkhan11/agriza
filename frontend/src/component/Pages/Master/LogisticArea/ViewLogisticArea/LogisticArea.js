import React from "react";
import PageHeader from "../../../PageHeader";
import ViewLogisticArea from "./ViewLogisticArea";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function LogisticArea() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Logistic Area",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Logistic Area",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-logistic-area",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLogisticArea />
    </div>
  );
}
export default LogisticArea;
