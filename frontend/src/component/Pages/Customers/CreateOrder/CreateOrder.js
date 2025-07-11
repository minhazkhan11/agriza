import React from "react";
import PageHeader from "../../PageHeader";
import CreateOrderView from "./CreateOrderView";
import { ReactComponent as Orders } from "../../../images/mainheadingicon/Orders.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
function CreateOrder() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const cartData = location.state;

  const Heading = [
    {
      id: 1,
      // pageicon: <Orders />,
      mainheading: "Create Order",
      companyname: cartData.rowData.value,

      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: cartData.type === "vendor" ? "/vendor-list" : "/customer-list",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <div className={`${classes.pagescroll} ${classes.h76max}`}>
        <CreateOrderView cartData={cartData} />
        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            onClick={() => navigate("/checkout-view")}
            className={`${classes.custombtnblue}`}
          >
            Proceed To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
export default CreateOrder;
