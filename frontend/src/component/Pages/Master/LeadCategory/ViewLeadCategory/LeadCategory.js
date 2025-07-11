import React from "react";
import PageHeader from "../../../PageHeader";
import ViewLeadCategory from "./ViewLeadCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function LeadCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Lead Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Lead Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-lead-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLeadCategory />
    </div>
  );
}
export default LeadCategory;
