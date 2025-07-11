import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "./component/LoginPage/loginPage";
// import MyProfile from "./component/Pages/MyProfile/MyProfile";
// import ChangePassword from "./component/Pages/ChangePassword/ChangePassword";
// import AddQuestionMain from "./component/Pages/Exam/AddQuestion/AddQuestionMain";
// import ExamResult from "./component/Pages/Exam/ExamResult/ExamResult";
// import AddQuizz from "./component/Pages/Quizz/AddQuizz/AddQuizz";
// import Quizz from "./component/Pages/Quizz/ViewQuizz/Quizz";
// import AddQuestionMainQuiz from "./component/Pages/Quizz/AddQuestion/AddQuestionMain(Quiz)";
// import EditQuizz from "./component/Pages/Quizz/EditQuizz/EditQuizz";
// import EditSingleQuiz from "./component/Pages/Quizz/AddQuestion/EditSingle(Quiz)";
// import SettingsMain from "./component/Pages/Settings/SettingsMain";
// import BasicThreeMonths from "./Routes/BasicThreeMonth";
// import BasicSixMonths from "./Routes/BasicSixMonths";
// import BasicTwelveMonths from "./Routes/StandardThreeMonths";
// import StandardThreeMonths from "./Routes/StandardThreeMonths";
// import StandardSixMonths from "./Routes/StandardSixMonths";
// import StandardTwelveMonths from "./Routes/StandardTwelveMonths";
// import PremiumThreeMonths from "./Routes/PremiumThreeMonths";
// import PremiumSixMonths from "./Routes/PremiumSixMonths";
import PremiumTwelveMonths from "./Routes/PremiumTwelveMonths";
import PremiumTwelveMonths1 from "./Routes/PremiumTwelveMonths1";
import AllPath from "./Routes/AllPath";
// import ZoomIntegration from "./component/Pages/LiveClasses/ZoomMeetingSDK/zoomSdk";
// import ZoomMeeting from "./component/Pages/LiveClasses/ZoomDirectMeet/zoomMeeting";
// import FormSubmission from "./component/Pages/FormSubmission/FormSubmission";
import Dashboard from "./component/Pages/Master/Dashboard/DashboardView/Dashboard";
// import Upgrade from "./component/Pages/Upgrade/Upgrade";
// import ExamScore from "./component/Pages/Exam/ExamResult/ExamScore";

const HomePageRoutes = ({
  planName,
  isLoggedIn,
  fetchDataFromAPI,
  layoutData,
  handleLogin,
  formFound,
  header,
}) => (
  <Routes>
   {(() => {
      let routesToRender;
      switch (planName) {
        case "Ariza_be_admin_Both_paid":
          routesToRender = PremiumTwelveMonths1;
          break;
        case "Agriza_superadmin":
          routesToRender = PremiumTwelveMonths;
          break;
        default:
          routesToRender = AllPath;
          break;
      }
      return routesToRender.map((data, index) => (
        <Route
          path={data?.path}
          element={
            isLoggedIn && data?.path === "/dashboard" ? (
              <Dashboard header={header} />
            ):isLoggedIn && data?.path === "/admin/upgrade" ? (
              <>{/* <Upgrade planName={planName} /> */}</>
            )
            
             : (
              isLoggedIn && data?.element
            )
          }
          key={index}
        />
        
        
      ));
    })()}

    {/* <Route path="/admin/quizz" element={isLoggedIn && <Quizz />} />
    <Route path="/admin/addquizz" element={isLoggedIn && <AddQuizz />} />
    <Route
      path="/admin/editquizz/:rowId"
      element={isLoggedIn && <EditQuizz />}
    /> */}
    {/* <Route
      path="/admin/addquestionquiz/:rowId"
      element={isLoggedIn && <AddQuestionMainQuiz />}
    />
    <Route
      path="/admin/editsinglequiz/:rowId"
      element={isLoggedIn && <EditSingleQuiz />}
    /> */}

    {/* <Route
      path="/admin/addquestion/:rowId"
      element={isLoggedIn && <AddQuestionMain />}
    />
    <Route
      path="/admin/examresult/:rowId"
      element={isLoggedIn && <ExamResult />}
    />
    <Route
      path="/admin/examresult/:rowId/examscore"
      element={isLoggedIn ? <ExamScore /> : <Navigate to="/" />}
    /> */}
    {/* <Route path="/admin/quizz" element={isLoggedIn && <Quizz />} />
    <Route path="/admin/addquizz" element={isLoggedIn && <AddQuizz />} /> */}
    {/* 
    <Route
      path="/admin/myprofile"
      element={isLoggedIn && <MyProfile fetchDataFromAPI={fetchDataFromAPI} />}
    />

    <Route
      path="/admin/settings"
      element={
        isLoggedIn && <SettingsMain fetchDataFromAPI={fetchDataFromAPI} />
      }
    />
    <Route
      path="/admin/changepassword"
      element={isLoggedIn && <ChangePassword />}
    /> */}
    {/* <Route path="/admin/zoom" element={isLoggedIn && <ZoomMeeting />} />
    <Route path="/admin/zoomsdk" element={isLoggedIn && <ZoomIntegration />} />
    <Route
      path="/admin/zoomredirect"
      element={isLoggedIn && <ZoomIntegration />}
    />
    <Route
      path="/:coachingname/:formId"
      element={formFound ? <FormSubmission /> : <LoginPage />}
    /> */}

    <Route
      path="/"
      element={
        isLoggedIn ? (
          <Navigate to="/dashboard" />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )
      }
    />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default HomePageRoutes;
