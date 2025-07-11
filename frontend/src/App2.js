import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import LoginPage from "./component/LoginPage/loginPage";
import SidePannel from "./component/Menu/SidePannel";
import Learner from "./component/Pages/Learner/ViewLearner/Learner";
import AddLearner from "./component/Pages/Learner/AddLearner/AddLearner";
import EditLearner from "./component/Pages/Learner/EditLearner/EditLearner";
import AssignLearner from "./component/Pages/Learner/AssignLearner/AssignLearner";
import Teacher from "./component/Pages/Teacher/ViewTeacher/Teacher";
import AddTeacher from "./component/Pages/Teacher/AddTeacher/AddTeacher";
import EditTeacher from "./component/Pages/Teacher/EditTeacher/EditTeacher";
import AssignTeacher from "./component/Pages/Teacher/AssignTeacher/AssignTeacher";
import EditSingle from "./component/Pages/Exam/AddQuestion/EditSingle";
import Notes from "./component/Pages/Notes/ViewNotes/Notes";
import AddNotes from "./component/Pages/Notes/AddNotes/AddNotes";
import EditNotes from "./component/Pages/Notes/EditNotes/EditNotes";

import Coaching from "./component/Pages/Coaching/ViewCoaching/Coaching";
import AddCoaching from "./component/Pages/Coaching/AddCoaching/AddCoaching";

import Exam from "./component/Pages/Exam/ViewExam/Exam";
import AddExam from "./component/Pages/Exam/AddExam/AddExam";
import EditExam from "./component/Pages/Exam/EditExam/EditExam";
import Courses from "./component/Pages/Courses/ViewCourses/Courses";
import AddCourses from "./component/Pages/Courses/AddCourses/AddCourses";
import EditCourses from "./component/Pages/Courses/EditCourses/EditCourses";
import Subject from "./component/Pages/Subject/ViewSubject/Subject";
import AddSubject from "./component/Pages/Subject/AddSubject/AddSubject";
import EditSubject from "./component/Pages/Subject/EditSubject/EditSubject";
import EditBatch from "./component/Pages/Batch/EditBatch/EditBatch";
import Header from "./component/Menu/header";
import MyProfile from "./component/Pages/MyProfile/MyProfile";
import ChangePassword from "./component/Pages/ChangePassword/ChangePassword";
import ThemeProvider from "./ThemeProvider";
import useStyles from "./styles";
import Batch from "./component/Pages/Batch/ViewBatch/Batch";
import AddBatch from "./component/Pages/Batch/AddBatch/AddBatch";
import AddQuestionMain from "./component/Pages/Exam/AddQuestion/AddQuestionMain";
import ExamDashboard from "./component/Pages/Exam/ExamDashboard/ExamDashboard";
import ExamResult from "./component/Pages/Exam/ExamResult/ExamResult";
import OtpScreen from "./component/LoginPage/otpScreen";
import OnlineVideo from "./component/Pages/OnlineVideo/ViewOnlineVideo/OnlineVideo";
import AddOnlineVideo from "./component/Pages/OnlineVideo/AddOnlineVideo/AddOnlineVideo";
import AddQuizz from "./component/Pages/Quizz/AddQuizz/AddQuizz";
import Quizz from "./component/Pages/Quizz/ViewQuizz/Quizz";
import AddQuestionMainQuiz from "./component/Pages/Quizz/AddQuestion/AddQuestionMain(Quiz)";
import EditQuizz from "./component/Pages/Quizz/EditQuizz/EditQuizz";
import LiveClasses from "./component/Pages/LiveClasses/ViewLiveClasses/LiveClasses";
import AddLiveClasses from "./component/Pages/LiveClasses/AddLiveClasses/AddLiveClasses";
import AddQMainOnlineVideo from "./component/Pages/OnlineVideo/AddQuestion/AddQMainOnlineVideo";
import AddLecture from "./component/Pages/OnlineVideo/AddQuestion/AddLecture";
import LiveClassesSedule from "./component/Pages/LiveClasses/AddLiveClassesSedule/LiveClassesSedule";

