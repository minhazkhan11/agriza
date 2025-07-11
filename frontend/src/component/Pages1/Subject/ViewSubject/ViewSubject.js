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
import { Link, useNavigate } from "react-router-dom";

import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewSubject() {
  const classes = useStyles();
  const style = [
    {
      height:'maxh67',
      style: "viewtable",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "editsubject") {
      navigate(`/admin/editsubject/${rowId}`);
    }
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Fetched data:", response.data);
      setSubjects(response.data.subjects);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Subject deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Subject deleted successfully");
      const updateddatatata = subjects.filter((data) => data.id !== rowId);
      setSubjects(updateddatatata);
    } catch (error) {
      toast.error("Subject is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const data = {
      subject: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/subject/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Subject status changed successfully", response);
        fetchData();
        toast.success("Subject status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Subject status:", error);
        toast.error("Subject status is not changed");
      });
  };

  const rows = subjects.map((d) => ({
    id: d.id?d.id:"N/A",
    subject_name: d.subject_name?d.subject_name:"N/A",
    course_name: d.course.course_name?d.course.course_name:"N/A",
    batch_name: d.batch.batch_name?d.batch.batch_name:"N/A",
    active_status: d.active_status?d.active_status:"N/A",
  }));

  const filteredRows = rows
  .filter((d) => {
    const isSearchMatch = d.subject_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || d.course_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || d.batch_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) 

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
      field: "subject_name",
      headerName: "Subject Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "course_name",
      headerName: "Course Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "batch_name",
      headerName: "Batch Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   width: 200,
    //   flex: 2,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => {
    //     return (
    //       <div
    //         className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
    //       >
    //         <Link>Quizzes</Link>
    //         <Link>Notes</Link>
    //         <Link>Quizzes</Link>
    //         <Link>Test Series</Link>
    //         <Link>Previous year paper</Link>
    //       </div>
    //     );
    //   },
    // },

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
                <ActiveIcon className={`${classes.mr0_5}`}/>
              ) : (
                <InactiveIcon fontSize="small" className={`${classes.mr0_5}`}/>
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
                    handleButtonClick("editsubject", cellValues.row.id);
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
      // inputlable: "Subject / Course",
      inputplaceholder: "Search by subject",
      // export: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows} Heading={style}/>
      </div>
    </>
  );
}
export default ViewSubject;
