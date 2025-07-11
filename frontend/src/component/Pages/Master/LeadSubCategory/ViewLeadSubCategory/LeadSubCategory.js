import React from "react";
import PageHeader from "../../../PageHeader";
import ViewLeadSubCategory from "./ViewLeadSubCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function LeadSubCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Lead Sub Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Lead Sub Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-lead-sub-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLeadSubCategory />
    </div>
  );
}
export default LeadSubCategory;