import NotesName from "./component/Pages/Notes/NotesName/NotesName";
import EditOnlineVideo from "./component/Pages/OnlineVideo/EditOnlineVideo/EditOnlineVideo";
import Books from "./component/Pages/Books/ViewBooks/Books";
import AddBook from "./component/Pages/Books/AddBook/AddBook";
import Ebooks from "./component/Pages/Ebooks/ViewEbooks/Ebooks";
import EditBook from "./component/Pages/Books/EditBook/EditBook";
import AddEbook from "./component/Pages/Ebooks/AddEbook/AddEbook";
import UploadPlans from "./component/Pages/Ebooks/UploadPlans/UploadPlans";
import EditEbook from "./component/Pages/Ebooks/EditEbook/EditEbook";

import EditLiveClasses from "./component/Pages/LiveClasses/EditLiveClasses/EditLiveClasses";
import Sms from "./component/Pages/SMS/ViewSms/Sms";
import CreateSms from "./component/Pages/SMS/CreateSms/CreateSms";
import Timetable from "./component/Pages/Timetable/ViewTimetable/Timetable";
import AddTimetable from "./component/Pages/Timetable/AddTimetable/AddTimetable";
import EditTimetable from "./component/Pages/Timetable/EditTimetable/EditTimetable";
import TimetableSettings from "./component/Pages/Timetable/TimetableSettings/TimetableSettings";
import CreateWhatsapp from "./component/Pages/Whatsapp/CreateWhatsapp/CreateWhatsapp";
import Whatsapp from "./component/Pages/Whatsapp/ViewWhatsapp/Whatsapp";
import Dashboard from "./component/Pages/Dashboard/DashboardView/Dashboard";
import Telecaller from "./component/Pages/Telecaller/ViewTelecaller/Telecaller";
import Form from "./component/Pages/Form/ViewForm/Forms";
import CreateForm from "./component/Pages/Form/CreateForm/CreateForm";
import DoubtForum from "./component/Pages/DoubtForum/ViewDoubtForum/DoubtForum";
import Feedback from "./component/Pages/Feedback/ViewFeedback/Feedback";
import AddFeedback from "./component/Pages/Feedback/AddFeedback/AddFeedback";
import ReceivedFeedbacks from "./component/Pages/Feedback/ReceivedFeedbacks/ReceivedFeedbacks";
import EditFeedback from "./component/Pages/Feedback/EditFeedback/EditFeedback";
import Email from "./component/Pages/Email/ViewEmail/Email";
import ComposeEmail from "./component/Pages/Email/ComposeEmail/ComposeEmail";
import LayoutData from "./data";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import AllComments from "./component/Pages/DoubtForum/AllComments";
import Popupmain from "./component/Pages/PopupScreen/Popupmain";
import TestSeries from "./component/Pages/TestSeries/ViewTestSeries/TestSeries";
import AddTestSeries from "./component/Pages/TestSeries/AddTestSeries/AddTestSeries";
import AddQuestionMainTestSeries from "./component/Pages/TestSeries/AddQuestion/AddQuestionMain(TestSeries)";
import EditTestSeries from "./component/Pages/TestSeries/EditTestSeries/EditTestSeries";
import EditSingleTest from "./component/Pages/TestSeries/AddQuestion/EditSingle(TestSeries)";
import EditSingleQuiz from "./component/Pages/Quizz/AddQuestion/EditSingle(Quiz)";
import Layout4 from "./Layout4";
import Layout5 from "./Layout5";
import axios from "axios";
import { decryptData } from "./crypto";
import Orders from "./component/Pages/Orders/ViewOrders/Orders";
import Settlement from "./component/Pages/Settlement/ViewSettlement/Settlement";
import Wallet from "./component/Pages/Wallet/ViewWallet/Wallet";
import PublishedNotes from "./component/Pages/PublishedNotes/ViewPublishedNotes/PublishedNotes";
import PublishedEbooks from "./component/Pages/PublishedEbooks/ViewPublishedEbooks/PublishedEbooks";
import PublishedTestSeries from "./component/Pages/PublishedTestSeries/ViewPublishedTestSeries/PublishedTestSeries";
import PublishedOnlineVideos from "./component/Pages/PublishedOnlineVideos/ViewPublishedOnlineVideos/PublishedOnlineVideos";
import EditPublishedNotes from "./component/Pages/PublishedNotes/EditPublishedNotes/EditPublishedNotes";
import NotesContent from "./component/Pages/PublishedNotes/EditNotesContent/NotesContent";
import EditPublishedEbook from "./component/Pages/PublishedEbooks/EditPublishedEbook/EditPublishedEbook";
import EditUploadPlans from "./component/Pages/PublishedEbooks/EditUploadPlans/EditUploadPlans";
import EditQuestionMainTestSeries from "./component/Pages/PublishedTestSeries/EditQuestion/EditQuestionMainTestSeries";
import VideoLectures from "./component/Pages/OnlineVideo/AddLecture/VideoLectures";
import EditVideoLectures from "./component/Pages/PublishedOnlineVideos/EditLecture/EditVideoLectures";
import Upgrade from "./component/Pages/Upgrade/Upgrade";

