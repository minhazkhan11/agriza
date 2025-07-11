import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import useStyles from "../../../../../styles";

function OrderSummary({ orders }) {
  const classes = useStyles();

  return (
    <>
      <div
        className={`${classes.borderradius10px} ${classes.border1999} ${classes.mt1} ${classes.p1}`}
      >
        <Typography 
        className={`${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw500} ${classes.lightblackcolor} ${classes.mt0_5}`}
        variant="h5">Order Summary</Typography>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw500} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h5">Items Cost</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h6">₹{orders?.sub_total_item_cost}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h3">Discount</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h4">- ₹ {orders?.sub_total_discount}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h3">Shipping Cost</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h4">₹{orders?.shipping_cost}.00</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h3">Delivery Cost</Typography>
          <Typography
          
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`} variant="h4">- ₹ {orders?.delivery_cost}</Typography>
        </div>

        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography 
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
          variant="h3">Wallet Amount</Typography>
          <Typography 
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
          variant="h4">- ₹ {orders?.wallet_amount}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h3">Cashback Amount</Typography>
          <Typography 
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
          variant="h4">- ₹{orders?.cashback}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw500} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h5">Total Amount</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h6">₹{orders?.total}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h3">GST</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw400} ${classes.lightblackcolor} ${classes.mt0_5}`}
           variant="h4">₹{Math.floor(orders?.gst)} </Typography>
        </div>

        <div className={`${classes.w100} ${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween} ${classes.alignitembaseline}`}>
          <Typography 
          className={`${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500} ${classes.lightblackcolor} ${classes.mt0_5}`}
          variant="h1"> Total payment by customer</Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw400} ${classes.mt0_5} ${classes.textcolorred}`}
           variant="h2">₹{orders?.grand_total_cost}</Typography>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
