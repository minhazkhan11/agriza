import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {
  Paper,
  Popover,
  Tooltip,
  withStyles,
  Button,
  Modal,
  Backdrop,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { ReactComponent as LoginIcon } from "../../../images/loginicon.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ParentPopup from "./ParentPopup";

function ViewCustomers() {
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
  const [businessEntity, setBusinessEntity] = useState([]);

  const [isPopup, setIsPopup] = useState(false);
  const [rowData, setRowData] = useState([]);

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

  const handlePopUp = (e, id, value) => {
    setIsPopup(!isPopup);
    setRowData({ value: value, id: id }); // Correct object format
  };

  const handleCheck = (type, rowId) => {
    const data = {
      be_information: {
        [rowId.registerd_type === "Yes" ? "gst_number" : "pan_number"]:
          rowId.registerd_type === "Yes" ? rowId.gst_number : rowId.pan_number,
        registerd_type:
          rowId.registerd_type === "Yes" ? "registered" : "notregistered",
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/gstpan`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const localState = response.data;
        navigate("/edit-vendor", { state: localState });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // const handleButtonClick = (type, rowId) => {
  //   if (type === "edit-business-entity") {
  //     navigate("/edit-business-entity", { state: rowId });
  //   }
  // };

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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_customer/be/customer`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setBusinessEntity(response.data.be_information);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_customer/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Business Entity deleted successfully");
      const updateddatatata = businessEntity.filter(
        (data) => data.id !== rowId
      );
      setBusinessEntity(updateddatatata);
    } catch (error) {
      toast.error("Business Entity is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      be_information: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_customer/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchData();
        toast.success("Business Entity status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Business Entity status:", error);
        toast.error("Business Entity status is not changed");
      });
  };

  const handleLogin = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/auth/signin/user_access/${rowId}`,

        {},
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      handleClose();
      if (response.data.success === true) {
        const responseData = response.data;

        const token = responseData.token;
        const userName = response.data.user.center_name;

        const newTab = window.open(
          `${process.env.REACT_APP_API_AGRIZA_ADMIN_URL}/?token=${token}&userName=${userName}`,
          "_blank"
        );

        if (newTab) {
          setTimeout(() => {
            // Avoid passing the `navigate` function or any other circular references
            newTab.location.href = `${process.env.REACT_APP_API_AGRIZA_ADMIN_URL}/?token=${token}&userName=${userName}`;
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("Business Entity is Inactive so cannot login");
      console.error("Error in login: ", error);
    }
  };

  const rows = businessEntity.map((d) => ({
    id: d.id ? d.id : "N/A",
    business_name: d.business_name ? d.business_name : "N/A",
    check_in: "Choose Activity",
    constitutions_name: d.constitutions_id ? d.constitutions_id.name : "N/A",
    phone: d.phone ? d.phone : "N/A",
    pan_number: d.pan_number ? d.pan_number : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch =
        d.pan_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.business_name.toLowerCase().includes(searchQuery.toLowerCase());

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
      width: 30,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "business_name",
      headerName: "Business Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 400,
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
      field: "check_in",
      headerName: "Check In",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <Button
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.bluebtn} ${classes.p10px} ${classes.h50p}`}
          onClick={(event) => {
            handlePopUp(event, cellValues.row.id, cellValues.row.business_name);
          }}
        >
          {cellValues.value}
        </Button>
      ),
    },
    {
      field: "constitutions_name",
      headerName: "Constitutions Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 250,
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
      field: "phone",
      headerName: "Phone",
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
      field: "pan_number",
      headerName: "Pan Number",
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
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const isActive = cellValues.row.active_status === "active";

        return (
          <div
            className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <IconButton
              className={`${classes.w15}`}
              aria-describedby={id}
              onClick={(event) => {
                handleClick(event, cellValues.row.id);
              }}
            >
              <ArrowLeftIcon fontSize="small" />
            </IconButton>
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
                <IconButton onClick={() => handleLogin(cellValues.row.id)}>
                  <LightTooltip title="Login">
                    <LoginIcon />
                  </LightTooltip>
                </IconButton>
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
                {/* <IconButton
                  onClick={() => {
                    handleCheck("edit-vendor", cellValues.row);
                  }}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
                  </LightTooltip>
                </IconButton> */}
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
      inputplaceholder: "Search By Name",
      inputlable: "yes",
      // export: "yes",
    },
  ];

  const popupDetail = [
    {
      title: "New Order",
    },
    {
      title: "No Order",
    },
    {
      title: "New Payments",
    },
    {
      title: "Order Follow Up",
    },
    {
      title: "Payment Follow Up",
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
          className={`${classes.modal}`}
          open={isPopup}
          onClose={handlePopUp}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <ParentPopup popupDetail={popupDetail} rowData={rowData} />
        </Modal>
      </div>
    </>
  );
}
export default ViewCustomers;
