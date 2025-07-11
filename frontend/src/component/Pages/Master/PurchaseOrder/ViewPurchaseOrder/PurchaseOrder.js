import React from "react";
import PageHeader from "../../../PageHeader";
import ViewPurchaseOrder from "./ViewPurchaseOrder";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function PurchaseOrder() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Purchase Order",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Purchase Order",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-purchase-order",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewPurchaseOrder />
  </div>
  );
}
export default PurchaseOrder;