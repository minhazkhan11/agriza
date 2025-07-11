import { Button, IconButton, Typography } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptData } from "../../../../crypto";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import ResultHead from "../../../CustomComponent/ResultHead";
import TableView from "../../../CustomComponent/TableView";
import { ReactComponent as ResultIcon } from "../../../images/questionimage/resulticon.svg";

function ExamResult() {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [fileURL, setFileURL] = useState("");
  const navigate = useNavigate();
  const params = useParams();

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

  const fetchData = async (rowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/result/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      setResults(response.data.exam_results);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    fetchData(rowId);
  }, [rowId]);

  // const exportResultApi = async (rowId) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/export/${rowId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       // toast.success("Result CSV has been downloaded successfully.");
  //       setFileURL(response.data.file_url);
  //     } else {
  //       // toast.error("Failed to download the CSV file.");
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response && error.response.data.message ? error.response.data.message : "An error occurred while fetching the data.";
  //     // toast.error(errorMessage);
  //   }
  // };
  // useEffect(() => {
  //   exportResultApi(rowId);
  // }, [rowId]);

  const navigateToAnswer = async (userId, student_name) => {
    console.log(userId);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/result/${rowId}`,
        {
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log(response);
      if (response.data.success === true) {
        const examResult = response.data;
        navigate(`/admin/examresult/:${params.rowId}/examscore`, {
          state: {
            examResult: JSON.stringify(examResult),
            studentName: student_name,
            examName: examDetails.examName,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const rows = results.map((d) => ({
    id: d.id ? d.id : "N/A",
    student_name: d.student_name ? d.student_name : "N/A",
    phone: d.phone ? d.phone : "N/A",
    received_marks:
      d.received_marks !== null && d.received_marks !== undefined
        ? d.received_marks
        : "N/A",

    correct_answer:
      d.correct_answer !== null && d.correct_answer !== undefined
        ? d.correct_answer
        : "N/A",
    incorrect_answer:
      d.incorrect_answer !== null && d.incorrect_answer !== undefined
        ? d.incorrect_answer
        : "N/A",
    user_id: d.user_id,

    email: d.email ? d.email : "N/A",
    total_score: d.total_score ? d.total_score : "N/A",
    total_questions: d.total_questions ? d.total_questions : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      console.log("bbbb", d);
      const student_name = d.student_name || "N/A";
      const isSearchMatch = student_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const Result = [
    {
      id: 1,
      pageicon: <ResultIcon />,
      mainheading: "Students Results",
      searchlabel: "Search By Student Name",
      placeholder: "Search By Class",
      style: "viewtable",
      height: "h61vh",
      report1:"Report 1",
      report2:"Report 2",
      report3:"Report 3",
    },
  ];
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
      field: "student_name",
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
      headerName: "ID",
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
      field: "total_questions",
      headerName: "Total Questions",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "correct_answer",
      headerName: "Correct Answers",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "incorrect_answer",
      headerName: "Incorrect Answers",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "received_marks",
      headerName: "Recieved Marks",
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
      headerName: "View Result",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 100,
      autoPageSize: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<DownloadIcon color="success" />}
              onClick={() =>
                navigateToAnswer(params.row.user_id, params.row.student_name)
              }
            />
          </div>
        );
      },
    },
  ];

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

  return (
    <>
      <ToastContainer />
      <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
        <QuestionHead Heading={Heading} />
        <div className={`${classes.mt1}`}>
          <ResultHead
            result={true}
            rowId={rowId}
            decryptedToken={decryptedToken}
            onSearch={handleSearch}
            Heading={Result}
          />
          <TableView columns={columns} rows={filteredRows} Heading={Result} />
        </div>
      </div>
    </>
  );
}
export default ExamResult;

const RESPONSE = {
  data: {
    success: true,
    message:
      "Congratulations! You have successfully passed the exam. Great job!",
    summary: {
      exam_id: 7,
      user_id: 462,
      total_marks: 180,
      received_marks: 2,
      correct_answer: 10,
      markedWithAnswered: 4,
      markedWithotAnswered: 15,
      attemptedWithAnswered: 0,
      attemptedWithoutAnswered: 1,
      incorrect_answer: 20,
      time_taken: 18346,
      result_status: "pass",
    },
    result: [
      {
        id: 314,
        question_en:
          "<p><strong>The sum of n terms of the series 1 − 2 + 3 − 4 + 5 − 6 + ... is&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1221,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/677f202f-cba3-4f3c-b993-b667a0424281_1728039177144_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1222,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/d9d26abd-7865-4b4a-8ba0-b53a2e5e4422_1728039177147_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/9394abe7-1507-47da-8261-66572a8cd262_1728039177148_image.jpeg" alt="Image"/></p>',
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1223,
            option_en: "<p>−n(n+1)&nbsp;</p>",
            option_hi: "",
            solution_en: "<p>−n(n+1)&nbsp;</p><p><br></p>",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1224,
            option_en: "<p>&nbsp;None of these&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 315,
        question_en:
          "<p><strong>If tan 1° tan 2° ... tan 89° = x2 – 8, then the value of x can be&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1225,
            option_en: "<p>-1\t</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1226,
            option_en: "<p>1</p>",
            option_hi: "",
            solution_en: "<p>1</p>",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1227,
            option_en: "<p>3</p>",
            option_hi: "",
            solution_en: "<p>3</p>",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1228,
            option_en: "<p>-3</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 316,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/3346180f-0004-42e3-ab3b-8e79e6575ca2_1728039435550_image.png" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1229,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/42c37dfb-c03f-479a-ad3d-e1a563b570e1_1728039435556_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1230,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/02a96bd7-6309-46eb-a01e-f5157068679d_1728039435559_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "<p>correct</p>",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1231,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/9abc0505-b96b-4844-89a2-a08beae01547_1728039435562_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "<p>corrct</p>",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1232,
            option_en: "<p>None of these&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 317,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/1fa8f366-bdd3-4d83-aa46-9bfb409d1a16_1728039795959_image.png" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1233,
            option_en: "<p>sin 36°&nbsp;</p>",
            option_hi: "",
            solution_en: "<",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1234,
            option_en: "<p>cos 36°&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: "1234",
          },
          {
            id: 1235,
            option_en: "<p>Sin 7°&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1236,
            option_en: "<p>cos 7°&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 318,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/6e237646-c701-46c0-ac2c-1ddd01148fe7_1728039846756_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1237,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/bf1f804a-a8b2-4e93-859d-67e0bc79e52f_1728039846770_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1238,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/b7bf8848-a2af-4d30-bfd1-06a9532e2d45_1728039846778_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "p",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: "1238",
          },
          {
            id: 1239,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/835ae5ee-6ed8-417f-b38f-96124ed845e4_1728039846801_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1240,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/654d922f-adef-49ef-866a-0f7131a8f634_1728039846812_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 319,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/dbc10d8f-02ea-448f-8cce-3e3274f2a944_1728039990132_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1241,
            option_en: "<p>Real and equal </p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1242,
            option_en: "<p>Real and unequal</p><p><br></p>",
            option_hi: "",
            solution_en: "p",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: "1242",
          },
          {
            id: 1243,
            option_en: "<p>Imaginary </p><p>identical is </p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1244,
            option_en: "<p>One real and one imaginary&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 320,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/ce2c0973-1b8c-400f-ac2c-79799cac3c07_1728040636819_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1245,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/db3290d4-5a8d-414f-9623-387e7d07685a_1728040636823_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1246,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/d25a65ab-5bad-43e7-bf4e-8b570aa5a307_1728040636827_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: "1246",
          },
          {
            id: 1247,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/1c92fc9b-4da5-4890-a9ef-8c63cb475e5c_1728040636830_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: ">",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1248,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/ce000ff8-5673-4f2b-81ec-0793445cef3f_1728040636832_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 321,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/35b2dcb2-7ecb-42dd-bac7-a63de9bda281_1728040706145_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1249,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1250,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1251,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1252,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 322,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/eaf80523-5fd4-4e5c-9e3c-557550f8bce4_1728040730840_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1253,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1254,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1255,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1256,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 323,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/02c51b71-6263-4d0c-9b2d-642381bfa78c_1728040750877_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1257,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1258,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1259,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1260,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 324,
        question_en:
          "<p><strong>If 1 +2 +3 +...+2003 = (2003) (4007) (334) and (1) (2003) + (2) (2002) + (3) (2001) + .... + (2003) (1) = (2003) (334) (x), then x equals&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1261,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1262,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1263,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1264,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 325,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/e95c0542-a4c7-489f-8f40-60346eb85de7_1728040838393_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1265,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1266,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1267,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1268,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 326,
        question_en:
          "<p>Balls are arranged in rows to form an equilateral triangle. The first row consists of one ball, the second row of two balls and so on. If 669 more balls are added then all the balls can be arranged in the shape of a square and each of the sides then contains 8 balls less than each side of the triangle did. The initial number of balls is&nbsp;</p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1269,
            option_en: "",
            option_hi: "",
            solution_en: "1.1",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1270,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1271,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1272,
            option_en: "",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 327,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/495ce8b5-8955-4f42-98ca-7f4883cce2d3_1728040945082_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1273,
            option_en: "<p> A−(S);B−(R);C−(P);D−(Q) </p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1274,
            option_en: "<p> A−(R);B−(S);C−(Q);D−(P) </p>",
            option_hi: "",
            solution_en: "p",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1275,
            option_en: "<p>A−(R);B−(P);C−(Q);D−(S) </p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1276,
            option_en: "<p> A−(R);B−(S);C−(P);D−(Q)&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 328,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/b29135c4-5b53-4cc0-b8d1-0a59012e2f57_1728041067515_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1277,
            option_en: "<p>A−(R);B−(P);C−(Q);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1278,
            option_en: "<p>A−(R);B−(P);C−(S);D−(Q)&nbsp;</p>",
            option_hi: "",
            solution_en: "p",
            solution_hi: "",
            correct_option: true,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1279,
            option_en: "<p>A−(P);B−(R);C−(Q);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1280,
            option_en: "<p>A−(R);B−(Q);C−(P);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: "",
            solution_hi: "",
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 331,
        question_en:
          "<p><strong>The sum of n terms of the series 1 − 2 + 3 − 4 + 5 − 6 + ... is&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1289,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/677f202f-cba3-4f3c-b993-b667a0424281_1728039177144_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1290,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/d9d26abd-7865-4b4a-8ba0-b53a2e5e4422_1728039177147_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1291,
            option_en: "<p>−n(n+1)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1292,
            option_en: "<p>&nbsp;None of these&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 332,
        question_en:
          "<p><strong>If tan 1° tan 2° ... tan 89° = x2 – 8, then the value of x can be&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1293,
            option_en: "<p>-1\t</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1294,
            option_en: "<p>1</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1295,
            option_en: "<p>3</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1296,
            option_en: "<p>-3</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 333,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/3346180f-0004-42e3-ab3b-8e79e6575ca2_1728039435550_image.png" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1297,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/42c37dfb-c03f-479a-ad3d-e1a563b570e1_1728039435556_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1298,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/02a96bd7-6309-46eb-a01e-f5157068679d_1728039435559_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1299,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/9abc0505-b96b-4844-89a2-a08beae01547_1728039435562_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1300,
            option_en: "<p>None of these&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 334,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/1fa8f366-bdd3-4d83-aa46-9bfb409d1a16_1728039795959_image.png" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1301,
            option_en: "<p>sin 36°&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1302,
            option_en: "<p>cos 36°&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1303,
            option_en: "<p>Sin 7°&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1304,
            option_en: "<p>cos 7°&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 335,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/6e237646-c701-46c0-ac2c-1ddd01148fe7_1728039846756_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1305,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/bf1f804a-a8b2-4e93-859d-67e0bc79e52f_1728039846770_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1306,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/b7bf8848-a2af-4d30-bfd1-06a9532e2d45_1728039846778_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1307,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/835ae5ee-6ed8-417f-b38f-96124ed845e4_1728039846801_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1308,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/654d922f-adef-49ef-866a-0f7131a8f634_1728039846812_image.jpeg" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 336,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/dbc10d8f-02ea-448f-8cce-3e3274f2a944_1728039990132_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1309,
            option_en: "<p>Real and equal </p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1310,
            option_en: "<p>Real and unequal</p><p><br></p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1311,
            option_en: "<p>Imaginary </p><p>identical is </p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1312,
            option_en: "<p>One real and one imaginary&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 337,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/ce2c0973-1b8c-400f-ac2c-79799cac3c07_1728040636819_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1313,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/db3290d4-5a8d-414f-9623-387e7d07685a_1728040636823_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1314,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/d25a65ab-5bad-43e7-bf4e-8b570aa5a307_1728040636827_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1315,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/1c92fc9b-4da5-4890-a9ef-8c63cb475e5c_1728040636830_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1316,
            option_en:
              '<p><img src="https://api.parikshado.com/uploads/b2b/exams/options/ce000ff8-5673-4f2b-81ec-0793445cef3f_1728040636832_image.png" alt="Image"/></p>',
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 338,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/35b2dcb2-7ecb-42dd-bac7-a63de9bda281_1728040706145_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1317,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1318,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1319,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1320,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 339,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/eaf80523-5fd4-4e5c-9e3c-557550f8bce4_1728040730840_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1321,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1322,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1323,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1324,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 340,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/02c51b71-6263-4d0c-9b2d-642381bfa78c_1728040750877_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1325,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1326,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1327,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1328,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 341,
        question_en:
          "<p><strong>If 1 +2 +3 +...+2003 = (2003) (4007) (334) and (1) (2003) + (2) (2002) + (3) (2001) + .... + (2003) (1) = (2003) (334) (x), then x equals&nbsp;</strong></p><p><br></p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1329,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1330,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1331,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1332,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 342,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/e95c0542-a4c7-489f-8f40-60346eb85de7_1728040838393_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1333,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1334,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1335,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1336,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 343,
        question_en:
          "<p>Balls are arranged in rows to form an equilateral triangle. The first row consists of one ball, the second row of two balls and so on. If 669 more balls are added then all the balls can be arranged in the shape of a square and each of the sides then contains 8 balls less than each side of the triangle did. The initial number of balls is&nbsp;</p>",
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1337,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1338,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1339,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1340,
            option_en: "",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 344,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/495ce8b5-8955-4f42-98ca-7f4883cce2d3_1728040945082_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1341,
            option_en: "<p> A−(S);B−(R);C−(P);D−(Q) </p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1342,
            option_en: "<p> A−(R);B−(S);C−(Q);D−(P) </p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1343,
            option_en: "<p>A−(R);B−(P);C−(Q);D−(S) </p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1344,
            option_en: "<p> A−(R);B−(S);C−(P);D−(Q)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
      {
        id: 345,
        question_en:
          '<p><img src="https://api.parikshado.com/uploads/b2b/exams/questions/b29135c4-5b53-4cc0-b8d1-0a59012e2f57_1728041067515_image.jpeg" alt="Image"/></p>',
        question_hi: "",
        description_en: "",
        description_hi: "",
        options: [
          {
            id: 1345,
            option_en: "<p>A−(R);B−(P);C−(Q);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1346,
            option_en: "<p>A−(R);B−(P);C−(S);D−(Q)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1347,
            option_en: "<p>A−(P);B−(R);C−(Q);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
          {
            id: 1348,
            option_en: "<p>A−(R);B−(Q);C−(P);D−(S)&nbsp;</p>",
            option_hi: "",
            solution_en: null,
            solution_hi: null,
            correct_option: false,
            description_en: "",
            description_hi: "",
            selected_option: null,
          },
        ],
      },
    ],
    count: 30,
  },
};
