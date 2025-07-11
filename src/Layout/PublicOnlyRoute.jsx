import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { roots } from "../page/Routes/constans";

const PublicOnlyRoute = () => {
  const token = useSelector((state) => state.auth.token);
  return !token ? <Outlet /> : <Navigate to={roots.Home} replace />;
};

export default PublicOnlyRoute;
