import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import useStyles from "../../../../styles";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import TableView from "../../../CustomComponent/TableView";
import QuestionListHead from "./QuestionListHead";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ReactComponent as PreviewIcon } from "../../../images/onlinevideo/PreviewIcon.svg";

function LectureList() {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");

  const style = [
    {
      style: "viewtable",
      height: "h42vh",
    },
  ];
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };
  const handleButtonClickQuestion = (type, rowId) => {
    navigate(`/admin/${type}/${rowId}`);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/by_exam/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Fetched data:", response.data);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Question deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Question deleted successfully");
      const updateddatatata = questions.filter((data) => data.id !== rowId);
      setQuestions(updateddatatata);
    } catch (error) {
      toast.error("Question is not deleted");
      console.error("Error deleting data: ", error);
    }
  };
  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      question: {
        active_status: newStatus,
        id: iddd,
      },
    };
    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Question status changed successfully", response);
        fetchData();
        toast.success("Question status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Question status:", error);
        toast.error("Question status is not changed");
      });
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "editexam") {
      navigate(`/admin/editexam/${rowId}`);
    }
  };

  const columns = [
    {
      field: "srno",
      headerName: "Sr.No.",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return(
        <Typography className={`${classes.dflex} ${classes.alignitemsstart}`}>{cellValues.row.id}</Typography>
        );
      },
    },
    {
      field: "name",
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
      field: "lectureno",
      headerName: "Lecture No.",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
  

    {
      field: "active_status",
      headerName: "Status",
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
                  // onClick={() => {
                  //   handleButtonClickQuestion(
                  //     "addquestiononlinevideo",
                  //   );
                  // }}
                >
                  <LightTooltip title="Add Question">
                    <PreviewIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                // onClick={(event) => {
                //   handleStatus(
                //     cellValues.row.id,
                //     cellValues.row.active_status
                //   );
                // }}
                >
                  <LightTooltip title="Inactive">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                // onClick={() => {
                //   handleButtonClick("editcoaching", cellValues.row.id);
                // }}
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
  const rows = [
    {
      id: 1,
      name: "Lecture 01",
      lectureno: "3",
      date: "26 Aug 23 ( 10:00 AM)",
      active_status: "active",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <div
        className={`${classes.mt1} ${classes.bgwhite} ${classes.inputpadding} ${classes.inputborder}`}
      >
        <QuestionListHead />
        <TableView columns={columns} rows={rows} Heading={style} />
      </div>
    </>
  );
}
export default LectureList;
