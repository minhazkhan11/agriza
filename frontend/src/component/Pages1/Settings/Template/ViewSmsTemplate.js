import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import useStyles from "../../../../styles";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TableView from "../../../CustomComponent/TableView";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";

function ViewSmsTemplate({ handleChange }) {
  const style = [
    {
      style: "viewtable",
      height: "h54vh",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const classes = useStyles();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatesms`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setFetchedTemplates(response.data.template);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatesms/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Sms Template deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Sms Template deleted successfully");
    } catch (error) {
      toast.error("Sms Template is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      template: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/templatesms/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Sms Template status changed successfully", response);
        fetchData();
        toast.success("Sms Template status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Sms Template status:", error);
        toast.error("Sms Template status is not changed");
      });
  };

  const rows = fetchedTemplates.map((data, index) => ({
    id: data.id ? data.id : "N/A",
    srno: index + 1,
    templatename: data.name ? data.name : "N/A",
    template: data.message ? data.message : "N/A",
    template_id: data.template_id ? data.template_id : "N/A",
    remark: data.remark ? data.remark : "N/A",
    status: data.status ? data.status : "N/A",
    active_status: data.active_status ? data.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch =
        d?.templatename?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        false ||
        d?.template?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        false ||
        d?.active_status?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        false;

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

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
      field: "templatename",
      headerName: "Template Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "template",
      headerName: "Template",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "template_id",
      headerName: "Temp Id",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
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
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.status === "reject"
              ? "Rejected"
              : cellValues.row.status === "approve"
              ? "Aproved"
              : cellValues.row.status === "pending"
              ? "Pending"
              : ""}
          </>
        );
      },
    },
    {
      field: "active_status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
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
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize} ${classes.fontsize6}`}
              variant="h6"
            >
              {cellValues.row.active_status === "active" ? (
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
                  <LightTooltip
                    title={
                      cellValues.row.active_status === "active"
                        ? "Inactive"
                        : "Active"
                    }
                  >
                    {cellValues.row.active_status === "active" ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </LightTooltip>
                </IconButton>
                {cellValues.row.status === "reject" && (
                  <IconButton
                    onClick={(e) => handleChange(e, 6, cellValues.row.id)}
                  >
                    <LightTooltip title="Edit">
                      <EditOutlinedIcon />
                    </LightTooltip>
                  </IconButton>
                )}
                <IconButton onClick={() => deleteDataOfRow(cellValues.row.id)}>
                  <LightTooltip title="Delete">
                    <DeleteIcon />
                  </LightTooltip>
                </IconButton>
              </Paper>
            </Popover>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <FormControl className={`${classes.w100}`}>
        <div className={`${classes.py2} ${classes.px1_5} `}>
          <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
            <Typography className={`${classes.fw600}`}>Sms Template</Typography>
            <Button
              className={`${classes.fw600} ${classes.bluebtn}`}
              onClick={(e) => handleChange(e, 3)}
            >
              Create Sms Template
            </Button>
          </div>
          <div
            className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w100} ${classes.mt1}`}
          >
            <TableView columns={columns} rows={filteredRows} Heading={style} />
          </div>
        </div>
      </FormControl>
    </>
  );
}
export default ViewSmsTemplate;
