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

function ViewSettlement() {
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
 
  const [info, setInfo] = useState();
  const [settelMent, setSettelMent] = useState([]);

  

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
      const updateddatatata = settelMent.filter(
        (data) => data.id !== rowId
      );
      setSettelMent(updateddatatata);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/settlement`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success === true) {
        
        setSettelMent(response?.data?.settlement);
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

  const rows = settelMent.map((d,n) => ({
    srno:n+1,
    id: d.id ? d.id : "N/A",
    branch: d.branch_name ? d.branch_name : "N/A",
    account_holder: d.account_holder_name ? d.account_holder_name : "N/A",
    amount: d.amount ? d.amount : "N/A",
    account_no: d.account_no ? d.account_no : "N/A",
    ifsc_code: d.ifsc_code ? d.ifsc_code : "N/A",
    
    requested_date: d.created_at ? formatDate(d.created_at)  : "N/A",

    settled_date: d.settlement_date ? formatDate(d.settlement_date)  : "N/A",
    uti_reference: d.uti_referrence_no ? d.uti_referrence_no : "N/A",
    status: d.status ? d.status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const query = searchQuery.toLowerCase();

      const durationStr = String(d.amount).toLowerCase();
      const accountStr = String(d.account_no).toLowerCase();
      const ifscStr = String(d.ifsc_code).toLowerCase();
      
      const startReqStr = d.requested_date.toLowerCase();

      const startDateStr = d.settled_date.toLowerCase();
      const startTimeStr = d.uti_reference.toLowerCase();

      const isNameMatch = d.branch.toLowerCase().includes(query);
      const isCodeMatch = d.account_holder.toLowerCase().includes(query);
      const isDurationMatch = durationStr.includes(query);
      const isaccountMatch = accountStr.includes(query);
      const isIfscMatch = ifscStr.includes(query);

      const isStartDateMatch = startDateStr.includes(query);
      const isStartDateMatch1 = startReqStr.includes(query);

      const isStartTimeMatch = startTimeStr.includes(query);

      return (
        isNameMatch ||
        isCodeMatch ||
        isDurationMatch ||
        isStartDateMatch ||
        isStartTimeMatch ||
        isaccountMatch ||
        isIfscMatch ||
        isStartDateMatch1
      );
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1, // Add a serial number to each filtered row
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
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
      field: "amount",
      headerName: "Amount",
      headerClassName: "super-app-theme--header",
      width: 100,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "requested_date",
      headerName: "Requested Date",
      headerClassName: "super-app-theme--header",
      width: 160,
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
      field: "settled_date",
      headerName: "Settled Date",
      headerClassName: "super-app-theme--header",
      width: 160,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "uti_reference",
      headerName: "UTI Reference",
      headerClassName: "super-app-theme--header",
      width: 240,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "account_holder",
      headerName: "Account Holder",
      headerClassName: "super-app-theme--header",
      width: 160,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "branch",
      headerName: "Branch",
      headerClassName: "super-app-theme--header",
      width: 140,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "account_no",
      headerName: "Account No.",
      headerClassName: "super-app-theme--header",
      width: 160,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "ifsc_code",
      headerName: "IFSC Code",
      headerClassName: "super-app-theme--header",
      width: 110,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      width: 150,
      // flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
  ];

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Quiz Name",
      inputplaceholder: "Search Settlements",
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
    </>
  );
}
export default ViewSettlement;
