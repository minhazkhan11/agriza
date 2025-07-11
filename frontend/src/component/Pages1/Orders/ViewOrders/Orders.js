import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as OrdersIcon } from "../../../images/mainheadingicon/ordersicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewOrders from "./ViewOrders";


function Orders() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<OrdersIcon />,
      mainheading: "Orders",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewOrders/>
    </div>
  );
}
export default Orders;