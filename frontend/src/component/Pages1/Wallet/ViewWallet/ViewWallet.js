import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {
  Paper,
  Popover,
  Tooltip,
  withStyles,
  Modal,
  Backdrop,
  Button,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";

import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import TextsmsOutlinedIcon from "@material-ui/icons/TextsmsOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import WithdrawalPopup from "../Popup/withdrawalPopup";
import { ReactComponent as TotalDoubtsIcon } from "../../../images/doutforumimage/totaldoubtsicon.svg";
import { ReactComponent as PendingDoubtsIcon } from "../../../images/doutforumimage/pendingdoubtsicon.svg";
import AddIcon from "@material-ui/icons/Add";

function ViewWallet() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState();
  const style = [
    {
      style: "viewtable",
      height: "h57vh",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [wallet, setWallet] = useState([]);
  const [walletBallance, setWalletBallance] = useState("");

  const navigate = useNavigate();

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
  const handleOpenClose = (data) => {
    setOpen(!open);
    setInfo(data);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "editquizz") {
      navigate(`/admin/editquizz/${rowId}`);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/wallet/transection`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setWallet(response.data.wallet_transection);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData1 = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setWalletBallance(response.data.wallet_balance);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData1();
  }, []);


  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Teacher deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Teacher deleted successfully");
      const updateddatatata = wallet.filter((data) => data.id !== rowId);
      setWallet(updateddatatata);
    } catch (error) {
      toast.error("Teacher is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      teacher: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Teacher status changed successfully", response);
        fetchData();
        toast.success("Teacher status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Teacher status:", error);
        toast.error("Teacher status is not changed");
      });
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

  const rows = wallet?.map((d,n) => ({
    srno:n+1,
    id: d.id ? d.id : "N/A",
    date: d.created_at ? formatDate(d.created_at)  : "N/A",

    type: d.type ? d.type : "N/A",
    amount: d.amount ? d.amount : "N/A",
    status: d.status ? d.status : "N/A",
  }));
  const filteredRows = wallet?.length > 0 ? rows.filter((d) => {

    const query = searchQuery.toLowerCase();
    const durationStr = String(d.date).toLowerCase();
    const accountStr = String(d.amount).toLowerCase();
    const isCodeMatch = d.type.toLowerCase().includes(query);
    const isDurationMatch = durationStr.includes(query);
    const isaccountMatch = accountStr.includes(query);
    return (
      isCodeMatch ||
      isDurationMatch ||
      
      
      isaccountMatch 
      
    );
  })
  .map((row, index) => ({
    ...row,
    srno: index + 1, 
  })) : [];
 
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
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
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
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
  ];

  const row = [
    
  ];
  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search",
    },
  ];
  return (
    <>
      <ToastContainer />
        <div
          className={`${classes.mt1} ${classes.px2} ${classes.py0_5} ${classes.bgwhite} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
        >
          <div>
            <Typography
              className={`${classes.textcolorformlabel} ${classes.fontfamilyDMSans} ${classes.fontSize8}`}
            >
              My Balance
            </Typography>
            <Typography
              className={`${classes.textcolordarkcyan} ${classes.fontFamilyJost} ${classes.fonSize9} ${classes.fw600}`}
            >
              ₹{walletBallance}

            </Typography>
          </div>
          <div className={classes.btnContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenClose}
              className={classes.bluebtn}
            >
              <AddIcon />
              Withdrawal
            </Button>
          </div>
        </div>
      <div
        className={`${classes.bgwhite} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />

        <TableView columns={columns} rows={filteredRows} Heading={style} />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <WithdrawalPopup
            open={open}
            handleOpenClose={handleOpenClose}
            fetchData={fetchData}
            fetchData1={fetchData1}

            // fetchWalletBalance={fetchWalletBalance}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewWallet;
