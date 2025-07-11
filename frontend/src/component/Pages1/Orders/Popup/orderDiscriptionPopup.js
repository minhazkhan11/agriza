import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Divider, Fade } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDiscription from "./productDiscription";
import CustomerDetail from "./customerDetail";
import OrderSummary from "./ordersummary";
import useStyles from "../../../../styles";


function OrderDiscriptionPopup({ row, open, handleOpenClose }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [orders, setOrders] = useState([]);
  console.log(row,"row")
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/orders/${row}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setOrders(response?.data?.orders);
      console.log(response?.data?.orders, "response");
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Fade in={open}>
        <div className={`${classes.ordersmodal} ${classes.w72}`}>
          <Button onClick={handleOpenClose} className={classes.closeIcon}>
            <CloseIcon />
          </Button>
          <div>
            <Typography
              className={`${classes.fontsize5} ${classes.fw500}`}
              variant="h2"
            >
              Item Detail
            </Typography>
          </div>
          <Divider className={classes.dottedhr} />

          <div className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemsstart} ${classes.w100} ${classes.mt2} ${classes.h78vh} ${classes.pagescroll}`}>
            <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w67}`}>
              <div className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.w68}`}>
                <Typography 
                variant="h6"
                className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter}`}
                >#{orders?.order_id}
                </Typography>
                <Typography variant="h5"
                className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter}`}
                >
                  {orders?.created_at
                    ? new Date(orders.created_at)
                        .toLocaleString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                        .split("/")
                        .join("-")
                    : "date and time"}
                </Typography>
                <Typography 
                variant="h4"
                className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter}`}
                >
                  {orders?.products?.length || 0} items
                </Typography>
              </div>
              <ProductDiscription orders={orders} fetchData={fetchData}/>
            </div>
            <div className={classes.w32}>
              <CustomerDetail orders={orders} />
              <OrderSummary orders={orders} />
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
}

export default OrderDiscriptionPopup;
