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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RemarkPopup from "./RemarkPopup";
import DispatchPopup from "../../Dispatch/DispatchPopup";

function ViewSalesOrder() {
  const classes = useStyles();
  const style = [
    {
      height: "maxh67",
      style: "viewtable",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [brand, setBrand] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDispatchPopup, setOpenDispatchPopup] = useState(false);
  const [remark, setRemark] = useState("");

  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "edit-brand") {
      navigate("/edit-brand", { state: rowId });
    }
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/get_all/so`,
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

  // Function to delete a book
  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Brand deleted successfully");
      const updateddatatata = brand.filter((data) => data.id !== rowId);
      setBrand(updateddatatata);
    } catch (error) {
      toast.error("Brand is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      brand: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchData();
        toast.success("Brand status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Brand status:", error);
        toast.error("Brand status is not changed");
      });
  };

  // const onStatusSelect = (id, value) => {
  //   if (value === "dispatch") {
  //     setSelectedRowId(id);
  //     setOpenDispatchPopup(true);
  //   } else {
  //     setSelectedRowId(id);
  //     setSelectedStatus(value);
  //     setOpenConfirm(true);
  //   }
  // };

  const onStatusSelect = (id, value) => {
    if (value === "dispatch") {
      setSelectedRowId(id);
      setOpenDispatchPopup(true);
    } else if (value === "approved") {
      handleStatusChange(id, value);
    } else {
      setSelectedRowId(id);
      setSelectedStatus(value);
      setOpenConfirm(true);
    }
  };

  const handleOpenClose = () => {
    setOpenConfirm((prev) => !prev);
  };

  const handleDispatchClose = () => {
    setOpenDispatchPopup(false);
    setSelectedRowId(null);
  };

  const handleStatusChange = (iddd, value) => {
    const data = {
      order: {
        order_status: value,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchData();
        toast.success(`Order ${selectedStatus} successfully`);
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Order status:", error);
        toast.error("Order status is not changed");
      });
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
      const isSearchMatch = d?.customer_name
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
      headerAlign: "center",
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
          received: "#1976d2",
          approved: "#388e3c",
          processing: "#00796b",
          readytodispatch: "#f57c00",
          dispatch: "#ff9800",
          delivered: "#616161",
          rejected: "#d32f2f",
        };

        const renderStatusText = (status) => {
          return status
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        };

        if (
          [
            "rejected",
            "approved",
            "delivered",
            "processing",
            "ready_to_dispatch",
            "dispatch",
          ].includes(status)
        ) {
          return (
            <div
              className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter}`}
              style={{ color: statusColor[status] || "inherit" }}
            >
              {renderStatusText(status)}
            </div>
          );
        }

        // Dynamic menu items based on status
        const statusOptions = {
          received: ["received", "approved", "rejected"],
          approved: [
            "approved",
            "processing",
            "ready_to_dispatch",
            "dispatch",
            "rejected",
          ],
          processing: [
            "processing",
            "ready_to_dispatch",
            "dispatch",
            "rejected",
          ],
          ready_to_dispatch: ["ready_to_dispatch", "dispatch"],
          dispatch: ["dispatch", "delivered"],
        };

        const availableOptions =
          statusOptions[status] || Object.keys(statusColor);

        const menuItems = availableOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            style={{ color: statusColor[option] || "inherit" }}
          >
            {renderStatusText(option)}
          </MenuItem>
        ));
        return (
          <div
            className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter}`}
          >
            <Select
              className={`${classes.w80} ${classes.textaligncenter}`}
              value={status}
              onChange={(event) => {
                onStatusSelect(cellValues.row.id, event.target.value);
              }}
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
      headerName: "Sales Order ID",
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
    {
      field: "payment_status",
      headerName: "Payment Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
    {
      field: "expected_delivery_date",
      headerName: "Expected Delivery Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
      field: "active_status",
      headerName: "Order Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const isActive = cellValues.row.active_status === "active";

        return (
          <div
            className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            {/* <IconButton
              className={`${classes.w15}`}
              aria-describedby={id}
              onClick={(event) => {
                handleClick(event, cellValues.row.id);
              }}
            >
              <ArrowLeftIcon fontSize="small" />
            </IconButton> */}
            <Typography
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              {isActive ? (
                <ActiveIcon className={`${classes.mr0_5}`} />
              ) : (
                <InactiveIcon fontSize="small" className={`${classes.mr0_5}`} />
              )}

              {cellValues.row.active_status}
            </Typography>
            <Popover
              id={id}
              open={popoveropen && selectedRowId === cellValues.row.id}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
            >
              <Paper>
                <IconButton
                  onClick={(event) => {
                    handleStatus(
                      cellValues.row.id,
                      cellValues.row.active_status
                    );
                  }}
                >
                  <LightTooltip title="Inactive">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleButtonClick("edit-brand", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton>
                  <LightTooltip title="Delete">
                    <DeleteIcon
                      onClick={() => deleteDataOfRow(cellValues.row.id)}
                    />
                  </LightTooltip>
                </IconButton>
              </Paper>
            </Popover>
          </div>
        );
      },
    },
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
        <Modal
          aria-labelledby="dispatch-modal-title"
          aria-describedby="dispatch-modal-description"
          className={classes.modal}
          open={openDispatchPopup}
          onClose={handleDispatchClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <DispatchPopup
            open={openDispatchPopup}
            handleOpenClose={handleDispatchClose}
            rowId={selectedRowId}
            fetchData={fetchData}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewSalesOrder;
