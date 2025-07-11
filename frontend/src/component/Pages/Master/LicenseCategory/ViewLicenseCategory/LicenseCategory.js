import React from "react";
import PageHeader from "../../../PageHeader";
import ViewLicenseCategory from "./ViewLicenseCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function LicenseCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "License Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New License Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-license-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewLicenseCategory />
  </div>
  );
}
export default LicenseCategory;