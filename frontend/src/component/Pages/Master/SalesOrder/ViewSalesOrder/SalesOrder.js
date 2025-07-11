import React from "react";
import PageHeader from "../../../PageHeader";
import ViewSalesOrder from "./ViewSalesOrder";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function SalesOrder() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Sales Order",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Sales Order",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-sales-order",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewSalesOrder />
  </div>
  );
}
export default SalesOrder;