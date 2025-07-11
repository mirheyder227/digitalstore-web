import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { roots } from "../page/Routes/constans";

const AdminProtectedRoute = () => {
  const { user, token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to={roots.Login} replace />;
  if (!user || user.role !== "admin") return <Navigate to={roots.Home} replace />;
  return <Outlet />;
};

export default AdminProtectedRoute;
