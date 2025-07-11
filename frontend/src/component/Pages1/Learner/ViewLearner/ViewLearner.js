import React, { useState, useEffect } from "react";
import LearnerTableViewSearch from "../../../CustomComponent/LearnerTableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Button, Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
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
import FilterListIcon from "@material-ui/icons/FilterList";

function ViewLearner() {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height:'maxh67',
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [learners, setLearners] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "editlearners") {
      navigate(`/admin/editlearners/${rowId}`);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLearners(response.data.learners);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Learner deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Learner deleted successfully");
      const updateddatatata = learners.filter((data) => data.id !== rowId);
      setLearners(updateddatatata);
    } catch (error) {
      toast.error("Learner is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      learner: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Learner status changed successfully", response);
        fetchData();
        toast.success("Learner status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Learner status:", error);
        toast.error("Learner status is not changed");
      });
  };

  const rows = learners.map((d) => ({
    id: d.id || "N/A",
    full_name: d.full_name || "N/A",
    guardian_name:
      d.learner_information && d.learner_information.guardian_name
        ? d.learner_information.guardian_name
        : "N/A",
    phone: d.phone || "N/A",
    email: d.email || "N/A",
    course_name:
      d.learner_information && d.learner_information.course
        ? d.learner_information.course.course_name
        : "N/A",
    batch_name:
      d.learner_information && d.learner_information.batch
        ? d.learner_information.batch.batch_name
        : "N/A",
    active_status: d.active_status || "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||  d.guardian_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())  ||  d.phone
        .toLowerCase()
        .includes(searchQuery.toLowerCase())   ||  d.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase())   ||  d.course_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||  d.batch_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 20,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "full_name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "guardian_name",
      headerName: "Father Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "phone",
      headerName: "Ph.No.",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "email",
      headerName: "Email ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "course_name",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "batch_name",
      headerName: "Batch",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
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
      renderHeader: () => <>Status</>,
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
                    handleButtonClick("editlearners", cellValues.row.id);
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
      // inputlable: "Enter Name / ID*",
      inputplaceholder: "Search By Name or ID",
      exportimport: "yes",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt0_5}`}
      >
        <LearnerTableViewSearch fetchData={fetchData} learner={true} decryptedToken={decryptedToken} Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows} Heading={style} />
      </div>
    </>
  );
}
export default ViewLearner;
