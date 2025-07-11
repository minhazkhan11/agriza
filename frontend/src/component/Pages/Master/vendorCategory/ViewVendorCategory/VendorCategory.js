import React from "react";
import PageHeader from "../../../PageHeader";
import ViewVendorCategory from "./ViewVendorCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function VendorCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Vendor Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Vendor Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-vendor-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewVendorCategory />
    </div>
  );
}
export default VendorCategory;
