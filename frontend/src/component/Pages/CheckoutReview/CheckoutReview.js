import React from "react";
import PageHeader from "../PageHeader";
import CheckoutView from "./CheckoutView";
import { ReactComponent as BackIcon } from "../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../styles";

function CheckoutReview() {
  const classes = useStyles();
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

  const Heading = [
    {
      id: 1,
      mainheading: "Review",
      companyname: customerDetails?.value,
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/customer-list",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <CheckoutView />
    </div>
  );
}
export default CheckoutReview;
