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
import QuestionListHead from "./QuestionListHead(Quiz)";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CloseIcon from "@material-ui/icons/Close";
import EditSingleTest from "./EditSingle(TestSeries)";

function QuestionListTestSeries() {
  const classes = useStyles();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    outline: "none",
    width: "75%",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "4px",
    position: "relative",
  };

  const modalCloseButtonStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    color: "gray",
    margin: "5px",
  };

  const style = [
    {
      height: "h49vh",
      style: "viewtable",
    },
  ];
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries_questions/by_testseries/${rowId}`,
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries_questions/${rowId}`,
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries_questions/status`,
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

  const handleEditQuestionClick = (questionId, testSeriesId) => {

    setSelectedQuestion(questionId);
    setSelectedTest(testSeriesId);
    setIsModalOpen(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };













  


  const [examName, setExamName] = useState("");

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/testseries/${rowId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );
  
        const exam = response.data.test_series;

        setExamName(exam.name);
    
      } catch (error) {
        console.error("Error fetching exam data: ", error);
      }
    };
  
    fetchExamData();
  }, [rowId, decryptedToken]);



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
      field: "question_en",
      headerName: "Question",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => {
        // Check if question_en is available and not empty
        const content =
          cellValues.row.question_en && cellValues.row.question_en.trim() !== ""
            ? cellValues.row.question_en
            : cellValues.row.question_hi || "<p>No question provided</p>";

        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      },
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
                  <LightTooltip title="Disable">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>

                <IconButton
                  onClick={() => {
                    const questionId = cellValues.row.id;
                    const testSeriesId = cellValues.row.test_series_id; 
                    handleEditQuestionClick(questionId, testSeriesId);
                  }}
                >
                  <LightTooltip title="Edit Question">
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
  const rows = questions.map((d, index) => ({
    id: d.id || "N/A",
    exam_id: d.exam_id || "N/A",
    srno: index + 1,
    question_type: d.question_type || "N/A",
    question_en:
      d.question_en || d.question_hi || "<p>No question provided</p>",
    subject_name: d?.subject?.subject_name || "N/A",
    duration: d?.duration ? d.duration : "N/A",
    total_score: d?.total_score ? d.total_score : "N/A",
    start_date: d?.start_date ? d.start_date : "N/A",
    active_status: d?.active_status ? d.active_status : "N/A",
  }));

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.bgwhite} ${classes.inputpadding} ${classes.inputborder}`}
      >
        <QuestionListHead   questionList={true} fetchData={fetchData}  examName={examName} />

        <TableView columns={columns} rows={rows} Heading={style} />
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal} style={modalStyle}>
        <div style={modalContentStyle}>
          <IconButton onClick={handleCloseModal} style={modalCloseButtonStyle}>
            <CloseIcon />
          </IconButton>

       

            <EditSingleTest
              questionId={selectedQuestion}
              testSeriesId={selectedTest}
              handleCloseModal={handleCloseModal}
              fetchData={fetchData}
              rowId={rowId}
            />

        </div>
      </Modal>
    </>
  );
}
export default QuestionListTestSeries;
