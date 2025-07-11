import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
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
import ScheduleIcon from '@material-ui/icons/Schedule';

function ViewTimetable() {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "maxh60",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [timetableData, setTimetableData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    navigate(`/admin/${type}/${rowId}`);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/timetable`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setTimetableData(response?.data?.timetable);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/timetable/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Timetable deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Timetable deleted successfully");
      const updateddatatata = timetableData.filter((data) => data.id !== rowId);
      setTimetableData(updateddatatata);
    } catch (error) {
      toast.error("Timetable is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      timetable: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/timetable/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Timetable status changed successfully", response);
        fetchData();
        toast.success("Timetable status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Timetable status:", error);
        toast.error("Timetable status is not changed");
      });
  };

  const rows = timetableData.map((d) => ({
    id: d?.id ? d?.id : "N/A",
    batchname: d?.batch ? d?.batch.batch_name : "N/A",
    start_date: d?.start_date ? d?.start_date : "N/A",
    end_date: d?.end_date ? d?.end_date : "N/A",
    totaldaysavailable: d?.total_days_available
      ? d?.total_days_available
      : "N/A",
    totaldaysfortraining: d?.total_training_days
      ? d?.total_training_days
      : "N/A",
    active_status: d?.active_status ? d?.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch =
        d?.batchname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.start_date
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        d.end_date
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        d.totaldaysavailable
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        d.totaldaysfortraining
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  function formatTotalDaysAvailable(totalDays) {
    const months = Math.floor(totalDays / 30); // Assuming 30 days per month
    const remainingDays = totalDays % 30;
  
    let result = '';
  
    if (months > 0) {
      result += `${months} month${months > 1 ? 's' : ''}`;
    }
  
    if (remainingDays > 0) {
      if (result !== '') {
        result += ' ';
      }
      result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
  
    return result;
  }
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
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "batchname",
      headerName: "Batch Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div>
          {new Date(cellValues.row.start_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      field: "end_date",
      headerName: "End Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div>
          {new Date(cellValues.row.end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      field: "totaldaysavailable",
      headerName: "Total Available Days",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div>
          {formatTotalDaysAvailable(cellValues.row.totaldaysavailable)}
        </div>
      ),
    },
    {
      field: "totaldaysfortraining",
      headerName: "Total Days For Training",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div>
          {formatTotalDaysAvailable(cellValues.row.totaldaysfortraining)}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
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
              className={`${classes.dflex} ${classes.alignitemscenter}`}
              variant="h6"
            >
              {isActive ? <ActiveIcon /> : <InactiveIcon fontSize="small" />}
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
                  onClick={() => {
                    handleButtonClick("edittimetable", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
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
                  <LightTooltip title="Disable">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleButtonClick("timetablesettings", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Add Schedule">
                    <ScheduleIcon />
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

  const row = [
    {
      id: 1,
      batchname: "PGDAC _01",
      start: "24 nov 2023",
      end: "24 Mar 2024",
      totaldaysavailable: "5 Months 15 days",
      totaldaysfortraining:
        "4 Months 18 days (115 days Training + 20 Sundays  + 5 Holidays )",
      totalweeks: "200 / 300",
      active_status: "Active",
    },
  ];
  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search By Batch Name",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows} Heading={style} />
      </div>
    </>
  );
}
export default ViewTimetable;
