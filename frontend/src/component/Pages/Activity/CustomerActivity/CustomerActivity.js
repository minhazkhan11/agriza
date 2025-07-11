import React from "react";
import PageHeader from "../../PageHeader";
import ViewCustomerActivity from "./ViewCustomerActivity";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";

function CustomerActivity() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Customer Activity",
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
      <ViewCustomerActivity />
    </div>
  );
}
export default CustomerActivity;
