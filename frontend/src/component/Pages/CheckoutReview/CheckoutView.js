import React, { useState, useEffect } from "react";
import TableViewSearch from "../../CustomComponent/TableViewSearch";
import useStyles from "../../../styles";
import {
  Button,
  CardMedia,
  Paper,
  Popover,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";

import { decryptData } from "../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useCartLive from "../../Menu/useCartLive";
import Paella from "../../images/paella.jpg";
import CheckoutProductCard from "./CheckoutProductCard";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutProductCardVendor from "./CheckoutProductCardVendor";

function CheckoutView() {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const customerDetails = JSON.parse(sessionStorage.getItem("customerDetails"));
  const navigate = useNavigate();
  const cartData = useCartLive();
  const cartState = JSON.parse(sessionStorage.getItem("cartstate"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const finalTotalAmount = parseFloat(
    sessionStorage.getItem("finalTotalAmount")
  );
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cartData || []);
  }, [cartData]);

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, i) => i !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cartstate", JSON.stringify(updatedCart));
    sessionStorage.setItem("cartstate", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartstateChanged"));
  };

  const handleFormSubmit = () => {
    const mappedItems = cartState.map((item) => ({
      item_variants_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.finalPrice),
      unit: item.unit,
    }));

    const orderDetails = {
      order: {
        order_type: "po",
        customer_be_id: customerDetails?.id || "",
        total_amount: finalTotalAmount,
        items: mappedItems,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/add`,
        orderDetails,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then(() => {
        localStorage.removeItem("cartstate");
        sessionStorage.removeItem("cartstate");
        localStorage.removeItem("customerDetails");
        sessionStorage.removeItem("customerDetails");
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("discounts");
        sessionStorage.removeItem("charges");
        sessionStorage.removeItem("finalTotalAmount");
        sessionStorage.removeItem("userData");
        localStorage.removeItem("finalTotalAmount");
        window.dispatchEvent(new Event("cartstateChanged"));
        toast.success("Order Submitted Successfully");

        navigate("/purchase-order-list");
      })
      .catch(() => toast.error("Submission failed"));
  };
  return (
    <>
      <ToastContainer />
      {cartItems.length !== 0 ? (
        <div
          className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.borderradius6px}  ${classes.mt1}`}
        >
          {userData?.type === "vendor" ? (
            <div className={`${classes.w60}`}>
              {cartItems?.map((data, index) => (
                <CheckoutProductCardVendor
                  data={data}
                  key={index}
                  index={index}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          ) : (
            <div className={`${classes.w60}`}>
              {cartItems?.map((data, index) => (
                <CheckoutProductCard
                  data={data}
                  key={index}
                  index={index}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}

          <div
            className={`${classes.w35} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.flexdirectioncolumn}  ${classes.alignitemsend}`}
          >
            <CheckoutOrderSummary cartItems={cartItems} />

            <Button
              className={`${classes.custombtnblue} ${classes.w60} ${classes.mt1}`}
              onClick={() => {
                if (userData?.type === "vendor") {
                  handleFormSubmit();
                } else {
                  navigate("/checkout");
                }
              }}
            >
              {userData?.type === "vendor" ? "Order Now" : "Continue"}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className={`${classes.custombtnblue} ${classes.w60} ${classes.mt1}`}
          onClick={() => navigate("/customer-list")}
        >
          Customer List
        </Button>
      )}
    </>
  );
}
export default CheckoutView;
