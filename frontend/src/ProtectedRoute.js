import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const allowedRoutes = [
    "/dashboard",
    "/buisness",
    "/business-segment-list",
    "/license-category-list",
    "/product",
    "/product-class-list",
    "/product-category-list",
    "/product-sub-category-list",
    "/marketer-list",
  ];

  return allowedRoutes.includes(location.pathname) ? (
    <Outlet />
  ) : (
    <Navigate to="/not-found" />
  );
};

export default ProtectedRoute;
