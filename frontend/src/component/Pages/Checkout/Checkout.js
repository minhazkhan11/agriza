import React from "react";
import PageHeader from "../PageHeader";
import { ReactComponent as BackIcon } from "../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../styles";
import CheckoutForm from "./CheckoutForm";
function Checkout() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      mainheading: "Checkout",
      // addbtntext: "Back",
      // addbtnicon: <BackIcon />,
      // addbtnstyle: "transparentbtn",
      // path: "/customer-list",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <CheckoutForm />
    </div>
  );
}
export default Checkout;
