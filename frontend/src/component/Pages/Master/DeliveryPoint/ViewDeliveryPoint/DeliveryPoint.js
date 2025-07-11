import React from "react";
import PageHeader from "../../../PageHeader";
import ViewDeliveryPoint from "./ViewDeliveryPoint";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function DeliveryPoint() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Delivery Point",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Delivery Point",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-delivery-point",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewDeliveryPoint />
    </div>
  );
}
export default DeliveryPoint;
