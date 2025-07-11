import React from "react";
import PageHeader from "../../PageHeader";
import ViewCustomers from "./ViewCustomers";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";

function Customers() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Customers",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Customers",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-customer",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewCustomers />
    </div>
  );
}
export default Customers;
