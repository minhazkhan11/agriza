import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "./component/LoginPage/loginPage";
import Learner from "./component/Pages/Learner/ViewLearner/Learner";
import AddLearner from "./component/Pages/Learner/AddLearner/AddLearner";
import EditLearner from "./component/Pages/Learner/EditLearner/EditLearner";
import AssignLearner from "./component/Pages/Learner/AssignLearner/AssignLearner";
import Teacher from "./component/Pages/Teacher/ViewTeacher/Teacher";
import AddTeacher from "./component/Pages/Teacher/AddTeacher/AddTeacher";
import EditTeacher from "./component/Pages/Teacher/EditTeacher/EditTeacher";
import AssignTeacher from "./component/Pages/Teacher/AssignTeacher/AssignTeacher";
import Notes from "./component/Pages/Notes/ViewNotes/Notes";
import AddNotes from "./component/Pages/Notes/AddNotes/AddNotes";
import EditNotes from "./component/Pages/Notes/EditNotes/EditNotes";
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
import MyProfile from "./component/Pages/MyProfile/MyProfile";
import ChangePassword from "./component/Pages/ChangePassword/ChangePassword";
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
import TelecallerList from "./component/Pages/Telecaller/ViewTelecallerList/TelecallerList";
import Form from "./component/Pages/Form/ViewForm/Forms";
import CreateForm from "./component/Pages/Form/CreateForm/CreateForm";
import DoubtForum from "./component/Pages/DoubtForum/ViewDoubtForum/DoubtForum";
import Feedback from "./component/Pages/Feedback/ViewFeedback/Feedback";
import AddFeedback from "./component/Pages/Feedback/AddFeedback/AddFeedback";
import ReceivedFeedbacks from "./component/Pages/Feedback/ReceivedFeedbacks/ReceivedFeedbacks";
import Email from "./component/Pages/Email/ViewEmail/Email";
import ComposeEmail from "./component/Pages/Email/ComposeEmail/ComposeEmail";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import AllComments from "./component/Pages/DoubtForum/AllComments";
import TestSeries from "./component/Pages/TestSeries/ViewTestSeries/TestSeries";
import AddTestSeries from "./component/Pages/TestSeries/AddTestSeries/AddTestSeries";
import AddQuestionMainTestSeries from "./component/Pages/TestSeries/AddQuestion/AddQuestionMain(TestSeries)";
import EditTestSeries from "./component/Pages/TestSeries/EditTestSeries/EditTestSeries";
import EditSingleTest from "./component/Pages/TestSeries/AddQuestion/EditSingle(TestSeries)";
import EditSingleQuiz from "./component/Pages/Quizz/AddQuestion/EditSingle(Quiz)";
import Layout4 from "./Layout4";
import Layout5 from "./Layout5";
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
import WebDesign from "./component/Pages/WebDesign/WebDesign";
import AppDesign from "./component/Pages/AppDesign/AppDesign";
import EditFeedback from "./component/Pages/Feedback/EditFeedback/EditFeedback";
import SettingsMain from "./component/Pages/Settings/SettingsMain";


