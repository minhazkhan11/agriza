import React from "react";
import PageHeader from "../../../PageHeader";
import ViewCustomerCategory from "./ViewCustomerCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function CustomerCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Customer Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Customer Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-customer-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewCustomerCategory />
    </div>
  );
}
export default CustomerCategory;
