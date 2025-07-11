import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
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
import QuestionListHead from "./QuestionListHead(Quiz)"

import CloseIcon from '@material-ui/icons/Close';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import EditSingleQuiz from "./EditSingle(Quiz)";


function QuestionListQuiz() {
  const classes = useStyles();
  const style = [
    {
      height:'h42vh',
      style: "viewtable",
    },
  ];
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    outline: 'none',
    width: '75%',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '4px',
    position: 'relative', 
  };
  
  const modalCloseButtonStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'gray',
    margin: '5px', 
  };
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
};

const handleEditQuestionClick = (questionId, examId) => {
  setSelectedQuestion({ questionId, examId });
  setIsModalOpen(true); 
  handleClose();
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
      .put(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/question/status`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
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
    if (type === "editsinglequiz") {
      navigate(`/admin/editsinglequiz/${rowId}`);
    }
  };


  const columns = [
    {
      field: "srno",
      headerName: "Sr.No",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "question",
      headerName: "QUESTIONS",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div dangerouslySetInnerHTML={{ __html: cellValues.row.question }} />
      ),
    },
    {
      field: "question_type",
      headerName: "Question Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "subject_name",
      headerName: "Subject",
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
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
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
                    handleEditQuestionClick(cellValues.row.id, cellValues.row.exam_id);
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
  const dummydata = [
    {
      id: 1,
      srno: 1,
      question: "Question 01",
      question_type: "Import In Bulk",
      subject_name: "Maths",
      active_status: "Active"
    },
  ];
  const rows = questions.map((d, index) => ({
    id: d.id?d.id:"N/A",
    srno: index + 1, // Assuming you want to start serial numbers from 1
    question_type: d.question_type?d.question_type:"N/A",
    question: d.question?d.question:"N/A",
    subject_name: d.subject.subject_name?d.subject.subject_name:"N/A",
    duration: d.duration?d.duration:"N/A",
    total_score: d.total_score?d.total_score:"N/A",
    start_date: d.start_date?d.start_date:"N/A",
    active_status: d.active_status?d.active_status:"N/A",
  }));



  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.bgwhite} ${classes.inputpadding} ${classes.inputborder}`}
      >
        <QuestionListHead />
        <TableView columns={columns} rows={dummydata} Heading={style}/>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        style={modalStyle}
      >
        <div style={modalContentStyle}>
          <IconButton 
            onClick={handleCloseModal} 
            style={modalCloseButtonStyle}>
            <CloseIcon />
          </IconButton>
          {selectedQuestion && (
            <EditSingleQuiz
              questionId={selectedQuestion.questionId} 
              examId={selectedQuestion.examId}
              handleCloseModal={handleCloseModal}
              fetchData={fetchData}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
export default QuestionListQuiz;