const HomePageRoutes = ({header, isLoggedIn, fetchDataFromAPI, layoutData, handleLogin}) => (
    <Routes>
    {header.find((item) => item.name === "Dashboard") && (
      <Route
        path="/admin/dashboard"
        element={isLoggedIn && <Dashboard />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Courses") && (
      <Route
        path="/admin/courses"
        element={isLoggedIn && <Courses />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Courses") && (
      <Route
        path="/admin/addcourses"
        element={isLoggedIn && <AddCourses />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Courses") && (
      <Route
        path="/admin/editcource/:rowId"
        element={isLoggedIn && <EditCourses />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Batch") && (
      <Route
        path="/admin/batch"
        element={isLoggedIn && <Batch />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Batch") && (
      <Route
        path="/admin/addbatch"
        element={isLoggedIn && <AddBatch />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Batch") && (
      <Route
        path="/admin/editbatch/:rowId"
        element={isLoggedIn && <EditBatch />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Subject") && (
      <Route
        path="/admin/subject"
        element={isLoggedIn && <Subject />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Subject") && (
      <Route
        path="/admin/addsubject"
        element={isLoggedIn && <AddSubject />}
      />
    )}
    {header
      .find((item) => item.name === "Master")
      ?.menu.find((item) => item.name === "Subject") && (
      <Route
        path="/admin/editsubject/:rowId"
        element={isLoggedIn && <EditSubject />}
      />
    )}
    {header
      .find((item) => item.name === "Learner")
      ?.menu.find((item) => item.name === "Add Learner") && (
      <Route
        path="/admin/learner"
        element={isLoggedIn && <Learner />}
      />
    )}
    {header
      .find((item) => item.name === "Learner")
      ?.menu.find((item) => item.name === "Add Learner") && (
      <Route
        path="/admin/addlearner"
        element={isLoggedIn && <AddLearner />}
      />
    )}
    {header
      .find((item) => item.name === "Learner")
      ?.menu.find((item) => item.name === "Add Learner") && (
      <Route
        path="/admin/editlearners/:rowId"
        element={isLoggedIn && <EditLearner />}
      />
    )}
    {header
      .find((item) => item.name === "Learner")
      ?.menu.find((item) => item.name === "Assign Learner") && (
      <Route
        path="/admin/assignlearner"
        element={isLoggedIn && <AssignLearner />}
      />
    )}
    {header
      .find((item) => item.name === "Learner")
      ?.menu.find((item) => item.name === "Assign Learner") && (
      <Route
        path="/admin/assignlearner/:selectedCource1/:selectedBatch1"
        element={isLoggedIn && <AssignLearner />}
      />
    )}
    {header
      .find((item) => item.name === "Teacher")
      ?.menu.find((item) => item.name === "Add Teacher") && (
      <Route
        path="/admin/teacher"
        element={isLoggedIn && <Teacher />}
      />
    )}
    {header
      .find((item) => item.name === "Teacher")
      ?.menu.find((item) => item.name === "Add Teacher") && (
      <Route
        path="/admin/addteacher"
        element={isLoggedIn && <AddTeacher />}
      />
    )}
    {header
      .find((item) => item.name === "Teacher")
      ?.menu.find((item) => item.name === "Add Teacher") && (
      <Route
        path="/admin/editteacher/:rowId"
        element={isLoggedIn && <EditTeacher />}
      />
    )}
    {header
      .find((item) => item.name === "Teacher")
      ?.menu.find((item) => item.name === "Assign Teacher") && (
      <Route
        path="/admin/assignteacher"
        element={isLoggedIn && <AssignTeacher />}
      />
    )}
    {header.find((item) => item.name === "Exam") && (
      <Route path="/admin/exam" element={isLoggedIn && <Exam />} />
    )}
    {header.find((item) => item.name === "Exam") && (
      <Route
        path="/admin/addexam"
        element={isLoggedIn && <AddExam />}
      />
    )}
    {header.find((item) => item.name === "Exam") && (
      <Route
        path="/admin/editexam/:rowId"
        element={isLoggedIn && <EditExam />}
      />
    )}
    {header.find((item) => item.name === "Exam") && (
      <Route
        path="/admin/examdashboard/:rowId"
        element={isLoggedIn && <ExamDashboard />}
      />
    )}
    {header.find((item) => item.name === "Exam") && (
      <Route
        path="/admin/examresult/:rowId"
        element={isLoggedIn && <ExamResult />}
      />
    )}

    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Notes") && (
      <Route
        path="/admin/notes"
        element={isLoggedIn && <Notes />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Notes") && (
      <Route
        path="/admin/addnotes"
        element={isLoggedIn && <AddNotes />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Notes") && (
      <Route
        path="/admin/editnotes/:rowId"
        element={isLoggedIn && <EditNotes />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Notes") && (
      <Route
        path="/admin/notesname/:rowId"
        element={isLoggedIn && <NotesName />}
      />
    )}

    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Online Videos") && (
      <Route
        path="/admin/onlinevideos"
        element={isLoggedIn && <OnlineVideo />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Online Videos") && (
      <Route
        path="/admin/editonlinevideo/:rowId"
        element={isLoggedIn && <EditOnlineVideo />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Online Videos") && (
      <Route
        path="/admin/addonlinevideo"
        element={isLoggedIn && <AddOnlineVideo />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Online Videos") && (
      <Route
        path="/admin/addvideolecture/:rowId"
        element={isLoggedIn && <VideoLectures />}
      />
    )}

    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Ebooks") && (
      <Route
        path="/admin/ebooks"
        element={isLoggedIn && <Ebooks />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Ebooks") && (
      <Route
        path="/admin/addebook"
        element={isLoggedIn && <AddEbook />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Ebooks") && (
      <Route
        path="/admin/editebook/:rowId"
        element={isLoggedIn && <EditEbook />}
      />
    )}
    {header
      .find((item) => item.name === "Content")
      ?.menu.find((item) => item.name === "Ebooks") && (
      <Route
        path="/admin/ebooksuploadplans/:rowId"
        element={isLoggedIn && <UploadPlans />}
      />
    )}

    {header.find((item) => item.name === "Test Series") && (
      <Route
        path="/admin/testseries"
        element={isLoggedIn && <TestSeries />}
      />
    )}
    {header.find((item) => item.name === "Test Series") && (
      <Route
        path="/admin/addtestseries"
        element={isLoggedIn && <AddTestSeries />}
      />
    )}
    {header.find((item) => item.name === "Test Series") && (
      <Route
        path="/admin/edittestseries/:rowId"
        element={isLoggedIn && <EditTestSeries />}
      />
    )}
    {header.find((item) => item.name === "Test Series") && (
      <Route
        path="/admin/addquestiontestseries/:rowId"
        element={isLoggedIn && <AddQuestionMainTestSeries />}
      />
    )}
    {header.find((item) => item.name === "Test Series") && (
      <Route
        path="/admin/editsingletest/:rowId"
        element={isLoggedIn && <EditSingleTest />}
      />
    )}

    {header.find((item) => item.name === "Live Classes") && (
      <Route
        path="/admin/liveclasses"
        element={isLoggedIn && <LiveClasses />}
      />
    )}
    {header.find((item) => item.name === "Live Classes") && (
      <Route
        path="/admin/addliveclasses"
        element={isLoggedIn && <AddLiveClasses />}
      />
    )}
    {header.find((item) => item.name === "Live Classes") && (
      <Route
        path="/admin/editliveclasses/:rowId"
        element={isLoggedIn && <EditLiveClasses />}
      />
    )}
    {header.find((item) => item.name === "Live Classes") && (
      <Route
        path="/admin/liveclassessedule/:rowId"
        element={isLoggedIn && <LiveClassesSedule />}
      />
    )}

    {header.find((item) => item.name === "Books") && (
      <Route
        path="/admin/books"
        element={isLoggedIn && <Books />}
      />
    )}
    {header.find((item) => item.name === "Books") && (
      <Route
        path="/admin/addbook"
        element={isLoggedIn && <AddBook />}
      />
    )}
    {header.find((item) => item.name === "Books") && (
      <Route
        path="/admin/editbook/:rowId"
        element={isLoggedIn && <EditBook />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Notes") && (
      <Route
        path="/admin/publishednotes"
        element={isLoggedIn && <PublishedNotes />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Notes") && (
      <Route
        path="/admin/editpublishednotes/:rowId"
        element={isLoggedIn && <EditPublishedNotes />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Notes") && (
      <Route
        path="/admin/editnotescontent/:rowId"
        element={isLoggedIn && <NotesContent />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Ebooks") && (
      <Route
        path="/admin/publishedebooks"
        element={isLoggedIn && <PublishedEbooks />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Ebooks") && (
      <Route
        path="/admin/editpublishedebooks/:rowId"
        element={isLoggedIn && <EditPublishedEbook />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Ebooks") && (
      <Route
        path="/admin/edituploadplans/:rowId"
        element={isLoggedIn && <EditUploadPlans />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find(
        (item) => item.name === "Published Test Series"
      ) && (
      <Route
        path="/admin/publishedtestseries"
        element={isLoggedIn && <PublishedTestSeries />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find(
        (item) => item.name === "Published Test Series"
      ) && (
      <Route
        path="/admin/editpublishedtestquestion/:rowId"
        element={isLoggedIn && <EditQuestionMainTestSeries />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Video") && (
      <Route
        path="/admin/publishedonlinevideo"
        element={isLoggedIn && <PublishedOnlineVideos />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Published Video") && (
      <Route
        path="/admin/editpublishedvideolecture/:rowId"
        element={isLoggedIn && <EditVideoLectures />}
      />
    )}
    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Orders") && (
      <Route
        path="/admin/orders"
        element={isLoggedIn && <Orders />}
      />
    )}

    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Wallet") && (
      <Route
        path="/admin/wallet"
        element={isLoggedIn && <Wallet />}
      />
    )}

    {header
      .find((item) => item.name === "Content Publication")
      ?.menu.find((item) => item.name === "Settlement") && (
      <Route
        path="/admin/settlement"
        element={isLoggedIn && <Settlement />}
      />
    )}


    {header.find((item) => item.name === "Doubt Fourm") && (
      <Route
        path="/admin/doubtforum"
        element={isLoggedIn && <DoubtForum />}
      />
    )}
    {header.find((item) => item.name === "Doubt Fourm") && (
      <Route
        path="/admin/allcomments"
        element={isLoggedIn && <AllComments />}
      />
    )}
    {header.find((item) => item.name === "Feedback") && (
      <Route
        path="/admin/feedback"
        element={isLoggedIn && <Feedback />}
      />
    )}
    {header.find((item) => item.name === "Feedback") && (
      <Route
        path="/admin/addfeedback"
        element={isLoggedIn && <AddFeedback />}
      />
    )}
    {header.find((item) => item.name === "Feedback") && (
      <Route
        path="/admin/editfeedback/:rowId"
        element={isLoggedIn && <EditFeedback />}
      />
    )}
    {header.find((item) => item.name === "Feedback") && (
      <Route
        path="/admin/receivedfeedbacks/:rowId"
        element={isLoggedIn && <ReceivedFeedbacks />}
      />
    )}
    {header.find((item) => item.name === "Time Table") && (
      <Route
        path="/admin/timetable"
        element={isLoggedIn && <Timetable />}
      />
    )}
    {header.find((item) => item.name === "Time Table") && (
      <Route
        path="/admin/addtimetable"
        element={isLoggedIn && <AddTimetable />}
      />
    )}
    {header.find((item) => item.name === "Time Table") && (
      <Route
        path="/admin/edittimetable/:rowId"
        element={isLoggedIn && <EditTimetable />}
      />
    )}
    {header.find((item) => item.name === "Time Table") && (
      <Route
        path="/admin/timetablesettings/:rowId"
        element={isLoggedIn && <TimetableSettings />}
      />
    )}

    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Text SMS") && (
      <Route
        path="/admin/textsms"
        element={isLoggedIn && <Sms />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Text SMS") && (
      <Route
        path="/admin/createsms"
        element={isLoggedIn && <CreateSms />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "WhatsApp") && (
      <Route
        path="/admin/whatsapp"
        element={isLoggedIn && <Whatsapp />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "WhatsApp") && (
      <Route
        path="/admin/createwhatsapp"
        element={isLoggedIn && <CreateWhatsapp />}
      />
    )}

    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Email") && (
      <Route
        path="/admin/email"
        element={isLoggedIn && <Email />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Email") && (
      <Route
        path="/admin/composeemail"
        element={isLoggedIn && <ComposeEmail />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Tellecaller") && (
      <Route
        path="/admin/telecaller"
        element={isLoggedIn && <Telecaller />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Tellecaller") && (
      <Route
        path="/admin/telecallerlist"
        element={isLoggedIn && <TelecallerList />}
      />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Forms") && (
      <Route path="/admin/forms" element={isLoggedIn && <Form />} />
    )}
    {header
      .find((item) => item.name === "Marketing")
      ?.menu.find((item) => item.name === "Forms") && (
      <Route
        path="/admin/createform"
        element={isLoggedIn && <CreateForm />}
      />
    )}

    {header.find((item) => item.name === "App Design") && (
      <Route
        path="/admin/appdesign"
        element={isLoggedIn && <AppDesign />}
      />
    )}

    {header.find((item) => item.name === "Web Design") && (
      <Route
        path="/admin/webdesign"
        element={isLoggedIn && <WebDesign />}
      />
    )}

    {header.find((item) => item.name === "Content Publication") && (
      <Route
        path="/admin/upgrade"
        element={isLoggedIn && <Upgrade />}
      />
    )}

    {/* <Route
      path="/admin/coaching"
      element={isLoggedIn && <Coaching />}
    />
    <Route
      path="/admin/addcoaching"
      element={isLoggedIn && <AddCoaching />}
    /> */}

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

    <Route
      path="/admin/addquestion/:rowId"
      element={isLoggedIn && <AddQuestionMain />}
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
      path="/admin/myprofile"
      element={
        isLoggedIn && (
          <MyProfile fetchDataFromAPI={fetchDataFromAPI} />
        )
      }
    />

    <Route
      path="/admin/settings"
      element={isLoggedIn && <SettingsMain fetchDataFromAPI={fetchDataFromAPI} />}
    />
    <Route
      path="/admin/changepassword"
      element={isLoggedIn && <ChangePassword />}
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
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default HomePageRoutes;