import React from "react";
import PageHeader from "../../../PageHeader";
import ViewBusinessCategory from "./ViewBusinessCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function BusinessCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Business Segment",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Business Segment",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-business-segment",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewBusinessCategory />
  </div>
  );
}
export default BusinessCategory;