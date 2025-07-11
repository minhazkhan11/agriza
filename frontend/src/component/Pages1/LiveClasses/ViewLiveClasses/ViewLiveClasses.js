import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {
  Backdrop,
  Modal,
  Paper,
  Popover,
  Tooltip,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CastForEducationIcon from "@material-ui/icons/CastForEducation";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LiveClassesPopup from "./LiveClassesPopup";

function ViewLiveClasses() {
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
  const [selectedRowId, setSelectedRowId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [liveClass, setLiveClass] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpenClose = (rowId) => {
    setOpen(!open);
    setSelectedRowId(rowId);
  };

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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLiveClass(response.data.live_classes);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFormattedTime = (time) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const formattedTime = date?.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  };

  const row = liveClass?.map((data, index) => ({
    id: data.id,
    srno: index + 1,
    name: data.live_class_name ? data.live_class_name : data.webinar_name,
    batch: data.batch.batch_name ? data.batch.batch_name : "N/A",
    course: data.course.course_name ? data.course.course_name : "N/A",
    subject: data.subject.subject_name ? data.subject.subject_name : "N/A",
    meeting_id: data.zoom_meeting_id ? data.zoom_meeting_id : "N/A",
    start_date: data.start_date
      ? new Date(data.start_date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : new Date(data.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    end_date: data.end_date
      ? new Date(data.end_date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    start_time: data.start_time ? getFormattedTime(data.start_time) : "N/A",
    end_time: data.end_time ? getFormattedTime(data.end_time) : "N/A",
    type: data.type ? data.type : "N/A",
    status: data.status ? data.status : "N/A",
    active_status: data.active_status ? data.active_status : "N/A",
  }));
  const filteredRows = row
    .filter((d) => {
      const isSearchMatch = Object.values(d)
        .join(" ") // Join all values into a single string
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((filteredRow, index) => ({
      ...filteredRow,
      srno: index + 1,
    }));

  // Function to delete a book
  const deleteDataOfRow = async (rowId, type) => {
    const typeName = type === "live_class" ? "Live Class" : "Webinar";
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      setTimeout(() => {
        toast.success(`${typeName} deleted successfully`);
      }, 1000);
      fetchData();
      handleClose();

      const updateddatatata = liveClass.filter((data) => data.id !== rowId);
      setLiveClass(updateddatatata);
    } catch (error) {
      toast.error(`${typeName} is not deleted`);
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus, type) => {
    const typeName = type === "live_class" ? "Live Class" : "Webinar";

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      live_class: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/liveclasses/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log(`${typeName} status changed successfully`, response);
        fetchData();
        toast.success(`${typeName} status changed successfully`);
        handleClose();
      })
      .catch((error) => {
        console.error(`Error changed ${typeName} status:`, error);
        toast.error(`${typeName} is not changed`);
      });
  };

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
      width: 40,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 120,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "course",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "batch",
      headerName: "Batch",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "subject",
      headerName: "Subject",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 150,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 120,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "end_date",
      headerName: "End Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 120,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "end_time",
      headerName: "End Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.value === "live_class" ? "live class" : "webinar"}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "active_status",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      width: 100,
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
                {cellValues.row.status !== "publish" && (
                  <IconButton
                    onClick={() => {
                      handleOpenClose(cellValues.row.id);
                    }}
                  >
                    <LightTooltip title="Publish">
                      <TurnedInNotIcon />
                    </LightTooltip>
                  </IconButton>
                )}
                {cellValues.row.type === "webinar" ? (
                  <IconButton>
                    <LightTooltip title="Host">
                      <CastForEducationIcon />
                    </LightTooltip>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      handleButtonClick(
                        "liveclassesschedule",
                        cellValues.row.id
                      );
                    }}
                  >
                    <LightTooltip title="Schedule">
                      <ScheduleIcon />
                    </LightTooltip>
                  </IconButton>
                )}
                <IconButton
                  onClick={(event) => {
                    handleStatus(
                      cellValues.row.id,
                      cellValues.row.active_status,
                      cellValues.row.type
                    );
                  }}
                >
                  <LightTooltip title="Inactive">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleButtonClick("editliveclasses", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton>
                  <LightTooltip title="Delete">
                    <DeleteIcon
                      onClick={() =>
                        deleteDataOfRow(cellValues.row.id, cellValues.row.type)
                      }
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
      // inputlable: "Enter classes Name",
      inputplaceholder: "Search By classes",
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
        <LiveClassesPopup
          handleOpenClose={handleOpenClose}
          open={open}
          selectedRowId={selectedRowId}
          fetchData={fetchData}
        />
      </Modal>
    </>
  );
}
export default ViewLiveClasses;
