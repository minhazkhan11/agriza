import React from "react";
import PageHeader from "../../../PageHeader";
import ViewBusinessEntity from "./ViewBusinessEntity";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function BusinessEntity() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Business Entity",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Business Entity",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-business-entity",
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