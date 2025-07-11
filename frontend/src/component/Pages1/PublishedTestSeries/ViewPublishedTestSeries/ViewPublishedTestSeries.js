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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactComponent as AddQuestionIcon } from "../../../images/examimage/addquestion.svg";
import { ReactComponent as DashboardIcon } from "../../../images/examimage/dashboard.svg";
import { ReactComponent as ResultIcon } from "../../../images/examimage/result.svg";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import EditPublishedTestSeries from "../EditPublishedTestSeries/EditPublishedTestSeries";

function ViewPublishedTestSeries() {
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
  const [testSeriesData, setTestSeriesData] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setOpen(!open);
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
    navigate(`/admin/${type}/${rowId}`);
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

  const rows = testSeriesData.map((d) => ({
    id: d.id ? d.id : "N/A",
    name: d.name ? d.name : "N/A",
    code: d.code ? d.code : "N/A",
    duration: d.duration ? d.duration : "N/A",
    start_date: d.start_date ? d.start_date : "N/A",
    start_time: d.start_time ? d.start_time : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      // Lowercase the search query for case-insensitive comparison
      const query = searchQuery.toLowerCase();

      // Convert duration, start_date, and start_time to lowercase strings for comparison
      // Note: Assuming `start_date` and `start_time` are already formatted as strings
      const durationStr = String(d.duration).toLowerCase();
      const startDateStr = d.start_date.toLowerCase();
      const startTimeStr = d.start_time.toLowerCase();

      // Check if any field contains the search query
      const isNameMatch = d.name.toLowerCase().includes(query);
      const isCodeMatch = d.code.toLowerCase().includes(query);
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
      headerName: "S. No.",
      headerClassName: "super-app-theme--header",
      width: 72,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 100,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "category ",
      headerName: "Category",
      headerClassName: "super-app-theme--header",
      width: 160,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "cost",
      headerName: "Cost",
      headerClassName: "super-app-theme--header",
      width: 240,
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },

    {
      field: "remark",
      headerName: "Remark",
      headerClassName: "super-app-theme--header",
      width: 160,
      flex: 1,
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
      flex: 1,
      disableColumnMenu: true,
      sortable: true,
      headerAlign: "center",
      autoPageSize: false,
    },
    {
      field: "active_status",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      width: 200,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const isActive = cellValues.row.active_status === "active";

        return (
          <div
            className={`${classes.publishactionpaper} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <Paper>
              <IconButton>
                <LightTooltip title="Publish">
                  <TurnedInNotIcon />
                </LightTooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  handleButtonClick("editpublishedtestquestion", cellValues.row.id);
                }}
              >
                <LightTooltip title="Edit Questions">
                  <AddCircleOutlineIcon />
                </LightTooltip>
              </IconButton>

              <IconButton
                onClick={handleOpenClose}
              >
                <LightTooltip title="Edit">
                  <EditOutlinedIcon />
                </LightTooltip>
              </IconButton>
            </Paper>
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
              <EditPublishedTestSeries
                handleOpenClose={handleOpenClose}
                open={open}
                rows={rows}
              />
            </Modal>
          </div>
        );
      },
    },
  ];

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Quiz Name",
      inputplaceholder: "Search Published Testseries",
      exportimport: "yes",
    },
  ];

  const fetchTestSeriesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success === true) {
        const formattedData = response.data.test_series.map((series) => ({
          ...series,
          start_date: new Date(series.start_date)
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, " "),
          // start_time: new Date(
          //   "1970-01-01T" + series.start_time + "Z"
          // ).toLocaleTimeString("en-US", {
          //   hour: "numeric",
          //   minute: "numeric",
          //   hour12: true,
          // }),
        }));
        setTestSeriesData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching test series data:", error);
    }
  };

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
export default ViewPublishedTestSeries;
