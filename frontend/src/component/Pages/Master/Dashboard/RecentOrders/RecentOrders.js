import React, { useState } from "react";
import TableView from "../../../../CustomComponent/TableViewDash";
import useStyles from "../../../../../styles";
import {
  Backdrop,
  Button,
  Modal,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import OrderDiscriptionPopup from "./Popup/orderDiscriptionPopup";

function RecentOrders({dashboardData}) {
  const classes = useStyles();

  const style = [
    {
      style: "viewtable",
      height: "h54vh",
    },
  ];
 
  
  const [selectedRowId, setSelectedRowId] = useState();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpenClose = (rowId) => {
    setOpen(!open);
    setSelectedRowId(rowId);
  };

  function convertDateFormat(originalDate) {
    return new Date(originalDate).toISOString().slice(0, 10).split("-").reverse().join("-");
  }

  const rows = dashboardData?.map((d, i) => ({
    id: d.id ? d.id : "N/A",
    srno: i+1,
    order_id: d.order_id ? d.order_id : "N/A",
    date: d.created_at ? convertDateFormat(d.created_at) : "N/A", 
    name: d.user.full_name ? d.user.full_name : "N/A",

    item_cost: d.sub_total_item_cost ? d.sub_total_item_cost : "N/A",
    discount: d.sub_total_discount ? d.sub_total_discount : "N/A",
    total_cost: d.total ? d.total : "N/A",
    gst: d.gst ? d.gst : "N/A",
    billing_amount: d.grand_total_cost ? d.grand_total_cost : "N/A", 
    delivery_address: d.user.delivery_address ? d.user.delivery_address : "N/A", 
    status: d.razorpay_payment_status ? d.razorpay_payment_status : "N/A", 

    
    active_status: d.active_status ? d.active_status : "N/A",
  })) || [];

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "order_id",
      headerName: "Order Id",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 170,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 130,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "billing_amount",
      headerName: "Billing Amount",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 130,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 180,
      autoPageSize: false,
      renderCell: (cellValues) => {
       
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <Button
              className={classes.viewbtn}
              onClick={() => {
                handleOpenClose(cellValues.row.id);
              }}
              variant="h6"
            >
              VIEW
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={`${classes.mt1_5} ${classes.bgwhite} ${classes.p0_5}  ${classes.boxshadow1} ${classes.borderradius6px}`}
      >
        <div
          className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
        >
          <Typography
            className={`${classes.my1} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw700}`}
          >
            Recent Orders
          </Typography>
          <Button
            className={`${classes.viewallbtn}`}
            onClick={() => navigate(`/admin/orders`)}
          >
            View All <KeyboardArrowRightIcon style={{ fontSize: "medium" }} />
          </Button>
        </div>
        <TableView columns={columns} rows={rows} Heading={style} />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.dflex} ${classes.alignitemscenter}${classes.justifycenter}`}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <OrderDiscriptionPopup
          open={open}
          row={selectedRowId}
          handleOpenClose={handleOpenClose}
        />
      </Modal>
    </>
  );
}

export default RecentOrders;
