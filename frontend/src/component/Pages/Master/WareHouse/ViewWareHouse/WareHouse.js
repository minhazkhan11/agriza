import React from "react";
import PageHeader from "../../../PageHeader";
import ViewWareHouse from "./ViewWareHouse";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import { useLocation } from "react-router-dom";

function WareHouse() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Warehouse",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Warehouse",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-warehouse",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewWareHouse />
    </div>
  );
}
export default WareHouse;
