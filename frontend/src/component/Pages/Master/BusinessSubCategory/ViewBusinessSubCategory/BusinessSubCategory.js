import React from "react";
import PageHeader from "../../../PageHeader";
import ViewBusinessSubCategory from "./ViewBusinessSubCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function BusinessSubCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Business Sub Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Business Sub Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-business-sub-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewBusinessSubCategory />
  </div>
  );
}
export default BusinessSubCategory;