function App() {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [parsedUserData, setParsedUserData] = useState("");
  const [header, setHeader] = useState([]);

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const decryptedUserName = JSON.stringify(
    decryptData(sessionStorage.getItem("userName"))
  );

  useEffect(() => {
    if (decryptedUserName) {
      setParsedUserData(decryptedUserName.trim().replace(/"/g, ""));
    }
  }, []);

  const [globalProfileImageState, setGlobalProfileImageState] = useState({
    image: "",
    name: "",
  });

  const dynamicPath = window.location.pathname.substring(1);
  const layoutData = LayoutData.find((item) => item.name === dynamicPath);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("userName");
    if (token && userName) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleMenuCollapse = () => {
    setMenuCollapse(!menuCollapse);
  };

  const fetchMainMenuDataFromAPI = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/main_menu`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data?.menu;
        setHeader(data);
      } else {
        console.log("data not found");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    fetchMainMenuDataFromAPI();
  }, [isLoggedIn]);

  const fetchDataFromAPI = async (decryptedToken) => {
    try {
      if (!decryptedToken) {
        console.error("Token is null");
        return;
      }

      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/profile`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      setGlobalProfileImageState((prev) => ({
        ...prev,
        name: response?.data?.user?.first_name,
      }));
      setGlobalProfileImageState((prev) => ({
        ...prev,
        image: response?.data?.user?.image_url,
      }));

      return response;
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decryptedToken = decryptData(token);
      fetchDataFromAPI(decryptedToken);
    } else {
      console.error("Token is null");
    }
  }, [isLoggedIn]);

  return (
    <React.StrictMode>
      <ThemeProvider>
        {({ darkMode, toggleDarkMode }) => (
          <div className={`${classes.dflex} ${classes.w100}`}>
            {isLoggedIn && (
              <div className={`${menuCollapse ? classes.w5 : classes.w18}`}>
                {" "}
                <SidePannel
                  menuCollapse={menuCollapse}
                  globalProfileImageState={globalProfileImageState}
                  fetchMainMenuDataFromAPI={fetchMainMenuDataFromAPI}
                  header={header}
                />
              </div>
            )}

            <div
              className={
                layoutData
                  ? `${classes.w100}`
                  : `${menuCollapse ? classes.w100 : classes.w85} ${
                      classes.h100vh
                    }`
              }
            >
              {isLoggedIn && (
                <div className={classes.header}>
                  <Header
                    handleMenuCollapse={handleMenuCollapse}
                    menuCollapse={menuCollapse}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </div>
              )}
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={isLoggedIn && <Dashboard />}
                />

                <Route
                  path="/admin/courses"
                  element={isLoggedIn && <Courses />}
                />

                <Route
                  path="/admin/addcourses"
                  element={isLoggedIn && <AddCourses />}
                />

                <Route
                  path="/admin/editcource/:rowId"
                  element={isLoggedIn && <EditCourses />}
                />

                <Route path="/admin/batch" element={isLoggedIn && <Batch />} />
                <Route
                  path="/admin/addbatch"
                  element={isLoggedIn && <AddBatch />}
                />

                <Route
                  path="/admin/editbatch/:rowId"
                  element={isLoggedIn && <EditBatch />}
                />

                <Route
                  path="/admin/subject"
                  element={isLoggedIn && <Subject />}
                />
                <Route
                  path="/admin/addsubject"
                  element={isLoggedIn && <AddSubject />}
                />

                <Route
                  path="/admin/editsubject/:rowId"
                  element={isLoggedIn && <EditSubject />}
                />

                <Route
                  path="/admin/learner"
                  element={isLoggedIn && <Learner />}
                />
                <Route
                  path="/admin/assignlearner"
                  element={isLoggedIn && <AssignLearner />}
                />
                <Route
                  path="/admin/assignlearner/:selectedCource1/:selectedBatch1"
                  element={isLoggedIn && <AssignLearner />}
                />
                <Route
                  path="/admin/addlearner"
                  element={isLoggedIn && <AddLearner />}
                />
                <Route
                  path="/admin/editlearners/:rowId"
                  element={isLoggedIn && <EditLearner />}
                />
                <Route
                  path="/admin/teacher"
                  element={isLoggedIn && <Teacher />}
                />
                <Route
                  path="/admin/addteacher"
                  element={isLoggedIn && <AddTeacher />}
                />
                <Route
                  path="/admin/editteacher/:rowId"
                  element={isLoggedIn && <EditTeacher />}
                />

                <Route path="/admin/notes" element={isLoggedIn && <Notes />} />
                <Route
                  path="/admin/addnotes"
                  element={isLoggedIn && <AddNotes />}
                />
                <Route
                  path="/admin/editnotes/:rowId"
                  element={isLoggedIn && <EditNotes />}
                />
                <Route
                  path="/admin/notesname/:rowId"
                  element={isLoggedIn && <NotesName />}
                />

                <Route
                  path="/admin/changepassword"
                  element={isLoggedIn && <ChangePassword />}
                />
                {header.find((item) => item.name === "Exam") && (
                  <Route path="/admin/exam" element={isLoggedIn && <Exam />} />
                )}
                <Route
                  path="/admin/addexam"
                  element={isLoggedIn && <AddExam />}
                />
                <Route
                  path="/admin/addonlinevideo"
                  element={isLoggedIn && <AddOnlineVideo />}
                />
                <Route
                  path="/admin/addvideolecture/:rowId"
                  element={isLoggedIn && <VideoLectures />}
                />
                <Route
                  path="/admin/liveclassessedule/:rowId"
                  element={isLoggedIn && <LiveClassesSedule />}
                />

                <Route
                  path="/admin/editexam/:rowId"
                  element={isLoggedIn && <EditExam />}
                />
                <Route
                  path="/admin/liveclasses"
                  element={isLoggedIn && <LiveClasses />}
                />
                <Route
                  path="/admin/addliveclasses"
                  element={isLoggedIn && <AddLiveClasses />}
                />
                <Route
                  path="/admin/editliveclasses/:rowId"
                  element={isLoggedIn && <EditLiveClasses />}
                />
                <Route
                  path="/admin/coaching"
                  element={isLoggedIn && <Coaching />}
                />
                <Route
                  path="/admin/addcoaching"
                  element={isLoggedIn && <AddCoaching />}
                />
                <Route
                  path="/admin/assignteacher"
                  element={isLoggedIn && <AssignTeacher />}
                />
                <Route
                  path="/admin/myprofile"
                  element={
                    isLoggedIn && (
                      <MyProfile fetchDataFromAPI={fetchDataFromAPI} />
                    )
                  }
                />
                <Route
                  path="/admin/onlinevideos"
                  element={isLoggedIn && <OnlineVideo />}
                />
                <Route
                  path="/admin/editonlinevideo/:rowId"
                  element={isLoggedIn && <EditOnlineVideo />}
                />

                <Route
                  path="/admin/examdashboard/:rowId"
                  element={isLoggedIn && <ExamDashboard />}
                />
                <Route
                  path="/admin/examresult/:rowId"
                  element={isLoggedIn && <ExamResult />}
                />
                <Route path="/admin/quizz" element={isLoggedIn && <Quizz />} />
                <Route
                  path="/admin/addquizz"
                  element={isLoggedIn && <AddQuizz />}
                />
                <Route
                  path="/admin/editquizz/:rowId"
                  element={isLoggedIn && <EditQuizz />}
                />
                <Route
                  path="/admin/addquestionquiz/:rowId"
                  element={isLoggedIn && <AddQuestionMainQuiz />}
                />
                <Route
                  path="/admin/editsinglequiz/:rowId"
                  element={isLoggedIn && <EditSingleQuiz />}
                />
                <Route path="/admin/books" element={isLoggedIn && <Books />} />
                <Route
                  path="/admin/addbook"
                  element={isLoggedIn && <AddBook />}
                />
                <Route
                  path="/admin/editbook/:rowId"
                  element={isLoggedIn && <EditBook />}
                />
                <Route
                  path="/admin/ebooks"
                  element={isLoggedIn && <Ebooks />}
                />
                <Route
                  path="/admin/addebook"
                  element={isLoggedIn && <AddEbook />}
                />
                <Route
                  path="/admin/editebook/:rowId"
                  element={isLoggedIn && <EditEbook />}
                />
                <Route
                  path="/admin/ebooksuploadplans/:rowId"
                  element={isLoggedIn && <UploadPlans />}
                />
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/admin/dashboard" />
                    ) : (
                      <LoginPage onLogin={handleLogin} />
                    )
                  }
                />
                <Route path="/admin/textsms" element={isLoggedIn && <Sms />} />
                <Route
                  path="/admin/createsms"
                  element={isLoggedIn && <CreateSms />}
                />
                <Route
                  path="/admin/whatsapp"
                  element={isLoggedIn && <Whatsapp />}
                />
                <Route
                  path="/admin/createwhatsapp"
                  element={isLoggedIn && <CreateWhatsapp />}
                />
                <Route
                  path="/admin/telecaller"
                  element={isLoggedIn && <Telecaller />}
                />
                <Route path="/admin/forms" element={isLoggedIn && <Form />} />

                <Route
                  path="/admin/addquestion/:rowId"
                  element={isLoggedIn && <AddQuestionMain />}
                />
                <Route
                  path="/admin/createform"
                  element={isLoggedIn && <CreateForm />}
                />
                <Route
                  path="/admin/doubtforum"
                  element={isLoggedIn && <DoubtForum />}
                />
                <Route
                  path="/admin/allcomments"
                  element={isLoggedIn && <AllComments />}
                />

                <Route
                  path="/admin/examresult/:rowId"
                  element={isLoggedIn && <ExamResult />}
                />
                <Route path="/admin/quizz" element={isLoggedIn && <Quizz />} />
                <Route
                  path="/admin/addquizz"
                  element={isLoggedIn && <AddQuizz />}
                />

                <Route
                  path="/admin/timetable"
                  element={isLoggedIn && <Timetable />}
                />
                <Route
                  path="/admin/addtimetable"
                  element={isLoggedIn && <AddTimetable />}
                />
                <Route
                  path="/admin/edittimetable/:rowId"
                  element={isLoggedIn && <EditTimetable />}
                />
                <Route
                  path="/admin/timetablesettings/:rowId"
                  element={isLoggedIn && <TimetableSettings />}
                />

                <Route
                  path="/admin/feedback"
                  element={isLoggedIn && <Feedback />}
                />
                
                  <Route
                    path="/admin/addfeedback"
                    element={isLoggedIn && <AddFeedback />}
                  />
                
               
                  <Route
                    path="/admin/editfeedback/:rowId"
                    element={isLoggedIn && <EditFeedback />}
                  />
               
               
                  <Route
                    path="/admin/receivedfeedbacks/:rowId"
                    element={isLoggedIn && <ReceivedFeedbacks />}
                  />
               
                <Route path="/admin/email" element={isLoggedIn && <Email />} />
                <Route
                  path="/admin/composeemail"
                  element={isLoggedIn && <ComposeEmail />}
                />
                <Route
                  path="/admin/upgrade"
                  element={isLoggedIn && <Upgrade />}
                />

                <Route
                  path="/:dynamicPath"
                  element={(() => {
                    if (layoutData) {
                      switch (layoutData.layout.layouttype) {
                        case "layout1":
                          return <Layout1 />;
                        case "layout2":
                          return <Layout2 />;
                        case "layout3":
                          return <Layout3 />;
                        case "layout4":
                          return <Layout4 />;
                        case "layout5":
                          return <Layout5 />;
                        default:
                          return null;
                      }
                    }
                    return null;
                  })()}
                />

                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/admin/dashboard" />
                    ) : (
                      <LoginPage onLogin={handleLogin} />
                    )
                  }
                />
                <Route
                  path="/otpscreen/:a"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/admin/dashboard" />
                    ) : (
                      <OtpScreen onLogin={handleLogin} />
                    )
                  }
                />
                <Route
                  path="/admin/testseries"
                  element={isLoggedIn && <TestSeries />}
                />
                <Route
                  path="/admin/addtestseries"
                  element={isLoggedIn && <AddTestSeries />}
                />
                <Route
                  path="/admin/edittestseries/:rowId"
                  element={isLoggedIn && <EditTestSeries />}
                />
                <Route
                  path="/admin/addquestiontestseries/:rowId"
                  element={isLoggedIn && <AddQuestionMainTestSeries />}
                />
                <Route
                  path="/admin/editsingletest/:rowId"
                  element={isLoggedIn && <EditSingleTest />}
                />
                <Route
                  path="/admin/orders"
                  element={isLoggedIn && <Orders />}
                />
                <Route
                  path="/admin/settlement"
                  element={isLoggedIn && <Settlement />}
                />
                <Route
                  path="/admin/wallet"
                  element={isLoggedIn && <Wallet />}
                />
                <Route
                  path="/admin/publishednotes"
                  element={isLoggedIn && <PublishedNotes />}
                />
                <Route
                  path="/admin/editpublishednotes/:rowId"
                  element={isLoggedIn && <EditPublishedNotes />}
                />
                <Route
                  path="/admin/editnotescontent/:rowId"
                  element={isLoggedIn && <NotesContent />}
                />
                <Route
                  path="/admin/publishedebooks"
                  element={isLoggedIn && <PublishedEbooks />}
                />
                <Route
                  path="/admin/editpublishedebooks/:rowId"
                  element={isLoggedIn && <EditPublishedEbook />}
                />
                <Route
                  path="/admin/edituploadplans/:rowId"
                  element={isLoggedIn && <EditUploadPlans />}
                />
                <Route
                  path="/admin/publishedtestseries"
                  element={isLoggedIn && <PublishedTestSeries />}
                />
                <Route
                  path="/admin/editpublishedtestquestion/:rowId"
                  element={isLoggedIn && <EditQuestionMainTestSeries />}
                />
                <Route
                  path="/admin/publishedonlinevideo"
                  element={isLoggedIn && <PublishedOnlineVideos />}
                />
                <Route
                  path="/admin/editpublishedvideolecture/:rowId"
                  element={isLoggedIn && <EditVideoLectures />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        )}
      </ThemeProvider>
    </React.StrictMode>
  );
}
export default App;
