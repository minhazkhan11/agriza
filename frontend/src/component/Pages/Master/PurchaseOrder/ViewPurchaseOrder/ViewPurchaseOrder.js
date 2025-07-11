import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import {
  Backdrop,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Select,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";

import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RemarkPopup from "./RemarkPopup";

function ViewPurchaseOrder() {
  const classes = useStyles();
  const style = [
    {
      height: "maxh67",
      style: "viewtable",
    },
  ];

  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [brand, setBrand] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [remark, setRemark] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/get_all/po`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setBrand(response.data.orders);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onStatusSelect = (id, value) => {
    setSelectedRowId(id);
    setSelectedStatus(value);
    setOpenConfirm(true);
  };

  const handleOpenClose = () => {
    setOpenConfirm((prev) => !prev);
  };

  const rows = brand.map((d) => ({
    id: d.order ? d.order.id : "N/A",
    customer_name: d?.order?.customer_be
      ? d.order?.customer_be?.business_name
      : "N/A",
    item_order_id: d.order ? d.order.so_po_order_id : "N/A",
    total_amount: d.order ? d.order.total_amount : "N/A",
    payment_status: d.order ? d.order.payment_type : "N/A",
    created_on: d?.order ? formatDate(d?.order?.created_at) : "N/A",
    updated_at: d?.order ? formatDate(d?.order?.updated_at) : "N/A",
    expected_delivery_date: d?.order ? formatDate(d?.order?.date) : "N/A",
    order_status: d.order ? d.order.order_status : "N/A",
    active_status: d.order ? d.order.order_status : "N/A",
  }));

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.customer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "customer_name",
      headerName: "Customer Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 300,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    {
      field: "order_status",
      headerName: "Order Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const status = cellValues.row.order_status;
        const statusColor = {
          received: "blue",
          approved: "green",
          rejected: "red",
          dispatch: "orange",
          delivered: "gray",
        };

        const renderStatusText = (status) => {
          switch (status) {
            case "received":
              return "Received";
            case "approved":
              return "Approved";
            case "rejected":
              return "Rejected";
            case "dispatch":
              return "Dispatch";
            case "delivered":
              return "Delivered";
            default:
              return status;
          }
        };

        // Case 1: Just display text if status is rejected or delivered
        if (status === "rejected" || status === "delivered") {
          return (
            <div
              className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter}`}
              style={{ color: statusColor[status] || "inherit" }}
            >
              {renderStatusText(status)}
            </div>
          );
        }

        // Case 2: Render dropdown with conditional options
        const menuItems = [];

        if (status === "approved") {
          // Only show approved and dispatch
          menuItems.push(
            <MenuItem value="approved" style={{ color: "green" }}>
              Approved
            </MenuItem>,
            <MenuItem value="dispatch" style={{ color: "orange" }}>
              Dispatch
            </MenuItem>,
            <MenuItem value="delivered" style={{ color: "gray" }}>
              Delivered
            </MenuItem>
          );
        } else if (status === "dispatch") {
          // Only show approved and dispatch
          menuItems.push(
            <MenuItem value="dispatch" style={{ color: "orange" }}>
              Dispatch
            </MenuItem>,
            <MenuItem value="delivered" style={{ color: "gray" }}>
              Delivered
            </MenuItem>
          );
        } else {
          // Show all options
          menuItems.push(
            <MenuItem value="received" style={{ color: "blue" }}>
              Received
            </MenuItem>,
            <MenuItem value="approved" style={{ color: "green" }}>
              Approved
            </MenuItem>,
            <MenuItem value="rejected" style={{ color: "red" }}>
              Rejected
            </MenuItem>,
            <MenuItem value="dispatch" style={{ color: "orange" }}>
              Dispatch
            </MenuItem>,
            <MenuItem value="delivered" style={{ color: "gray" }}>
              Delivered
            </MenuItem>
          );
        }

        return (
          <div
            className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter}`}
          >
            <Select
              className={`${classes.w80} ${classes.textalignleft}`}
              value={status}
              onChange={(event) => {
                onStatusSelect(cellValues.row.id, event.target.value);
              }}
              labelId="demo-simple-select-disabled-label"
              id="demo-simple-select-disabled"
              style={{ color: statusColor[status] || "inherit" }}
              renderValue={renderStatusText}
            >
              {menuItems}
            </Select>
          </div>
        );
      },
    },
    {
      field: "item_order_id",
      headerName: "Purchase Order ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 180,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },

    {
      field: "total_amount",
      headerName: "Total Amount",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    // {
    //   field: "payment_status",
    //   headerName: "Payment Status",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 200,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    {
      field: "created_on",
      headerName: "Created On",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    // {
    //   field: "expected_delivery_date",
    //   headerName: "Expected Delivery Date",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 200,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
  ];

  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search Sales Order name",
      inputlable: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows} Heading={style} />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openConfirm}
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <RemarkPopup
            open={openConfirm}
            handleOpenClose={handleOpenClose}
            remark={remark}
            setRemark={setRemark}
            rowId={selectedRowId}
            fetchData={fetchData}
            selectedStatus={selectedStatus}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewPurchaseOrder;
