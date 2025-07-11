import React from "react";
import PageHeader from "../../../PageHeader";
import ViewBusinessEntity from "./ViewLogistic";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function BusinessEntity() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Logistics",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Logistics",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-logistics",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewBusinessEntity />
  </div>
  );
}
export default BusinessEntity;