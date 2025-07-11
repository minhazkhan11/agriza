import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { ReactComponent as AddQuestionIcon } from "../../../images/examimage/addquestion.svg";
import { ReactComponent as DashboardIcon } from "../../../images/examimage/dashboard.svg";
import { ReactComponent as ResultIcon } from "../../../images/examimage/result.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ToastContainer, toast } from "react-toastify";

function ViewExam() {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height:'maxh67',
    },
  ];
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [exams, setExams] = useState([]);

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleButtonClickQuestion = (type) => {
  //   navigate(`/admin/${type}`);
  // };

  const handleButtonClickQuestion = (type, rowId) => {
    navigate(`/admin/${type}/${rowId}`);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "editexam") {
      navigate(`/admin/editexam/${rowId}`);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Fetched data:", response.data);
      setExams(response.data.exams);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Exam deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Exam deleted successfully");
      const updateddatatata = exams.filter((data) => data.id !== rowId);
      setExams(updateddatatata);
    } catch (error) {
      toast.error("Exam is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      exam: {
        active_status: newStatus,
        id: iddd,
      },
    };
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/status`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        console.log("Exam status changed successfully", response);
        fetchData();
        toast.success("Exam status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Exam status:", error);
        toast.error("Exam status is not changed");
      });
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
      field: "exam_name",
      headerName: "Exam Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 500,
      flex: 3,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      valueGetter: (params) =>
        params.value.charAt(0).toUpperCase() + params.value.slice(1),
    },
    {
      field: "course_name",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 2,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "questions",
      headerName: "Questions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "duration",
      headerName: "Duration",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "total_score",
      headerName: "Total Score",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
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
      width: 110,
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
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 200,
      autoPageSize: false,
      renderCell: (params) => {
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <IconButton
              onClick={() => {
                handleButtonClickQuestion("addquestion", params.row.id);
              }}
            >
              <LightTooltip title="Add Question">
                <AddQuestionIcon />
              </LightTooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                handleButtonClickQuestion("examdashboard", params.row.id);
              }}
            >
              <LightTooltip title="Dashboard">
                <DashboardIcon />
              </LightTooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                handleButtonClickQuestion("examresult", params.row.id);
              }}
            >
              <LightTooltip title="Result">
                <ResultIcon />
              </LightTooltip>
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "active_status",
      headerName: "STATUS",
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
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              {isActive ? <ActiveIcon className={`${classes.mr0_5}`}/> : <InactiveIcon fontSize="small" className={`${classes.mr0_5}`}/>}
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
                  <LightTooltip title="Disable">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleButtonClick("editexam", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="edit">
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

  const rows = exams.map((d) => ({
    id: d.id ? d.id : "N/A",
    exam_name: d.exam_name ? d.exam_name : "N/A",
    course_name: d.course.course_name ? d.course.course_name : "N/A",
    questions: d.question_count ? d.question_count : "N/A",
    duration: d.duration ? d.duration : "N/A",
    total_score: d.total_score ? d.total_score : "N/A",
    start_date: d.start_date ? d.start_date : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));
  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.exam_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || d.course_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || d.questions.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())  || d.duration.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())  || d.total_score.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())  || d.start_date.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));
  const Heading = [
    {
      id: 1,
      // inputlable: "Select Exam*",
      inputplaceholder: "Search By Exam",
      // export: "yes",
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
export default ViewExam;
