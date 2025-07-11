import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "../../../../../../styles";
import { ToastContainer, toast } from "react-toastify";
import { decryptData } from "../../../../../../crypto";
import axios from "axios";


function ProductDiscription({ orders,fetchData }) {
  
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
  const handleStatus = (productId, action) => {
   

    const data = {
      order: {
        delivery_status: action,
        id: productId,
      },
    };
  
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/orders/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchData();
        toast.success("Status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Status:", error);
        toast.error("Status is not changed");
      });
  };


  return (
    <>
      <div className={` ${classes.borderradius10px} ${classes.border1999} ${classes.mt1} ${classes.p0_5}`}>
        <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w12}`}
          >
            #
          </Typography>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w21}`}
          >
            Name
          </Typography>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w17}`}
          >
            Type
          </Typography>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w7}`}
          >
            Quantity
          </Typography>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w7}`}
          >
            Price
          </Typography>
          <Typography
            variant="h4"
            className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w17}`}
          >
            Status
          </Typography>
        </div>
        {orders?.products?.map((data) => (
          <div
            className={`${classes.dflex} ${classes.m0_5} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
          >
            <img
              src={data?.image_url}
              className={classes.boxshadow4}
              alt="bookimg"
              width="12%"
            />
            <Typography
              variant="h3"
              className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w21}`}
            >
              {data?.product_name} {data?.sub_heading}
            </Typography>

            <Typography
              className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w17}`}
              variant="h4"
            >
              {data?.product_type}
            </Typography>

            <Typography
              className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w7}`}
              variant="h5"
            >
              {data?.quantity}
            </Typography>
            <Typography
              className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.w7}`}
              variant="h5"
              
            >
              {data?.billing_amount}
            </Typography>
            {data?.product_type ===
             "books"
              ? (
              <Button
                className={classes.orderspopupactionbtn}
                aria-describedby={id}
                onClick={(event) => {
                  handleClick(event, data.id);
                }}
              >
                {data?.delivery_status}{" "}
                <ExpandMoreIcon className={`${classes.ml0_3} ${classes.fontsizelarge}`} />
              </Button>
            ) : (
              <div style={{ width: "17%" }}></div>
            )}
            <Popover
              id={id}
              open={popoveropen && selectedRowId === data.id}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div className={classes.ordersdropdown}>
                <Button onClick={()=>{handleStatus(data?.product_id, "pending")}}>Draft</Button>

                <Button onClick={()=>{handleStatus(data?.product_id, "confirmed")}}>Packaging</Button>

                <Button onClick={()=>{handleStatus(data?.product_id, "dispatched")}}>Shipped</Button>

                <Button onClick={()=>{handleStatus(data?.product_id, "")}}>Delivered</Button>
              </div>
            </Popover>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductDiscription;
