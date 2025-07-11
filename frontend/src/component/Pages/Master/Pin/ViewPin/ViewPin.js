import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
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

function ViewPin() {
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
  const [pin, setPin] = useState([]);
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
    if (type === "edit-pin") {
      navigate("/edit-pin", { state: rowId });
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setPin(response.data.pin);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Pin deleted successfully");
      const updateddatatata = pin.filter((data) => data.id !== rowId);
      setPin(updateddatatata);
    } catch (error) {
      toast.error("Pin is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      pin: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/admin/pin/status`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log("Pin status changed successfully", response);
        fetchData();
        toast.success("Pin status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Pin status:", error);
        toast.error("Pin status is not changed");
      });
  };

  const rows = pin.map((d) => ({
    id: d.id ? d.id : "N/A",
    category_name: d.pin_code ? d.pin_code : "N/A",
    country_code: d.tehsil_name ? d.tehsil_name : "N/A",
    district_name: d.district_name ? d.district_name : "N/A",
    state_name: d.state_name ? d.state_name : "N/A",
    country_name: d.country_name ? d.country_name : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.category_name
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
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "category_name",
      headerName: "Pin",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
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
      field: "country_code",
      headerName: "Tehsil",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
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
      field: "district_name",
      headerName: "District",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
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
      field: "state_name",
      headerName: "State",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
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
      field: "country_name",
      headerName: "Country",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
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
      width: 200,
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
                    handleButtonClick("edit-pin", cellValues.row.id);
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
      inputplaceholder: "Search Pin name",
      // export: "yes",
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
      </div>
    </>
  );
}
export default ViewPin;
