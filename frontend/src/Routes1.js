import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "./component/LoginPage/loginPage";
import Dashboard from "./component/Pages/Master/Dashboard/DashboardView/Dashboard";
import PremiumTwelveMonths from "./Routes/PremiumTwelveMonths";
import PremiumTwelveMonths1 from "./Routes/PremiumTwelveMonths1";
import AllPath from "./Routes/AllPath";
import ProtectedRoute from "./ProtectedRoute"; // Ensure this is imported

const HomePageRoutes = ({
  planName,
  isLoggedIn,
  fetchDataFromAPI,
  handleLogin,
  formFound,
  header,
}) => {
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

  return (
    <Routes>
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        {routesToRender.map((data, index) => (
          <Route
            key={index}
            path={data?.path}
            element={
              isLoggedIn && data?.path === "/dashboard" ? (
                <Dashboard header={header} />
              ) : isLoggedIn ? (
                data?.element
              ) : (
                <Navigate to="/" />
              )
            }
          />
        ))}
      </Route>

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
};

export default HomePageRoutes;
