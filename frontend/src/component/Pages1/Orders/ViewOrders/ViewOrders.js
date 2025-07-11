import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {
  Backdrop,
  Button,
  Modal,
  Paper,
  Popover,
  Tooltip,
  duration,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactComponent as AddQuestionIcon } from "../../../images/examimage/addquestion.svg";
import { ReactComponent as DashboardIcon } from "../../../images/examimage/dashboard.svg";
import { ReactComponent as ResultIcon } from "../../../images/examimage/result.svg";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import OrderDiscriptionPopup from "../Popup/orderDiscriptionPopup";

function ViewOrders() {
  const classes = useStyles();
  const style = [
    {
      height: "maxh60",
      style: "viewtable",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState();
  const [testSeriesData, setTestSeriesData] = useState([]);

  const handleOpenClose = (data) => {
    setOpen(!open);
    setInfo(data);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClickQuestion = (type, rowId) => {
    navigate(`/admin/${type}/${rowId}`);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "edittestseries") {
      navigate(`/admin/edittestseries/${rowId}`);
    }
  };

  useEffect(() => {
    fetchTestSeriesData();
  }, []);

  // Function to delete a book
  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Test Series deleted:", response.data);
      fetchTestSeriesData();
      handleClose();
      toast.success("Test Series deleted successfully");
      const updateddatatata = testSeriesData.filter(
        (data) => data.id !== rowId
      );
      setTestSeriesData(updateddatatata);
    } catch (error) {
      toast.error("Test Series is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      test_series: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Test Series status changed successfully", response);
        fetchTestSeriesData();
        toast.success("Test Series status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Test Series status:", error);
        toast.error("Test Series status is not changed");
      });
  };
  const fetchTestSeriesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/orders`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success === true) {
      
        setTestSeriesData(response?.data?.orders);
      }
    } catch (error) {
      console.error("Error fetching test series data:", error);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth(); // Month starts from 0
    const year = date.getFullYear();

    const monthName = months[monthIndex];

    return `${monthName}/${day}/${year}`;
};

  const rows = testSeriesData.map((d) => ({
    id: d.id ? d.id : "N/A",
    order_id: d.order_id ? d.order_id : "N/A",
    date: d.created_at ? formatDate(d.created_at) : "N/A", 
    name: d.user.full_name ? d.user.full_name : "N/A",

    item_cost: d.sub_total_item_cost ? d.sub_total_item_cost : "N/A",
    discount: d.sub_total_discount ? d.sub_total_discount : "N/A",
    total_cost: d.total ? d.total : "N/A",
    gst: d.gst ? d.gst : "N/A",
    billing_amount: d.grand_total_cost ? d.grand_total_cost : "N/A", 
    delivery_address: d.user.delivery_address ? d.user.delivery_address : "N/A", 

    
    active_status: d.active_status ? d.active_status : "N/A",
  }));
  
  const filteredRows = rows
    .filter((d) => {
      const query = searchQuery.toLowerCase();

      const durationStr = String(d.discount).toLowerCase();
      const startDateStr = d.total_cost.toLowerCase();
      const startTimeStr = d.gst.toLowerCase();

      
      const isNameMatch = d.name.toLowerCase().includes(query);
      const isCodeMatch = d.item_cost.toLowerCase().includes(query);
      const isDurationMatch = durationStr.includes(query);
      const isStartDateMatch = startDateStr.includes(query);
      const isStartTimeMatch = startTimeStr.includes(query);

      // Return true if any field matches the search query
      return (
        isNameMatch ||
        isCodeMatch ||
        isDurationMatch ||
        isStartDateMatch ||
        isStartTimeMatch
      );
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1, // Add a serial number to each filtered row
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRowClick = (rowId) => {
    setSelectedRowId(rowId);
    handleOpenClose();
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      width: 72,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "order_id",
      headerName: "Order Id",
      headerClassName: "super-app-theme--header",
      width: 160,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      width: 95,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
      // renderCell: (cellValues) => (
      //   <div>
      //     {new Date(cellValues.row.created_at).toLocaleDateString("en-US", {
      //       year: "numeric",
      //       month: "short",
      //       day: "2-digit",
      //     })}
      //   </div>
      // ),
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 110,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "delivery_address",
      headerName: "Delivery Address",
      headerClassName: "super-app-theme--header",
      width: 240,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "item_cost",
      headerName: "Item Cost (₹)",
      headerClassName: "super-app-theme--header",
      width: 140,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "discount",
      headerName: "Discount (%)",
      headerClassName: "super-app-theme--header",
      width: 140,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "total_cost",
      headerName: "Total Cost (₹)",
      headerClassName: "super-app-theme--header",
      width: 150,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "gst",
      headerName: "GST(₹)",
      headerClassName: "super-app-theme--header",
      width: 110,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "billing_amount",
      headerName: "Billing Amount(₹)",
      headerClassName: "super-app-theme--header",
      width: 175,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "action",
      headerName: "ACTION",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const isActive = cellValues.row.active_status === "active";
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <Button
              className={classes.viewbtn}
              onClick={() => {
                handleRowClick(cellValues.row.id);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Quiz Name",
      inputplaceholder: "Search Orders",
      exportimport: "yes",
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
export default ViewOrders;
