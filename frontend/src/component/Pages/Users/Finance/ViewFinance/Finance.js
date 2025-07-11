import React from "react";
import PageHeader from "../../../PageHeader";
import ViewBusinessEntity from "./ViewFinance";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function BusinessEntity() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Finance",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Finance",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-lending",
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