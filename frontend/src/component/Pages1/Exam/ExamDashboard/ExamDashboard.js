import React, { useEffect, useState } from "react";
import { ReactComponent as ExamIcon } from "../../../images/examimage/examicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import TableView from "../../../CustomComponent/TableView";
import ResultHead from "../../../CustomComponent/ResultHead";
import { ReactComponent as ResultIcon } from "../../../images/questionimage/resulticon.svg";
import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import { useParams, useLocation } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ReactComponent as LoginIcon } from "../../../images/DashboardLoginImage/Student login icon.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SendIcon from "@material-ui/icons/Send";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";

function ExamDashboard() {
  const classes = useStyles();
  const { rowId } = useParams();
  const location = useLocation();
  const desiredPath = `/admin/examdashboard/${rowId}`;
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const GivingExam = [
    {
      id: 1,
      pageicon: <ResultIcon />,
      mainheading: "Live Exam Dashboard",
      searchlabel: "Search Learner Name",
      placeholder: "Search By Class",
      style: "viewtable",
      relogin: "true",
      submit: "true",
      filter: "true",
      height: "h61vh",
      report1:"Export File",
    },
  ];

  const [examDetails, setExamDetails] = useState({
    examName: "",
    courseName: "",
    batchName: "",
    subjectNames: "",
    examImage: "",
  });

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/${rowId}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        const exam = response.data.exam;
        const subjectNames = exam.subjects
          .map((sub) => sub.subject_name)
          .join(", ");

        setExamDetails({
          examName: exam.exam_name,
          courseName: exam.course.course_name,
          batchName: exam.batch.batch_name,
          subjectNames: subjectNames,
          examImage: exam.image_url,
        });
      } catch (error) {
        console.error("Error fetching exam data: ", error);
      }
    };

    fetchExamData();
  }, [rowId, decryptedToken]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const [givingExamData, setGivingExamData] = useState([]);
  const [filteredGivingExamData, setFilteredGivingExamData] = useState([]);

  useEffect(() => {
    setFilteredGivingExamData(givingExamData);
  }, [givingExamData]);

  const onSearchGivingExam = (searchQuery) => {
    const filteredData = givingExamData.filter((learner) =>
      learner.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGivingExamData(filteredData);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [filterData, setFilterData] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardExamData = async (rowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/giving/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      let learners = response.data.learners;
      let formattedData = learners.map((learner, index) => ({
        id: learner.user_id,
        srno: index + 1,
        name: learner.learner_name,
        phone: learner.phone,
        email: learner.email,
        status: capitalizeFirstLetter(learner.status),
        registrationData: formatDate(learner.registration_date),
      }));

      // Apply dropdown filter
      if (filterData.toLowerCase() !== "all") {
        formattedData = formattedData.filter(
          (learner) => learner.status.toLowerCase() === filterData.toLowerCase()
        );
      }

      // Apply search filter only if there is a search query
      if (searchQuery) {
        formattedData = formattedData.filter((learner) =>
          learner.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setGivingExamData(formattedData);
    } catch (error) {
      console.error("Error fetching exam data: ", error);
    }
  };

  useEffect(() => {
    if (location.pathname === desiredPath) {
      const intervalId = setInterval(() => {
        fetchDashboardExamData(rowId);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [rowId, location.pathname]);

  useEffect(() => {
    const applyFilter = () => {
      let filteredData = [...givingExamData];

      if (filterData.toLowerCase() !== "all") {
        filteredData = filteredData.filter(
          (learner) => learner.status.toLowerCase() === filterData.toLowerCase()
        );
      }

      setFilteredGivingExamData(filteredData);
    };

    applyFilter();
  }, [givingExamData, filterData]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState();

  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Heading = [
    {
      id: 1,
      logo: examDetails.examImage,
      path: "/admin/exam",
      headings: [
        {
          id: 11,
          label: "Name",
          content: examDetails.examName,
        },
        // {
        //   id: 12,
        //   label: "Subject",
        //   content: examDetails.subjectNames,
        // },
        {
          id: 13,
          label: "Course",
          content: examDetails.courseName,
        },
        {
          id: 14,
          label: "Batch",
          content: examDetails.batchName,
        },
      ],
    },
  ];

  const handleReloginSingle = async (selectedLearnerId) => {
    handleClose();
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/live/logout/one`;
    const requestBody = {
      exam: {
        exam_id: rowId,
        learner_id: selectedLearnerId,
      },
    };
    try {
      const response = await axios.put(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });
      console.log("API Response:", response.data);
      // Display success message using toast
      toast.success(response.data.message || "Success!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error in PUT request:", error);
      toast.error(error.response?.data?.message || "An error occurred!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSingleSubmit = async (selectedLearnerId) => {
    handleClose();
    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/live/submit/one`;
    const requestBody = {
      exam: {
        exam_id: rowId,
        learner_id: selectedLearnerId,
      },
    };
    try {
      const response = await axios.put(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });
      console.log("API Response:", response.data);
      // Display success message using toast
      toast.success(response.data.message || "Success!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error in PUT request:", error);
      toast.error(error.response?.data?.message || "An error occurred!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };
  const givingcolumns = [
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
      field: "name",
      headerName: "Student Name",
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
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "email",
      headerName: "EMAIL ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "registrationData",
      headerName: "Registration Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "status",
      headerName: "Exam Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`
            ${
              cellValues.row.status === "Submitted"
                ? classes.statusSubmitted
                : cellValues.row.status === "Giving"
                ? classes.statusGiving
                : classes.statusNotGiving
            }
            ${classes.dflex} ${classes.alignitemscenter} ${
              classes.justifycenter
            } ${classes.mr1}
          `}
          >
            {cellValues.row.status === "Giving" && (
              <IconButton
                className={`${classes.w15} ${classes.bgwhite} ${classes.boxshadow4} ${classes.arrowicon}`}
                aria-describedby={id}
                onClick={(event) => {
                  handleClick(event, cellValues.row.id);
                }}
              >
                <ArrowLeftIcon fontSize="small" />
              </IconButton>
            )}
            {console.log("cellValues.row.status", cellValues.row.status)}
            <Typography
              className={`${classes.dflex} ${classes.alignitemscenter}`}
              variant="h6"
            >
              {cellValues.row.status === "Giving" && <div>Started</div>}
              {cellValues.row.status === "Submitted" && <div>Submitted</div>}
              {cellValues.row.status === "Not giving" && <div>Not Started</div>}
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
                  onClick={() => handleReloginSingle(cellValues.row.id)}
                >
                  <LightTooltip title="Re-Login">
                    <LoginIcon />
                  </LightTooltip>
                </IconButton>

                <IconButton
                  onClick={() => handleSingleSubmit(cellValues.row.id)}
                >
                  <LightTooltip title="Submit">
                    <SendIcon />
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
      <div>
        <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
          <QuestionHead Heading={Heading} />
          <ResultHead
            Heading={GivingExam}
            onSearch={onSearchGivingExam}
            filterData={filterData}
            setFilterData={setFilterData}
            rowId={rowId}
            decryptedToken={decryptedToken}
            dashboard={true}
          />

          <TableView
            columns={givingcolumns}
            rows={filteredGivingExamData.map((row) => ({
              ...row,
              className: classes.tableRow,
            }))}
            Heading={GivingExam}
          />
        </div>
      </div>
    </>
  );
}
export default ExamDashboard;
