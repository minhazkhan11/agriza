import React from "react";
import PageHeader from "../../PageHeader";
import ViewVendorPayments from "./ViewVendorPayments";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";

function VendorPayments() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Vendor Payments",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      // addbtntext: "Create New Payment",
      // addbtnicon: <AddIcon />,
      // addbtnstyle: "bluebtn",
      // path: "/create-zone",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewVendorPayments />
    </div>
  );
}
export default VendorPayments;
