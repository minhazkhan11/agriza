import React from "react";
import PageHeader from "../../../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as ShipToPartyIcon } from "../../../../images/headericon/warehouseicon.svg";
import useStyles from "../../../../../styles";
import AddDeliveryPointForm from "./AddDeliveryPointForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddDeliveryPoint() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ShipToPartyIcon />,
      mainheading: "Add Delivery Point",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/delivery-point-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddDeliveryPointForm />
    </div>
  );
}
export default AddDeliveryPoint;
