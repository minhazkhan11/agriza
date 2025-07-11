import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {  Paper, Popover, Tooltip, withStyles ,Modal,Backdrop, Button} from "@material-ui/core";
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
import AddEventPopup from "./Commentpopup";


function ViewDoubtForumList() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState();
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

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [teachers, setTeachers] = useState([]);
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
    setInfo(data);
    setOpen(!open);
    
  }

  const handleButtonClick = (type, rowId) => {
    if (type === "editquizz") {
      navigate(`/admin/editquizz/${rowId}`);
    }
  };
const [count,setCount]=useState("");
const [doubtPending,setDoubtPending]=useState("");
const [rows,setRows]=useState([]);

  const fetchData = async () => {
    const decryptedToken = decryptData(sessionStorage.getItem("token"));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success) {
        setCount(response.data?.count);
        setDoubtPending(response.data?.doubt_pending);
        const formattedRows = response.data.doubtForum.map((row, index) => ({
          id: row.id ? row.id : "",
          sno: index + 1,
          name: row.addedBy.full_name ? row.addedBy.full_name : "",
          doubt: row.question ? row.question : "",
          
          reports: row. question_commit ? row. question_commit : "",
          active_status: row.active_status ? row.active_status : "",
          action: row.active_status ? row.active_status : "",
        }));
        setRows(formattedRows);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
 

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

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
      const updateddatatata = teachers.filter((data) => data.id !== rowId);
      setTeachers(updateddatatata);
    } catch (error) {
      toast.error("Teacher is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      doubtForum: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Doubt status changed successfully", response);
        fetchData();
        toast.success("Doubt status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Teacher status:", error);
        toast.error("Doubt status is not changed");
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
      field: "sno",
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
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "doubt",
      headerName: "Doubt",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <div  style={{ width: "50px", height: "50px" }} dangerouslySetInnerHTML={{ __html: params.row.doubt }} />
      ),
    },
   
    {
      field: "reports",
      headerName: "Reported comments",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
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
                  onClick={()=>{handleOpenClose(  cellValues.row.id)}}>
                  <LightTooltip title="comments">
                    <TextsmsOutlinedIcon />
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
      // inputlable: "Enter Name / Code*",
      inputplaceholder: "Search By Name or ID",
      allcomments: "yes",

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
          className={classes.modal}
          open={open}
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <AddEventPopup
            handleOpenClose={handleOpenClose}
            open={open}
            info={info}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewDoubtForumList;

