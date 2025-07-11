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
import EditPublishedEbook from "../EditPublishedEbook/EditPublishedEbook";

function ViewPublishedEbooks() {
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
  const [ebook, setEbook] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setInfo(data);
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
  const fetchTestSeriesData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/publish/ebooks`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success === true) {
        
        setEbook(response?.data?.ebooks);
      }
    } catch (error) {
      console.error("Error fetching test series data:", error);
    }
  };

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
      const updateddatatata = ebook.filter(
        (data) => data.id !== rowId
      );
      setEbook(updateddatatata);
    } catch (error) {
      toast.error("Test Series is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, ) => {
    // const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      ebook: {
        active_status: "publish",
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/publish/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        fetchTestSeriesData();
        toast.success("Ebook Publish status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Test Series status:", error);
        toast.error("Ebook Publish status is not changed");
      });
  };

  const rows = ebook.map((d) => ({
    id: d.id ? d.id : "N/A",
    name: d.ebook_name ? d.ebook_name : "N/A",
    exam: d.exam && d.exam.exam_name ? d.exam.exam_name : "N/A",
    cost: d.selling_cost ? d.selling_cost : "N/A",
    remark: d.remark ? d.remark : "N/A",
   
    status:
    d.active_status === "inactive"
      ? "Unpublished"
      : d.active_status === "active"
      ? "Published"
      : d.active_status === "publish"
      ? "Published request"
      : d.active_status === "refused"
      ? "Refused"
      : d.active_status ? d.active_status : "N/A",
      // active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
  .filter((d) => {
    const query = searchQuery.toLowerCase();

    const durationStr = String(d.cost || "").toLowerCase();
    const startDateStr = (d.remark || "").toLowerCase();

    const isNameMatch = (d.name || "").toLowerCase().includes(query);
    const isCodeMatch = (d.exam?.toLowerCase() || "").includes(query);
    const isDurationMatch = durationStr.includes(query);
    const isStartDateMatch = startDateStr.includes(query);

    return (
      isNameMatch ||
      isCodeMatch ||
      isDurationMatch ||
      isStartDateMatch 
    );
  })
  .map((row, index) => ({
    ...row,
    srno: index + 1, 
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
      headerAlign: "center",
      width: 20,
      sortable: true,
      disableColumnMenu: true,
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
      field: "exam",
      headerName: "Exam",
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
        const isActive = cellValues.row.status === "Published request" || cellValues.row.status === "Published";

        return (
          <div
            className={`${classes.publishactionpaper} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          > 
           {! isActive ? (
              <Paper >
                <IconButton onClick={()=>handleStatus(cellValues.row.id)}>
                  <LightTooltip title="Publish">
                    <TurnedInNotIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleButtonClick("edituploadplans", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Edit Upload Plans">
                    <AddCircleOutlineIcon />
                  </LightTooltip>
                </IconButton>

                <IconButton
                  onClick={()=>handleOpenClose(cellValues.row.id)}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
                  </LightTooltip>
                </IconButton>
              </Paper>
                ) : null}
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
              <EditPublishedEbook
                handleOpenClose={handleOpenClose}
                open={open}
                rows={rows}
                info={info}
                handleClose={handleClose}
                fetchTestSeriesData={fetchTestSeriesData}
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
      inputplaceholder: "Search Published Ebooks",
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
export default ViewPublishedEbooks;
