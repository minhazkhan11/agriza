import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Modal,
  Backdrop,
} from "@material-ui/core";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import useStyles from "../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { useParams } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import TableView from "../../../CustomComponent/TableView";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import EditSchedulePopup from "./EditSchedulePopup";
import Reschedule from "@material-ui/icons/Update";
import Unproceed from "@material-ui/icons/TimerOff";
import { ReactComponent as OrangeDot } from "../../../images/TimetableIcon/orangedot.svg";
import { ReactComponent as GreenDot } from "../../../images/TimetableIcon/greendot.svg";
import { ReactComponent as SkyDot } from "../../../images/TimetableIcon/skydot.svg";
import { ReactComponent as GreyDot } from "../../../images/TimetableIcon/greydot.svg";
import { ReactComponent as RedDot } from "../../../images/TimetableIcon/reddot.svg";

function TableSchedulingList({
  fetchScheduleData,
  scheduleData,
  setScheduleData,
  timetableData,
}) {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "maxh52",
    },
  ];
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [openEditSchedule, setOpenEditSchedule] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const handleEditOpenClose = (id) => {
    setOpenEditSchedule(!openEditSchedule);
    setSelectedRowId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/schedule/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Schedule deleted:", response.data);
      fetchScheduleData();
      handleClose();
      toast.success("Schedule deleted successfully");
      const updateddatatata = scheduleData.filter((data) => data.id !== rowId);
      setScheduleData(updateddatatata);
    } catch (error) {
      toast.error("Schedule is not deleted");
      console.error("Error deleting data: ", error);
    }
  };
  const handleStatus = (currentStatus, iddd) => {
    handleClose();
    const data = {
      schedule: {
        status: currentStatus,
        id: iddd,
      },
    };
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/schedule/update/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Schedule status changed successfully", response);
        fetchScheduleData();
      })
      .catch((error) => {
        console.error("Error changed Schedule status:", error);
      });
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <Typography
          className={`${classes.fontSize7} ${classes.texttransformcapitalize}`}
        >
          {cellValues.value}
        </Typography>
      ),
    },
    {
      field: "teacher",
      headerName: "Teacher",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <Typography
          className={`${classes.fontSize7} ${classes.texttransformcapitalize}`}
        >
          {cellValues.value}
        </Typography>
      ),
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
      renderCell: (cellValues) => (
        <div>
          {new Date(cellValues.row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      field: "start_time",
      headerName: "Start Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const [hours, minutes] = cellValues?.value?.split(":");

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const formattedTime = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return <div>{formattedTime}</div>;
      },
    },
    {
      field: "end_time",
      headerName: "End Time",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const [hours, minutes] = cellValues?.value?.split(":");

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const formattedTime = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return <div>{formattedTime}</div>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <Typography
          className={`${classes.fontSize7} ${classes.texttransformcapitalize}`}
        >
          {cellValues.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.w100}`}
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
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.fontsize1} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              {cellValues.row.status === "upcoming" ? (
                <GreyDot className={classes.mr0_3} />
              ) : cellValues.row.status === "unprocessed" ? (
                <RedDot className={classes.mr0_3} />
              ) : cellValues.row.status === "underprocess" ? (
                <SkyDot className={classes.mr0_3} />
              ) : cellValues.row.status === "reschedule" ? (
                <OrangeDot className={classes.mr0_3} />
              ) : (
                <GreenDot className={classes.mr0_3} />
              )}
              {cellValues.row.status}
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
                    handleStatus("unprocessed", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Unprocessed">
                    <Unproceed />
                  </LightTooltip>
                </IconButton>

                <IconButton
                  // onClick={() => {
                  //   handleStatus("reschedule", cellValues.row.id);
                  // }}
                  onClick={() => {
                    handleEditOpenClose(cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Reschedule">
                    <Reschedule />
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

  const rows = scheduleData.map((d, index) => ({
    id: d.id ? d.id : "N/A",
    srno: index + 1, // Assuming you want to start serial numbers from 1
    start_time: d?.start_time ? d?.start_time : "N/A",
    end_time: d?.end_time ? d?.end_time : "N/A",
    date: d?.select_date ? d?.select_date : "N/A",
    teacher: d.teacher_name ? d.teacher_name : "N/A",
    type: d.type ? d.type : "N/A",
    title: d.tittle ? d.tittle : "N/A",
    status: d.status ? d.status : "N/A",
  }));

  return (
    <>
      <ToastContainer />
      <div
        className={` ${classes.py2} ${classes.bgwhite} ${classes.inputpadding} ${classes.inputborder}`}
      >
        <TableView columns={columns} rows={rows} Heading={style} />
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openEditSchedule}
        onClose={handleEditOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <EditSchedulePopup
          handleOpenClose={handleEditOpenClose}
          timetableData={timetableData}
          handleStatus={handleStatus}
          open={openEditSchedule}
          fetchScheduleData={fetchScheduleData}
          timetableId={rowId}
          rowId={selectedRowId}
        />
      </Modal>
    </>
  );
}
export default TableSchedulingList;
