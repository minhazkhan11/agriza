import React from "react";
import PageHeader from "../../PageHeader";
import ViewVendorActivity from "./ViewVendorActivity";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";

function VendorActivity() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Vendor Activity",
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
      <ViewVendorActivity />
    </div>
  );
}
export default VendorActivity;
