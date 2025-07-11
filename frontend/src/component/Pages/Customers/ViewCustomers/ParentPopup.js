import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../PageHeader";
import useStyles from "../../../../styles";
import { Button, Modal, Backdrop } from "@material-ui/core";
import ChildPopup from "./ChildPopup";
import PaymentFrom from "./PaymentFrom";

function ParentPopup({ popupDetail, rowData }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [open, setOpen] = useState();
  const [detail, setDetail] = useState();

  const handlePopUp = () => {
    setOpen(!open);
  };

  const cartData = { rowData: rowData, type: "customer" };

  const handleClick = (clickedDetail) => {
    if (clickedDetail.title === "New Order") {
      // Clear cartstate from both localStorage and sessionStorage
      localStorage.removeItem("cartstate");
      sessionStorage.removeItem("cartstate");
      localStorage.removeItem("customerDetails");
      sessionStorage.removeItem("customerDetails");
      sessionStorage.removeItem("checkoutData");
      sessionStorage.removeItem("discounts");
      sessionStorage.removeItem("charges");
      localStorage.removeItem("finalTotalAmount");
      sessionStorage.removeItem("finalTotalAmount");
      sessionStorage.removeItem("userData");

      // 🔥 Notify all listeners (like Header) that cartstate changed
      window.dispatchEvent(new Event("cartstateChanged"));

      navigate("/create-order", { state: cartData });
    } else {
      setDetail({
        title: clickedDetail.title,
        popupDetail: clickedDetail.popupDetail,
      });
      setOpen(true);
    }
  };

  const Heading = [
    {
      mainheading: "Choose Activity",
      height: "maxh52",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];

  return (
    <div
      className={`${classes.bgwhite} ${classes.p2} ${classes.w50} ${classes.pb0} ${classes.pt1}`}
    >
      <PageHeader Heading={Heading} />
      <div
        className={`${classes.w100} ${classes.bgwhite} ${classes.gap20px} ${classes.justifyspacebetween} ${classes.borderradius6px} ${classes.mb1} ${classes.mt1} ${classes.dflex}`}
        style={{ flexWrap: "wrap" }}
      >
        {popupDetail &&
          popupDetail.map((detail, index) => (
            <Button
              key={index}
              onClick={() => handleClick(detail)}
              className={`${classes.bgwhite} ${classes.boxshadow10} ${classes.boxshado10} ${classes.transparentbtn}  ${classes.flexShrink} ${classes.w47}`}
            >
              {detail.title}
            </Button>
          ))}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={open}
          onClose={handlePopUp}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          {detail?.title === "New Payments" ? (
            <PaymentFrom
              detail={detail}
              handlePopUp={handlePopUp}
              rowData={rowData}
            />
          ) : (
            <ChildPopup
              detail={detail}
              popupDetail={popupDetail}
              handlePopUp={handlePopUp}
              rowData={rowData}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default ParentPopup;
